from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

from fastapi import FastAPI, APIRouter, HTTPException, BackgroundTasks, Request, Depends
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pydantic import BaseModel, Field, EmailStr, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta

import bcrypt
import jwt
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

JWT_ALGORITHM = "HS256"
TOKEN_TTL_HOURS = 8


# ----- Models -----
class QuoteRequestCreate(BaseModel):
    full_name: str
    phone: str
    email: EmailStr
    address: str
    service: str
    message: Optional[str] = ""


class QuoteRequest(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    full_name: str
    phone: str
    email: EmailStr
    address: str
    service: str
    message: Optional[str] = ""
    email_sent: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


# ----- Auth helpers -----
def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))


def create_access_token(email: str) -> str:
    payload = {
        "sub": email,
        "exp": datetime.now(timezone.utc) + timedelta(hours=TOKEN_TTL_HOURS),
        "type": "access",
    }
    return jwt.encode(payload, os.environ["JWT_SECRET"], algorithm=JWT_ALGORITHM)


async def get_current_admin(request: Request) -> dict:
    auth_header = request.headers.get("Authorization", "")
    token = auth_header[7:] if auth_header.startswith("Bearer ") else None
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, os.environ["JWT_SECRET"], algorithms=[JWT_ALGORITHM])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Session expired. Please log in again.")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
    admin = await db.admins.find_one({"email": payload.get("sub")}, {"_id": 0, "password_hash": 0})
    if not admin:
        raise HTTPException(status_code=401, detail="Admin not found")
    return admin


async def seed_admin():
    email = os.environ["ADMIN_EMAIL"].lower()
    password = os.environ["ADMIN_PASSWORD"]
    existing = await db.admins.find_one({"email": email})
    if existing is None:
        await db.admins.insert_one({
            "email": email,
            "password_hash": hash_password(password),
            "created_at": datetime.now(timezone.utc).isoformat(),
        })
        logger.info("Seeded admin user.")
    elif not verify_password(password, existing["password_hash"]):
        await db.admins.update_one({"email": email}, {"$set": {"password_hash": hash_password(password)}})
        logger.info("Updated admin password from .env.")


# ----- Email helper -----
def send_quote_notification(quote: dict) -> bool:
    api_key = os.environ.get('SENDGRID_API_KEY')
    sender = os.environ.get('SENDER_EMAIL')
    notify = os.environ.get('QUOTE_NOTIFY_EMAIL', sender)
    if not api_key or not sender:
        logger.warning("SendGrid not configured; skipping email.")
        return False

    subject = f"New Quote Request — {quote.get('full_name')} ({quote.get('service')})"
    html = f"""
    <div style="font-family:Arial,sans-serif;color:#0a1f44;">
      <h2 style="color:#0a1f44;">New Quote Request</h2>
      <table style="border-collapse:collapse;">
        <tr><td style="padding:6px 12px;font-weight:bold;">Name</td><td style="padding:6px 12px;">{quote.get('full_name')}</td></tr>
        <tr><td style="padding:6px 12px;font-weight:bold;">Phone</td><td style="padding:6px 12px;">{quote.get('phone')}</td></tr>
        <tr><td style="padding:6px 12px;font-weight:bold;">Email</td><td style="padding:6px 12px;">{quote.get('email')}</td></tr>
        <tr><td style="padding:6px 12px;font-weight:bold;">Address</td><td style="padding:6px 12px;">{quote.get('address')}</td></tr>
        <tr><td style="padding:6px 12px;font-weight:bold;">Service</td><td style="padding:6px 12px;">{quote.get('service')}</td></tr>
        <tr><td style="padding:6px 12px;font-weight:bold;">Message</td><td style="padding:6px 12px;">{quote.get('message') or '—'}</td></tr>
      </table>
      <p style="color:#1e6fc2;">Estrada-Glover Gutters — Surrey & Lower Mainland, BC</p>
    </div>
    """
    try:
        message = Mail(from_email=sender, to_emails=notify, subject=subject, html_content=html)
        message.reply_to = quote.get('email')
        sg = SendGridAPIClient(api_key)
        resp = sg.send(message)
        ok = resp.status_code in (200, 201, 202)
        if not ok:
            logger.error(f"SendGrid returned status {resp.status_code}")
        return ok
    except Exception as e:
        logger.error(f"Failed to send quote email: {e}")
        return False


async def process_quote(quote_id: str, quote_dict: dict):
    sent = send_quote_notification(quote_dict)
    await db.quote_requests.update_one({"id": quote_id}, {"$set": {"email_sent": sent}})


# ----- Public routes -----
@api_router.get("/")
async def root():
    return {"message": "Estrada-Glover Gutters API"}


@api_router.post("/quotes", response_model=QuoteRequest)
async def create_quote(input: QuoteRequestCreate, background_tasks: BackgroundTasks):
    quote = QuoteRequest(**input.model_dump())
    doc = quote.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.quote_requests.insert_one(doc)
    background_tasks.add_task(process_quote, quote.id, doc)
    return quote


# ----- Auth routes -----
@api_router.post("/auth/login")
async def login(body: LoginRequest):
    admin = await db.admins.find_one({"email": body.email.lower()})
    if not admin or not verify_password(body.password, admin["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = create_access_token(admin["email"])
    return {"access_token": token, "token_type": "bearer", "email": admin["email"]}


@api_router.get("/auth/me")
async def me(admin: dict = Depends(get_current_admin)):
    return admin


# ----- Protected admin routes -----
@api_router.get("/admin/quotes", response_model=List[QuoteRequest])
async def admin_list_quotes(admin: dict = Depends(get_current_admin)):
    docs = await db.quote_requests.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    for d in docs:
        if isinstance(d.get('created_at'), str):
            d['created_at'] = datetime.fromisoformat(d['created_at'])
    return docs


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def on_startup():
    await seed_admin()


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()

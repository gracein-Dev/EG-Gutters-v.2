"""Backend tests for Estrada-Glover Gutters quote API."""
import os
import time
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://gutter-rebrand-blue.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"


@pytest.fixture(scope="module")
def session():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# --- Health ---
def test_api_root(session):
    r = session.get(f"{API}/")
    assert r.status_code == 200
    assert "message" in r.json()


# --- POST /api/quotes valid ---
def test_create_quote_valid(session):
    payload = {
        "full_name": "TEST_Jane Smith",
        "phone": "(236) 555-0100",
        "email": "test_jane@example.com",
        "address": "123 Main St, Surrey, BC",
        "service": "New Gutter Installation",
        "message": "TEST_automated submission",
    }
    r = session.post(f"{API}/quotes", json=payload)
    assert r.status_code == 200, f"Expected 200, got {r.status_code}: {r.text}"
    data = r.json()
    # data assertions
    assert "id" in data and isinstance(data["id"], str) and len(data["id"]) > 0
    assert data["full_name"] == payload["full_name"]
    assert data["email"] == payload["email"]
    assert data["service"] == payload["service"]
    assert "email_sent" in data and isinstance(data["email_sent"], bool)
    # email_sent at creation should be False (background task hasn't completed)
    # We don't enforce the final state because background may or may not flip it.

    # Persist verification
    quote_id = data["id"]
    time.sleep(1.0)
    list_r = session.get(f"{API}/quotes")
    assert list_r.status_code == 200
    items = list_r.json()
    ids = [it["id"] for it in items]
    assert quote_id in ids, "Created quote not present in list"


# --- POST /api/quotes invalid email ---
def test_create_quote_invalid_email(session):
    payload = {
        "full_name": "TEST_Bad Email",
        "phone": "555-0000",
        "email": "not-an-email",
        "address": "1 Bad St",
        "service": "Repairs & Re-securing",
        "message": "",
    }
    r = session.post(f"{API}/quotes", json=payload)
    assert r.status_code == 422, f"Expected 422 for bad email, got {r.status_code}: {r.text}"


# --- POST /api/quotes missing required ---
def test_create_quote_missing_required(session):
    payload = {"full_name": "TEST_Missing"}
    r = session.post(f"{API}/quotes", json=payload)
    assert r.status_code == 422


# --- GET /api/quotes sorted desc by created_at ---
def test_list_quotes_sorted_desc(session):
    # Insert two with small delay
    p1 = {
        "full_name": "TEST_Sort One",
        "phone": "111",
        "email": "sort1@example.com",
        "address": "A",
        "service": "Gutter Cleaning",
        "message": "",
    }
    r1 = session.post(f"{API}/quotes", json=p1)
    assert r1.status_code == 200
    id1 = r1.json()["id"]
    time.sleep(1.1)
    p2 = dict(p1, full_name="TEST_Sort Two", email="sort2@example.com")
    r2 = session.post(f"{API}/quotes", json=p2)
    assert r2.status_code == 200
    id2 = r2.json()["id"]

    lr = session.get(f"{API}/quotes")
    assert lr.status_code == 200
    items = lr.json()
    assert len(items) >= 2
    # Find the positions
    positions = {it["id"]: i for i, it in enumerate(items)}
    assert id2 in positions and id1 in positions
    assert positions[id2] < positions[id1], "Expected newer quote (id2) to appear before older (id1)"

    # Validate no mongo _id leaked
    for it in items[:5]:
        assert "_id" not in it
        assert "id" in it and "created_at" in it

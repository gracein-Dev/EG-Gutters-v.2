import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Lock, LogOut, Loader2, Mail, Phone, MapPin, RefreshCw, Inbox } from "lucide-react";
import { COMPANY } from "@/data/content";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const TOKEN_KEY = "eg_admin_token";

export default function AdminPage() {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || "");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(false);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken("");
    setQuotes([]);
  }, []);

  const fetchQuotes = useCallback(async (tk) => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API}/admin/quotes`, {
        headers: { Authorization: `Bearer ${tk}` },
      });
      setQuotes(data);
    } catch (e) {
      if (e.response?.status === 401) {
        toast.error("Session expired. Please log in again.");
        logout();
      } else {
        toast.error("Could not load submissions.");
      }
    } finally {
      setLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    if (token) fetchQuotes(token);
  }, [token, fetchQuotes]);

  const onLogin = async (e) => {
    e.preventDefault();
    setLoggingIn(true);
    try {
      const { data } = await axios.post(`${API}/auth/login`, { email, password });
      localStorage.setItem(TOKEN_KEY, data.access_token);
      setToken(data.access_token);
      toast.success("Welcome back.");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Login failed.");
    } finally {
      setLoggingIn(false);
    }
  };

  const fmt = (iso) => {
    try {
      return new Date(iso).toLocaleString("en-CA", { dateStyle: "medium", timeStyle: "short" });
    } catch {
      return iso;
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-[#0a1f44] flex items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl" data-testid="admin-login-card">
          <div className="flex items-center gap-3">
            <img src={COMPANY.logo} alt="logo" className="h-10 w-auto object-contain" />
            <div>
              <h1 className="text-xl font-bold text-[#0a1f44] font-display">Admin Login</h1>
              <p className="text-sm text-[#0a1f44]/60">Estrada-Glover Gutters</p>
            </div>
          </div>
          <form onSubmit={onLogin} className="mt-8 space-y-4" data-testid="admin-login-form">
            <div>
              <label className="block text-sm font-medium text-[#0a1f44] mb-1.5">Email</label>
              <input
                data-testid="admin-email-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1e6fc2]"
                placeholder="admin@estradaglovergroup.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#0a1f44] mb-1.5">Password</label>
              <input
                data-testid="admin-password-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1e6fc2]"
                placeholder="••••••••"
              />
            </div>
            <button
              data-testid="admin-login-submit"
              type="submit"
              disabled={loggingIn}
              className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-[#1e6fc2] px-5 py-3 font-semibold text-white hover:bg-[#155b9e] transition-colors disabled:opacity-60"
            >
              {loggingIn ? <Loader2 size={18} className="animate-spin" /> : <Lock size={18} />}
              {loggingIn ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f7fa]">
      <header className="bg-[#0a1f44] text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={COMPANY.logo} alt="logo" className="h-9 w-auto object-contain bg-white rounded p-1" />
            <span className="font-semibold font-display">Quote Submissions</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              data-testid="admin-refresh"
              onClick={() => fetchQuotes(token)}
              className="inline-flex items-center gap-2 rounded-lg border border-white/25 px-3 py-2 text-sm hover:bg-white/10 transition-colors"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} /> Refresh
            </button>
            <button
              data-testid="admin-logout"
              onClick={logout}
              className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-sm hover:bg-white/20 transition-colors"
            >
              <LogOut size={16} /> Log out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[#0a1f44]">
            {quotes.length} {quotes.length === 1 ? "submission" : "submissions"}
          </h2>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24 text-[#0a1f44]/50">
            <Loader2 size={28} className="animate-spin" />
          </div>
        ) : quotes.length === 0 ? (
          <div data-testid="admin-empty" className="flex flex-col items-center justify-center py-24 text-[#0a1f44]/50">
            <Inbox size={40} />
            <p className="mt-3">No quote submissions yet.</p>
          </div>
        ) : (
          <div className="grid gap-4" data-testid="admin-quotes-list">
            {quotes.map((q, i) => (
              <div key={q.id} data-testid={`admin-quote-${i}`} className="rounded-xl bg-white border border-gray-200 p-5 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold text-[#0a1f44]">{q.full_name}</h3>
                    <span className="inline-block mt-1 rounded-full bg-[#1e6fc2]/10 text-[#1e6fc2] px-3 py-0.5 text-xs font-semibold">
                      {q.service}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm text-[#0a1f44]/50">{fmt(q.created_at)}</span>
                    <div className={`mt-1 text-xs font-medium ${q.email_sent ? "text-green-600" : "text-amber-600"}`}>
                      {q.email_sent ? "Email sent" : "Email pending"}
                    </div>
                  </div>
                </div>
                <div className="mt-4 grid gap-2 sm:grid-cols-3 text-sm text-[#0a1f44]/80">
                  <a href={`tel:${q.phone}`} className="flex items-center gap-2 hover:text-[#1e6fc2]"><Phone size={15} className="text-[#1e6fc2]" /> {q.phone}</a>
                  <a href={`mailto:${q.email}`} className="flex items-center gap-2 hover:text-[#1e6fc2] break-all"><Mail size={15} className="text-[#1e6fc2]" /> {q.email}</a>
                  <span className="flex items-center gap-2"><MapPin size={15} className="text-[#1e6fc2]" /> {q.address}</span>
                </div>
                {q.message && (
                  <p className="mt-3 rounded-lg bg-[#f5f7fa] p-3 text-sm text-[#0a1f44]/75">{q.message}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

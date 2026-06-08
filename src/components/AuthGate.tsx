import { useEffect, useState, type ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

type Mode = "login" | "signup";

export function AuthGate({ children }: { children: (session: Session) => ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<Mode>("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [googleBusy, setGoogleBusy] = useState(false);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { display_name: displayName || email.split("@")[0] },
          },
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err: any) {
      setError(err.message ?? "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  async function signInWithGoogle() {
    setError(null);
    setGoogleBusy(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin,
          queryParams: {
            prompt: "select_account",
          },
        },
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message ?? "Google sign-in failed");
    } finally {
      setGoogleBusy(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-muted-foreground">Loading…</div>
      </div>
    );
  }

  if (session) return <>{children(session)}</>;

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{ background: "var(--gradient-hero)" }}
    >
      <div
        className="bg-card rounded-3xl p-8 w-full max-w-md animate-bounce-in"
        style={{ boxShadow: "var(--shadow-card)" }}
      >
        <div className="text-center mb-6">
          <div className="text-5xl mb-2">🇰🇿</div>
          <h1 className="text-3xl font-black">Kazakhstan Quest</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {mode === "signup" ? "Create an account to start your journey" : "Welcome back, explorer!"}
          </p>
        </div>

        <form onSubmit={submit} className="space-y-3">
          {mode === "signup" && (
            <input
              type="text"
              placeholder="Display name (optional)"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-input border-2 border-border focus:border-primary focus:outline-none font-semibold"
            />
          )}
          <input
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-input border-2 border-border focus:border-primary focus:outline-none font-semibold"
          />
          <input
            type="password"
            required
            minLength={6}
            placeholder="Password (min 6 chars)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-input border-2 border-border focus:border-primary focus:outline-none font-semibold"
          />

          {error && (
            <div className="p-3 rounded-xl bg-destructive/15 text-destructive text-sm font-semibold">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={busy}
            className="w-full py-4 rounded-xl font-black text-lg bg-primary text-primary-foreground hover:opacity-90 transition disabled:opacity-50"
          >
            {busy ? "Please wait…" : mode === "signup" ? "Sign Up & Play ▶️" : "Log In ▶️"}
          </button>
        </form>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground font-medium">or</span>
          </div>
        </div>

        <button
          onClick={signInWithGoogle}
          disabled={googleBusy}
          className="w-full py-3 rounded-xl font-semibold border border-border bg-background text-foreground hover:bg-secondary transition disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          {googleBusy ? "Please wait…" : "Continue with Google"}
        </button>

        <button
          onClick={() => {
            setMode(mode === "signup" ? "login" : "signup");
            setError(null);
          }}
          className="w-full mt-4 text-sm font-semibold text-primary hover:underline"
        >
          {mode === "signup" ? "Already have an account? Log in" : "New explorer? Sign up"}
        </button>
      </div>
    </div>
  );
}

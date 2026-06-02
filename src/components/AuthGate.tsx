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

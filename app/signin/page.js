"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabase } from "../../lib/supabase";

export default function SignInPage() {
  const [mode, setMode] = useState("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [confirmationSent, setConfirmationSent] = useState(false);

  const router = useRouter();

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const supabase = getSupabase();

    try {
      if (mode === "signup") {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
          },
        });

        if (signUpError) throw signUpError;
        setConfirmationSent(true);
      } else {
        const { error: signInError } =
          await supabase.auth.signInWithPassword({ email, password });

        if (signInError) throw signInError;
        router.push("/");
      }
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (confirmationSent) {
    return (
      <div style={containerStyle}>
        <div style={cardStyle}>
          <h1 style={headingStyle}>Check your email</h1>
          <p style={{ color: "#ccc", lineHeight: 1.6, textAlign: "center" }}>
            We sent a confirmation link to <strong>{email}</strong>. Click
            the link to activate your account, then come back and sign in.
          </p>
          <button
            type="button"
            onClick={() => {
              setConfirmationSent(false);
              setMode("signin");
            }}
            style={{ ...primaryButtonStyle, marginTop: "20px" }}
          >
            Back to Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h1 style={headingStyle}>
          {mode === "signup" ? "Create Account" : "Sign In"}
        </h1>
        <p style={subheadStyle}>
          {mode === "signup"
            ? "Submit and manage your films on AIV Network."
            : "Welcome back to AIV Network."}
        </p>

        <form onSubmit={handleSubmit}>
          <label style={labelStyle}>Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
          />

          <label style={labelStyle}>Password</label>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
          />

          {error && <p style={errorStyle}>{error}</p>}

          <button
            type="submit"
            disabled={loading}
            style={{ ...primaryButtonStyle, marginTop: "20px", width: "100%" }}
          >
            {loading
              ? "Please wait..."
              : mode === "signup"
              ? "Create Account"
              : "Sign In"}
          </button>
        </form>

        <p style={switchModeStyle}>
          {mode === "signup" ? (
            <>
              Already have an account?{" "}
              <button type="button" onClick={() => setMode("signin")} style={linkStyle}>
                Sign In
              </button>
            </>
          ) : (
            <>
              New filmmaker?{" "}
              <button type="button" onClick={() => setMode("signup")} style={linkStyle}>
                Create an account
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}

const containerStyle = {
  minHeight: "100vh",
  background: "#000",
  color: "#fff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "20px",
};

const cardStyle = {
  width: "100%",
  maxWidth: "360px",
  background: "#151515",
  border: "1px solid #2a2a2a",
  borderRadius: "8px",
  padding: "32px 28px",
  boxSizing: "border-box",
};

const headingStyle = {
  fontSize: "22px",
  marginBottom: "8px",
  textAlign: "center",
};

const subheadStyle = {
  color: "#999",
  marginBottom: "26px",
  fontSize: "13px",
  textAlign: "center",
};

const labelStyle = {
  display: "block",
  fontSize: "13px",
  color: "#ccc",
  marginBottom: "6px",
  marginTop: "16px",
};

const inputStyle = {
  width: "100%",
  padding: "10px",
  background: "#222",
  color: "#fff",
  border: "1px solid #444",
  borderRadius: "4px",
  fontSize: "14px",
  boxSizing: "border-box",
};

const primaryButtonStyle = {
  background: "#e50914",
  color: "#fff",
  border: "none",
  padding: "10px 16px",
  cursor: "pointer",
  fontWeight: "bold",
  borderRadius: "4px",
  fontSize: "14px",
};

const errorStyle = {
  color: "#ff6b6b",
  fontSize: "13px",
  marginTop: "10px",
  textAlign: "center",
};

const switchModeStyle = {
  marginTop: "22px",
  fontSize: "13px",
  color: "#999",
  textAlign: "center",
};

const linkStyle = {
  background: "none",
  border: "none",
  color: "#e50914",
  fontWeight: 600,
  cursor: "pointer",
  padding: 0,
  fontSize: "13px",
};
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabase } from "../../lib/supabase";

const BG = "#141414";
const CARD_BG = "#1f1f1f";
const ACCENT = "#e50914";

export default function SignInPage() {
  const [mode, setMode] = useState("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [confirmationSent, setConfirmationSent] = useState(false);

  const router = useRouter();

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (mode === "signup" && !agreedToTerms) {
      setError("Please agree to the Filmmaker Submission Agreement to continue.");
      return;
    }

    setLoading(true);

    const supabase = getSupabase();

    try {
      if (mode === "signup") {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: {
              agreed_to_terms: true,
              agreed_to_terms_at: new Date().toISOString(),
            },
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
          <p style={{ color: "#b3b3b3", lineHeight: 1.6, textAlign: "center", fontSize: "14px" }}>
            We sent a confirmation link to <strong>{email}</strong>. Click
            the link to activate your account, then come back and sign in.
          </p>
          <button
            type="button"
            onClick={() => {
              setConfirmationSent(false);
              setMode("signin");
            }}
            style={{ ...primaryButtonStyle, marginTop: "22px" }}
          >
            Back to Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={{ ...cardStyle, maxWidth: mode === "signup" ? "400px" : "360px" }}>
        <h1 style={headingStyle}>
          {mode === "signup" ? "Create Your Account" : "Sign In"}
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
            onFocus={() => setFocusedField("email")}
            onBlur={() => setFocusedField(null)}
            style={{
              ...inputStyle,
              borderColor: focusedField === "email" ? ACCENT : "#444",
            }}
          />

          <label style={labelStyle}>Password</label>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onFocus={() => setFocusedField("password")}
            onBlur={() => setFocusedField(null)}
            style={{
              ...inputStyle,
              borderColor: focusedField === "password" ? ACCENT : "#444",
            }}
          />
          {mode === "signup" && (
            <p style={hintStyle}>Must be at least 6 characters.</p>
          )}

          {mode === "signup" && (
            <label style={checkboxRowStyle}>
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                style={{ marginTop: "2px", accentColor: ACCENT, flexShrink: 0 }}
              />
              <span>
                I agree to the{" "}
                <a href="/terms" style={inlineLinkStyle}>Filmmaker Submission Agreement</a>{" "}
                and{" "}
                <a href="/privacy" style={inlineLinkStyle}>Privacy Policy</a>.
              </span>
            </label>
          )}

          {error && <p style={errorStyle}>{error}</p>}

          <button
            type="submit"
            disabled={loading}
            style={{
              ...primaryButtonStyle,
              marginTop: "22px",
              width: "100%",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Please wait..." : mode === "signup" ? "Create Account" : "Sign In"}
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
  background: BG,
  color: "#fff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "20px",
};

const cardStyle = {
  width: "100%",
  maxWidth: "360px",
  background: CARD_BG,
  borderRadius: "6px",
  padding: "36px 30px",
  boxSizing: "border-box",
  boxShadow: "0 16px 40px rgba(0,0,0,0.5)",
};

const headingStyle = {
  fontSize: "24px",
  marginBottom: "8px",
  textAlign: "center",
  fontWeight: 700,
};

const subheadStyle = {
  color: "#b3b3b3",
  marginBottom: "28px",
  fontSize: "13px",
  textAlign: "center",
};

const labelStyle = {
  display: "block",
  fontSize: "13px",
  color: "#b3b3b3",
  marginBottom: "6px",
  marginTop: "16px",
};

const inputStyle = {
  width: "100%",
  padding: "11px 12px",
  background: "#333",
  color: "#fff",
  border: "1px solid #444",
  borderRadius: "4px",
  fontSize: "14px",
  boxSizing: "border-box",
  transition: "border-color 0.15s ease",
  outline: "none",
};

const hintStyle = {
  fontSize: "12px",
  color: "#808080",
  marginTop: "6px",
};

const checkboxRowStyle = {
  display: "flex",
  gap: "8px",
  alignItems: "flex-start",
  marginTop: "18px",
  fontSize: "12.5px",
  color: "#b3b3b3",
  lineHeight: 1.5,
  cursor: "pointer",
};

const primaryButtonStyle = {
  background: ACCENT,
  color: "#fff",
  border: "none",
  padding: "11px 16px",
  cursor: "pointer",
  fontWeight: "bold",
  borderRadius: "4px",
  fontSize: "15px",
};

const errorStyle = {
  color: "#ff6b6b",
  fontSize: "13px",
  marginTop: "10px",
  textAlign: "center",
};

const switchModeStyle = {
  marginTop: "24px",
  fontSize: "13px",
  color: "#b3b3b3",
  textAlign: "center",
};

const linkStyle = {
  background: "none",
  border: "none",
  color: ACCENT,
  fontWeight: 600,
  cursor: "pointer",
  padding: 0,
  fontSize: "13px",
};

const inlineLinkStyle = {
  color: ACCENT,
  fontWeight: 600,
  textDecoration: "none",
};
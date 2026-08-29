"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabase } from "../../lib/supabase";

export default function AccountPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [deleted, setDeleted] = useState(false);

  const router = useRouter();
  const supabase = getSupabase();

  useEffect(() => {
    async function loadUser() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/signin");
        return;
      }

      setUser(session.user);
      setLoading(false);
    }

    loadUser();
  }, []);

  async function handleDelete() {
    setDeleting(true);
    setError("");

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const response = await fetch("/api/delete-account", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to delete account");
      }

      await supabase.auth.signOut();
      setDeleted(true);
    } catch (err) {
      setError(err.message);
      setDeleting(false);
    }
  }

  if (loading) {
    return <div style={containerStyle}>Loading...</div>;
  }

  if (deleted) {
    return (
      <div style={containerStyle}>
        <div style={cardStyle}>
          <h1 style={{ fontSize: "20px", marginBottom: "12px" }}>
            Account deleted
          </h1>
          <p style={{ color: "#ccc", lineHeight: 1.6 }}>
            Your account has been deleted and you've been signed out. Your
            films will remain live for 180 days before they're permanently
            removed. If you'd like a film taken down sooner, email{" "}
            <a href="mailto:support@aivnetwork.online" style={{ color: "#e50914" }}>
              support@aivnetwork.online
            </a>
            .
          </p>
          <button
            type="button"
            onClick={() => router.push("/")}
            style={{ ...primaryButtonStyle, marginTop: "20px" }}
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h1 style={{ fontSize: "20px", marginBottom: "6px" }}>My Account</h1>
        <p style={{ color: "#999", marginBottom: "24px", fontSize: "13px" }}>
          {user?.email}
        </p>

        <div
          style={{
            borderTop: "1px solid #2a2a2a",
            paddingTop: "20px",
            marginTop: "10px",
          }}
        >
          <h2 style={{ fontSize: "15px", marginBottom: "8px", color: "#ff6b6b" }}>
            Delete Account
          </h2>
          <p style={{ color: "#999", fontSize: "13px", lineHeight: 1.6 }}>
            This signs you out permanently. Films you've uploaded will stay
            live for 180 days, then be automatically removed. This can't be
            undone.
          </p>

          {!showConfirm ? (
            <button
              type="button"
              onClick={() => setShowConfirm(true)}
              style={{ ...dangerButtonStyle, marginTop: "14px" }}
            >
              Delete My Account
            </button>
          ) : (
            <div
              style={{
                marginTop: "14px",
                background: "#1a1a1a",
                border: "1px solid #442222",
                borderRadius: "6px",
                padding: "14px",
              }}
            >
              <p style={{ fontSize: "13px", color: "#fff", marginBottom: "12px" }}>
                Are you sure? Type <strong>DELETE</strong> to confirm.
              </p>
              <input
                type="text"
                placeholder="DELETE"
                onChange={(e) => setShowConfirm(e.target.value === "DELETE" ? "confirmed" : true)}
                style={inputStyle}
              />
              {error && (
                <p style={{ color: "#ff6b6b", fontSize: "13px", marginTop: "8px" }}>
                  {error}
                </p>
              )}
              <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
                <button
                  type="button"
                  disabled={showConfirm !== "confirmed" || deleting}
                  onClick={handleDelete}
                  style={{
                    ...dangerButtonStyle,
                    opacity: showConfirm === "confirmed" ? 1 : 0.4,
                    cursor: showConfirm === "confirmed" ? "pointer" : "default",
                  }}
                >
                  {deleting ? "Deleting..." : "Confirm Delete"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowConfirm(false)}
                  style={secondaryButtonStyle}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
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
  maxWidth: "420px",
  background: "#151515",
  border: "1px solid #2a2a2a",
  borderRadius: "8px",
  padding: "28px",
};

const inputStyle = {
  width: "100%",
  padding: "8px",
  background: "#222",
  color: "#fff",
  border: "1px solid #444",
  borderRadius: "4px",
  fontSize: "13px",
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

const dangerButtonStyle = {
  background: "#7a1a1a",
  color: "#fff",
  border: "none",
  padding: "9px 14px",
  cursor: "pointer",
  fontWeight: "bold",
  borderRadius: "4px",
  fontSize: "13px",
};

const secondaryButtonStyle = {
  background: "#333",
  color: "#fff",
  border: "none",
  padding: "9px 14px",
  cursor: "pointer",
  borderRadius: "4px",
  fontSize: "13px",
};
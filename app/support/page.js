export const metadata = {
  title: "Support — AIV Network",
  description: "Get help with AIV Network, the independent film streaming platform.",
};

const BG = "#141414";
const CARD_BG = "#1f1f1f";
const ACCENT = "#e50914";
const TEXT_SECONDARY = "#b3b3b3";

const bodyText = {
  color: TEXT_SECONDARY,
  lineHeight: 1.7,
  fontSize: "15px",
  textAlign: "left",
  margin: 0,
};

const linkStyle = {
  color: ACCENT,
  textDecoration: "underline",
};

export default function SupportPage() {
  return (
    <div style={{ background: BG, minHeight: "100vh", color: "#fff" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "14px 24px",
          background: "rgba(20,20,20,0.95)",
          position: "sticky",
          top: 0,
          zIndex: 100,
          borderBottom: "1px solid #2a2a2a",
        }}
      >
        <a
          href="/"
          style={{
            display: "inline-block",
            color: "#fff",
            background: ACCENT,
            padding: "9px 14px",
            borderRadius: "4px",
            fontSize: "14px",
            fontWeight: "bold",
            textDecoration: "none",
          }}
        >
          ← Home
        </a>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "60px 24px",
        }}
      >
        <div style={{ width: "100%", maxWidth: "700px", textAlign: "left" }}>
          <h1 style={{ fontSize: "34px", marginBottom: "10px" }}>Support</h1>
          <p style={{ color: TEXT_SECONDARY, marginBottom: "40px" }}>
            Need help with AIV Network? We're here for you.
          </p>

          <section style={{ marginBottom: "32px" }}>
            <h2 style={{ fontSize: "19px", marginBottom: "14px" }}>Contact Us</h2>
            <div
              style={{
                background: CARD_BG,
                borderRadius: "6px",
                padding: "18px 20px",
              }}
            >
              <p style={bodyText}>
                For questions, bug reports, or feedback about the AIV
                Network app or website, email us at{" "}
                <a href="mailto:support@aivnetwork.online" style={linkStyle}>
                  support@aivnetwork.online
                </a>
                .
              </p>
            </div>
          </section>

          <section style={{ marginBottom: "32px" }}>
            <h2 style={{ fontSize: "19px", marginBottom: "14px" }}>
              Common Questions
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ background: CARD_BG, borderRadius: "6px", padding: "16px 20px" }}>
                <h3 style={{ fontSize: "15px", marginBottom: "8px" }}>
                  How do I submit a film?
                </h3>
                <p style={bodyText}>
                  Create a filmmaker account, then visit our{" "}
                  <a href="/submit" style={linkStyle}>film submission page</a>{" "}
                  to share your work with the AIV Network community.
                </p>
              </div>

              <div style={{ background: CARD_BG, borderRadius: "6px", padding: "16px 20px" }}>
                <h3 style={{ fontSize: "15px", marginBottom: "8px" }}>
                  How do I create a filmmaker account?
                </h3>
                <p style={bodyText}>
                  Sign up with your email and a password. We'll send a
                  confirmation email — click the link inside it to activate
                  your account before signing in.
                </p>
              </div>

              <div style={{ background: CARD_BG, borderRadius: "6px", padding: "16px 20px" }}>
                <h3 style={{ fontSize: "15px", marginBottom: "8px" }}>
                  Why am I seeing ads?
                </h3>
                <p style={bodyText}>
                  AIV Network is a free, ad-supported streaming platform.
                  Ads help us keep the service free for everyone. Most ads
                  can be skipped after 5 seconds using the Skip button in
                  the player.
                </p>
              </div>

              <div style={{ background: CARD_BG, borderRadius: "6px", padding: "16px 20px" }}>
                <h3 style={{ fontSize: "15px", marginBottom: "8px" }}>
                  A video won't play — what should I do?
                </h3>
                <p style={bodyText}>
                  Try refreshing the page or restarting the app. If the
                  issue continues, email us with the film title and a
                  description of the problem.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 style={{ fontSize: "19px", marginBottom: "14px" }}>
              Account &amp; Privacy
            </h2>
            <div style={{ background: CARD_BG, borderRadius: "6px", padding: "18px 20px" }}>
              <p style={{ ...bodyText, marginBottom: "12px" }}>
                You can delete your account at any time from your Account
                page. When you do, you're signed out immediately and can no
                longer log in or upload new films.
              </p>
              <p style={bodyText}>
                Films you've already uploaded remain live on AIV Network
                for <strong>180 days</strong> after account deletion, then
                are permanently removed. If you'd like a film taken down
                sooner, email{" "}
                <a href="mailto:support@aivnetwork.online" style={linkStyle}>
                  support@aivnetwork.online
                </a>{" "}
                and we'll handle it manually.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
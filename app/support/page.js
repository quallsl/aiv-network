export const metadata = {
  title: "Support — AIV Network",
  description: "Get help with AIV Network, the independent film streaming platform.",
};

const pageStyle = {
  minHeight: "100vh",
  background: "#000",
  color: "#fff",
  display: "flex",
  justifyContent: "center",
  padding: "60px 20px",
  textAlign: "left",
};

const bodyText = {
  color: "#ccc",
  lineHeight: 1.6,
  fontSize: "15px",
  textAlign: "left",
  margin: 0,
};

const linkStyle = {
  color: "#e50914",
  textDecoration: "underline",
};

export default function SupportPage() {
  return (
    <div style={pageStyle}>
      <div style={{ width: "100%", maxWidth: "700px", textAlign: "left" }}>
        <h1 style={{ fontSize: "36px", marginBottom: "10px" }}>Support</h1>
        <p style={{ color: "#999", marginBottom: "40px", textAlign: "left" }}>
          Need help with AIV Network? We're here for you.
        </p>

        <section style={{ marginBottom: "32px" }}>
          <h2 style={{ fontSize: "20px", marginBottom: "12px" }}>Contact Us</h2>
          <p style={bodyText}>
            For questions, bug reports, or feedback about the AIV Network app
            or website, email us at{" "}
            <a href="mailto:support@aivnetwork.online" style={linkStyle}>
              support@aivnetwork.online
            </a>
            .
          </p>
        </section>

        <section style={{ marginBottom: "32px" }}>
          <h2 style={{ fontSize: "20px", marginBottom: "16px" }}>
            Common Questions
          </h2>

          <div style={{ marginBottom: "22px" }}>
            <h3 style={{ fontSize: "16px", marginBottom: "8px" }}>
              How do I submit a film?
            </h3>
            <p style={bodyText}>
              Create a filmmaker account, then visit our{" "}
              <a href="/submit" style={linkStyle}>
                film submission page
              </a>{" "}
              to share your work with the AIV Network community.
            </p>
          </div>

          <div style={{ marginBottom: "22px" }}>
            <h3 style={{ fontSize: "16px", marginBottom: "8px" }}>
              How do I create a filmmaker account?
            </h3>
            <p style={bodyText}>
              Sign up with your email and a password. We'll send a
              confirmation email — click the link inside it to activate your
              account before signing in.
            </p>
          </div>

          <div style={{ marginBottom: "22px" }}>
            <h3 style={{ fontSize: "16px", marginBottom: "8px" }}>
              Why am I seeing ads?
            </h3>
            <p style={bodyText}>
              AIV Network is a free, ad-supported streaming platform. Ads
              help us keep the service free for everyone. Most ads can be
              skipped after 5 seconds using the Skip button in the player.
            </p>
          </div>

          <div style={{ marginBottom: "22px" }}>
            <h3 style={{ fontSize: "16px", marginBottom: "8px" }}>
              A video won't play — what should I do?
            </h3>
            <p style={bodyText}>
              Try refreshing the page or restarting the app. If the issue
              continues, email us with the film title and a description of
              the problem.
            </p>
          </div>
        </section>

        <section>
          <h2 style={{ fontSize: "20px", marginBottom: "12px" }}>
            Account &amp; Privacy
          </h2>
          <p style={{ ...bodyText, marginBottom: "12px" }}>
            You can delete your account at any time from your Account page.
            When you do, you're signed out immediately and can no longer log
            in or upload new films.
          </p>
          <p style={bodyText}>
            Films you've already uploaded remain live on AIV Network for{" "}
            <strong>180 days</strong> after account deletion, then are
            permanently removed. This delay exists so viewers don't lose
            access to content abruptly and to give us time to process the
            deletion correctly. If you'd like a film taken down sooner than
            180 days, email{" "}
            <a href="mailto:support@aivnetwork.online" style={linkStyle}>
              support@aivnetwork.online
            </a>{" "}
            and we'll handle it manually.
          </p>
        </section>
      </div>
    </div>
  );
}
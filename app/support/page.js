export const metadata = {
  title: "Support — AIV Network",
  description: "Get help with AIV Network, the independent film streaming platform.",
};

export default function SupportPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#000",
        color: "#fff",
        display: "flex",
        justifyContent: "center",
        padding: "60px 20px",
      }}
    >
      <div style={{ width: "100%", maxWidth: "700px" }}>
        <h1 style={{ fontSize: "36px", marginBottom: "10px" }}>Support</h1>
        <p style={{ color: "#999", marginBottom: "40px" }}>
          Need help with AIV Network? We're here for you.
        </p>

        <section style={{ marginBottom: "32px" }}>
          <h2 style={{ fontSize: "20px", marginBottom: "10px" }}>Contact Us</h2>
          <p style={{ color: "#ccc", lineHeight: 1.6 }}>
            For questions, bug reports, or feedback about the AIV Network app
            or website, email us at{" "}
            <a href="mailto:support@aivnetwork.online" style={{ color: "#e50914" }}>
              support@aivnetwork.online
            </a>
            .
          </p>
        </section>

        <section style={{ marginBottom: "32px" }}>
          <h2 style={{ fontSize: "20px", marginBottom: "10px" }}>
            Common Questions
          </h2>

          <div style={{ marginBottom: "20px" }}>
            <h3 style={{ fontSize: "16px", marginBottom: "6px" }}>
              How do I submit a film?
            </h3>
            <p style={{ color: "#ccc", lineHeight: 1.6 }}>
              Visit our{" "}
              <a href="/submit" style={{ color: "#e50914" }}>
                film submission page
              </a>{" "}
              to share your work with the AIV Network community.
            </p>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <h3 style={{ fontSize: "16px", marginBottom: "6px" }}>
              Why am I seeing ads?
            </h3>
            <p style={{ color: "#ccc", lineHeight: 1.6 }}>
              AIV Network is a free, ad-supported streaming platform. Ads help
              us keep the service free for everyone.
            </p>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <h3 style={{ fontSize: "16px", marginBottom: "6px" }}>
              A video won't play — what should I do?
            </h3>
            <p style={{ color: "#ccc", lineHeight: 1.6 }}>
              Try refreshing the page or restarting the app. If the issue
              continues, email us with the film title and a description of
              the problem.
            </p>
          </div>
        </section>

        <section>
          <h2 style={{ fontSize: "20px", marginBottom: "10px" }}>
            Account &amp; Privacy
          </h2>
          <p style={{ color: "#ccc", lineHeight: 1.6 }}>
            For account or data-related requests, contact{" "}
            <a href="mailto:support@aivnetwork.online" style={{ color: "#e50914" }}>
              support@aivnetwork.online
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
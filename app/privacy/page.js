export const metadata = {
  title: "Privacy Policy — AIV Network",
  description: "Privacy Policy for AIV Network, the independent film streaming platform.",
};

export default function PrivacyPage() {
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
      <div style={{ width: "100%", maxWidth: "800px" }}>
        <h1 style={{ fontSize: "36px", marginBottom: "10px" }}>Privacy Policy</h1>
        <p style={{ color: "#999", marginBottom: "40px" }}>
          Last updated: July 27, 2026
        </p>

        <section style={{ marginBottom: "32px" }}>
          <p style={{ color: "#ccc", lineHeight: 1.6 }}>
            AIV Network LLC ("we," "us," or "our") operates the AIV Network
            website and mobile application (the "Service"). This Privacy
            Policy explains what information we collect, how we use it, and
            your rights regarding that information.
          </p>
        </section>

        <section style={{ marginBottom: "32px" }}>
          <h2 style={{ fontSize: "20px", marginBottom: "10px" }}>
            Information We Collect
          </h2>

          <h3 style={{ fontSize: "16px", marginTop: "16px", marginBottom: "6px" }}>
            Account Information
          </h3>
          <p style={{ color: "#ccc", lineHeight: 1.6 }}>
            When you create an account, we collect your email address and
            authentication information through our authentication provider
            (Supabase). This is used to sign you in, manage your account, and
            associate content (such as film submissions) with your account.
          </p>

          <h3 style={{ fontSize: "16px", marginTop: "16px", marginBottom: "6px" }}>
            Usage &amp; Analytics Data
          </h3>
          <p style={{ color: "#ccc", lineHeight: 1.6 }}>
            We collect information about how you use the Service, including
            films viewed, features used, and general app interaction data.
            This helps us understand usage patterns, improve the Service, and
            fix issues.
          </p>

          <h3 style={{ fontSize: "16px", marginTop: "16px", marginBottom: "6px" }}>
            Advertising Data
          </h3>
          <p style={{ color: "#ccc", lineHeight: 1.6 }}>
            AIV Network is a free, ad-supported service. We use Google AdMob
            to serve advertisements. AdMob may collect device identifiers,
            approximate location, and ad interaction data to deliver and
            measure ads. You can learn more about Google's data practices at{" "}
            <a
              href="https://policies.google.com/technologies/partner-sites"
              style={{ color: "#e50914" }}
            >
              policies.google.com/technologies/partner-sites
            </a>
            .
          </p>
        </section>

        <section style={{ marginBottom: "32px" }}>
          <h2 style={{ fontSize: "20px", marginBottom: "10px" }}>
            How We Use Your Information
          </h2>
          <p style={{ color: "#ccc", lineHeight: 1.6 }}>
            We use the information we collect to: provide and maintain the
            Service, authenticate your account, process film submissions,
            serve and measure advertising, analyze usage to improve the
            Service, and communicate with you about your account when
            necessary.
          </p>
        </section>

        <section style={{ marginBottom: "32px" }}>
          <h2 style={{ fontSize: "20px", marginBottom: "10px" }}>
            How We Share Your Information
          </h2>
          <p style={{ color: "#ccc", lineHeight: 1.6 }}>
            We do not sell your personal information. We share information
            with service providers who help us operate the Service,
            including Supabase (authentication and data storage), Bunny.net
            (video hosting and delivery), and Google AdMob (advertising).
            These providers process data on our behalf and are bound by their
            own privacy and data protection obligations.
          </p>
        </section>

        <section style={{ marginBottom: "32px" }}>
          <h2 style={{ fontSize: "20px", marginBottom: "10px" }}>
            Children's Privacy
          </h2>
          <p style={{ color: "#ccc", lineHeight: 1.6 }}>
            AIV Network is not directed to children under the age of 13, and
            we do not knowingly collect personal information from children
            under 13. If we become aware that we have collected personal
            information from a child under 13 without verification of
            parental consent, we will take steps to remove that information.
          </p>
        </section>

        <section style={{ marginBottom: "32px" }}>
          <h2 style={{ fontSize: "20px", marginBottom: "10px" }}>
            Your Rights
          </h2>
          <p style={{ color: "#ccc", lineHeight: 1.6 }}>
            Depending on your location, you may have rights under laws such
            as the California Consumer Privacy Act (CCPA) or the General Data
            Protection Regulation (GDPR), including the right to access,
            correct, or delete your personal information. To exercise these
            rights, contact us at{" "}
            <a href="mailto:support@aivnetwork.online" style={{ color: "#e50914" }}>
              support@aivnetwork.online
            </a>
            .
          </p>
        </section>

        <section style={{ marginBottom: "32px" }}>
          <h2 style={{ fontSize: "20px", marginBottom: "10px" }}>
            Data Retention &amp; Security
          </h2>
          <p style={{ color: "#ccc", lineHeight: 1.6 }}>
            We retain your information for as long as your account is active
            or as needed to provide the Service. We use reasonable
            administrative and technical measures to protect your
            information, though no method of transmission or storage is
            completely secure.
          </p>
        </section>

        <section style={{ marginBottom: "32px" }}>
          <h2 style={{ fontSize: "20px", marginBottom: "10px" }}>
            Changes to This Policy
          </h2>
          <p style={{ color: "#ccc", lineHeight: 1.6 }}>
            We may update this Privacy Policy from time to time. We will
            notify you of material changes by updating the "Last updated"
            date above.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: "20px", marginBottom: "10px" }}>
            Contact Us
          </h2>
          <p style={{ color: "#ccc", lineHeight: 1.6 }}>
            If you have questions about this Privacy Policy, contact us at{" "}
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
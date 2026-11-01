import Link from "next/link";

export const metadata = {
  title: "About — AIV Network",
  description:
    "AIV Network is a free, ad-supported streaming platform for curated AI-generated and independent films.",
  alternates: { canonical: "/about" },
};

const p = { color: "#ccc", lineHeight: 1.7, marginBottom: 16 };
const h2 = { fontSize: 22, margin: "32px 0 10px" };

export default function AboutPage() {
  return (
    <main style={{ background: "#000", color: "#fff", minHeight: "100vh" }}>
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "60px 20px" }}>
        <h1 style={{ fontSize: 36, marginBottom: 16 }}>About AIV Network</h1>

        {/* TODO(Loren): rewrite this copy in your own voice before submitting for review. */}
        <p style={p}>
          AIV Network is a free streaming platform dedicated to films made with
          generative AI. We give independent creators a place to premiere their
          work and reach an audience, and we give viewers a single home for the
          most ambitious AI cinema being made today.
        </p>

        <h2 style={h2}>How films get on AIV Network</h2>
        <p style={p}>
          Filmmakers submit their work through our{" "}
          <Link href="/submit" style={{ color: "#e50914" }}>submission page</Link>.
          Every submission is held for review, and our curator watches each film
          before it is published. We look for original storytelling, technical
          craft, and work the filmmaker has the rights to distribute.
        </p>

        <h2 style={h2}>AIV Originals</h2>
        <p style={p}>
          Alongside community submissions, AIV Network produces and commissions
          AIV Originals — projects developed in-house with partner creators.
        </p>

        <h2 style={h2}>Who runs AIV Network</h2>
        <p style={p}>
          AIV Network LLC was founded by Loren L. Qualls, a professor, cultural
          theorist, and author who studied the science and implications of
          generative AI at Harvard Kennedy School.
        </p>

        <h2 style={h2}>How it's funded</h2>
        <p style={p}>
          AIV Network is free to watch and supported by advertising. See our{" "}
          <Link href="/privacy" style={{ color: "#e50914" }}>Privacy Policy</Link>{" "}
          for how ads and cookies work on the site.
        </p>

        <h2 style={h2}>Contact</h2>
        <p style={p}>
          Questions, press, or partnership inquiries: visit our{" "}
          <Link href="/support" style={{ color: "#e50914" }}>Support page</Link>.
        </p>
      </div>
    </main>
  );
}

import Link from "next/link";

export const metadata = {
  title: "About — AIV Network",
  description:
    "AIV Network is a free streaming home for films made with generative AI, curated by a person rather than an algorithm.",
  alternates: { canonical: "/about" },
};

const p = { color: "#ccc", lineHeight: 1.7, marginBottom: 16 };
const h2 = { fontSize: 22, margin: "32px 0 10px" };
const a = { color: "#e50914" };

export default function AboutPage() {
  return (
    <main style={{ background: "#000", color: "#fff", minHeight: "100vh" }}>
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "60px 20px" }}>
        <h1 style={{ fontSize: 36, marginBottom: 16 }}>About AIV Network</h1>

        <p style={p}>
          AIV Network is a streaming home for a new kind of cinema: films made
          with generative AI. It is free to watch, and every title in the
          library is chosen by a person, not an algorithm.
        </p>

        <h2 style={h2}>Why we exist</h2>
        <p style={p}>
          Generative AI has made it possible for a single creator to produce
          work that once required a studio. But most of that work disappears
          into social feeds built for thirty-second clips. AIV Network gives
          these films a proper screen: a curated library with credits,
          synopses, and an audience that came to watch.
        </p>

        <h2 style={h2}>What you'll find here</h2>
        <p style={p}>
          The library has three parts. <strong>Community films</strong> are
          shorts and features submitted by AI filmmakers around the world.{" "}
          <strong>AIV Originals</strong> are projects we develop in-house with
          partner creators. And our <strong>classic collection</strong> brings
          together public-domain science fiction and horror from the 1930s
          through the 1960s, the films whose atmosphere and imagination so many
          of today's AI creators draw on.
        </p>

        <h2 style={h2}>How films are chosen</h2>
        <p style={p}>
          Every submission is held for review, and our curator watches each
          film before it is published. We look for original storytelling,
          visual craft, and a clear right to distribute: filmmakers confirm
          they own or have licensed their work, and every classic title is
          checked for public-domain status before it goes live. Browse the
          results in{" "}
          <Link href="/films" style={a}>All Films</Link>.
        </p>

        <h2 style={h2}>AIV Originals</h2>
        <p style={p}>
          AIV Originals are where we push the form ourselves. Coming soon is          <em>Eight Must Fall</em>, an AIV Original horror-western musical
          adapted from an original screenplay.
        </p>

        <h2 style={h2}>Who's behind AIV Network</h2>
        <p style={p}>
          AIV Network LLC was founded by Loren L. Qualls, a professor, cultural
          theorist, and author of several books, who studied the science and
          implications of generative AI at Harvard Kennedy School. AIV Network
          puts that study into practice: a platform that treats AI filmmaking
          as an art form worth curating, crediting, and watching seriously.
        </p>

        <h2 style={h2}>For filmmakers</h2>
        <p style={p}>
          If you make films with AI, we want to see them. Create a filmmaker
          account and{" "}
          <Link href="/submit" style={a}>submit your film</Link>. Submissions
          are free. See our{" "}
          <Link href="/terms" style={a}>Terms of Service</Link> for the
          submission agreement.
        </p>

        <h2 style={h2}>How it's funded</h2>
        <p style={p}>
          AIV Network is free to watch and supported by advertising. See our{" "}
          <Link href="/privacy" style={a}>Privacy Policy</Link> for how ads and
          cookies work on the site.
        </p>

        <h2 style={h2}>Contact</h2>
        <p style={p}>
          Questions, press, or partnership inquiries: email{" "}
          <a href="mailto:support@aivnetwork.online" style={a}>
            support@aivnetwork.online
          </a>{" "}
          or visit our <Link href="/support" style={a}>Support page</Link>.
        </p>
      </div>
    </main>
  );
}
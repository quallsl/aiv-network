import Link from "next/link";

// Server-rendered footer: real <a href> links so crawlers (and AdSense
// reviewers) can reach every content and policy page from any page.
const links = [
  ["/films", "All Films"],
  ["/about", "About"],
  ["/submit", "Submit a Film"],
  ["/support", "Support & Contact"],
  ["/privacy", "Privacy Policy"],
  ["/terms", "Terms of Service"],
];

export default function SiteFooter() {
  return (
    <footer style={{ background: "#000", borderTop: "1px solid #1c1c1c", color: "#808080", padding: "28px 20px", fontSize: 14 }}>
      <nav style={{ maxWidth: 1100, margin: "0 auto", display: "flex", flexWrap: "wrap", gap: "12px 24px" }}>
        {links.map(([href, label]) => (
          <Link key={href} href={href} style={{ color: "#b3b3b3" }}>{label}</Link>
        ))}
        <span style={{ marginLeft: "auto" }}>© {new Date().getFullYear()} AIV Network LLC</span>
      </nav>
    </footer>
  );
}

import "./globals.css";

export const metadata = {
  title: "AIV Network",
  description: "A Netflix-style streaming experience for AI films and AIV Originals.",
  applicationName: "AIV Network",
  metadataBase: new URL("https://aiv-network.vercel.app"), // change to your real domain when you have it
  openGraph: {
    title: "AIV Network",
    description: "A Netflix-style streaming experience for AI films and AIV Originals.",
    type: "website",
    url: "/",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "AIV Network" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "AIV Network",
    description: "A Netflix-style streaming experience for AI films and AIV Originals.",
    images: ["/twitter-image"],
  },
  icons: {
    icon: "/icon",
    apple: "/icon",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-black text-white min-h-screen flex flex-col">{children}</body>
    </html>
  );
}

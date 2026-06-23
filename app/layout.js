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
    icon: "/icon.png",
    apple: "/icon.png",
  },
};

import Script from "next/script";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>

        {/* ✅ Google IMA */}
        <Script
          src="https://imasdk.googleapis.com/js/sdkloader/ima3.js"
          strategy="beforeInteractive"
        />

        {/* ✅ Google AdSense */}
        <Script
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4013153499723354"
          strategy="afterInteractive"
          crossOrigin="anonymous"
        />

        {children}

      </body>
    </html>
  );
}

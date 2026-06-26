import "./globals.css";
import Script from "next/script";

export const metadata = {
  title: "AIV Network",
  description: "A Netflix-style streaming experience for AI films and AIV Originals.",
  applicationName: "AIV Network",
  metadataBase: new URL("https://aivnetwork.online"),
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>

        {/* ✅ Google IMA SDK (for video ads) */}
        <Script
          src="https://imasdk.googleapis.com/js/sdkloader/ima3.js"
          strategy="beforeInteractive"
        />

        {/* ✅ Google AdSense (ONLY correct version) */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4013153499723354"
          strategy="afterInteractive"
          crossOrigin="anonymous"
        />

        {children}

      </body>
    </html>
  );
}
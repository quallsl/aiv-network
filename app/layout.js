import "./globals.css";
import Script from "next/script";

export const metadata = {
  title: "AIV Network",
  description: "A Netflix-style streaming experience for AI films and AIV Originals.",
  applicationName: "AIV Network",
  metadataBase: new URL("https://aivnetwork.online"), // 👈 update this to your real domain
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      
      <head>
        {/* ✅ AdSense (MUST be here, no nesting) */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4013153499723354"
          crossOrigin="anonymous"
        ></script>
      </head>

      <body>

        {/* ✅ Google IMA */}
        <Script
          src="https://imasdk.googleapis.com/js/sdkloader/ima3.js"
          strategy="beforeInteractive"
        />

        {children}

      </body>
    </html>
  );
}
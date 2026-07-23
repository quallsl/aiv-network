import "./globals.css";
import Script from "next/script";

export const metadata = {
  title: "AIV Network",
  description:
    "A Netflix-style streaming experience for AI films and AIV Originals.",
  applicationName: "AIV Network",
  metadataBase: new URL("https://aivnetwork.online"),
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Google IMA SDK — must be beforeInteractive since AVODPlayer needs window.google.ima ready early */}
        <Script
          src="https://imasdk.googleapis.com/js/sdkloader/ima3.js"
          strategy="beforeInteractive"
        />
      </head>
      <body>
        {/* Google AdSense — afterInteractive is sufficient, doesn't need to block page load */}
        <Script
          id="adsense-script"
          async
          strategy="afterInteractive"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4013153499723354"
          crossOrigin="anonymous"
        />

        {children}
      </body>
    </html>
  );
}
import "./globals.css";
import Script from "next/script";

export const metadata = {
  title: "AIV Network",
  description:
    "A Netflix-style streaming experience for AI films and AIV Originals.",
  applicationName: "AIV Network",
  metadataBase: new URL("https://aivnetwork.online"),
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Google IMA SDK — must be beforeInteractive since AVODPlayer needs window.google.ima ready early */}
        <Script
          src="https://imasdk.googleapis.com/js/sdkloader/ima3.js"
          strategy="beforeInteractive"
        />
      </head>
      <body>
        {/* Google AdSense — afterInteractive is sufficient, doesn't need to block page load */}
        <Script
          id="adsense-script"
          async
          strategy="afterInteractive"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4013153499723354"
          crossOrigin="anonymous"
        />

        {children}
      </body>
    </html>
  );
}
import "./globals.css";

export const metadata = {
  title: "AIV Network",
  description: "A Netflix-style streaming experience for AI films and AIV Originals.",
  applicationName: "AIV Network",
  metadataBase: new URL("https://aivnetwork.online"),
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script src="https://imasdk.googleapis.com/js/sdkloader/ima3.js" />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4013153499723354"
          crossOrigin="anonymous"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}

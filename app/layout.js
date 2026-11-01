import "./globals.css";
import AdsenseScript from "./components/AdsenseScript";
import SiteFooter from "./components/SiteFooter";

export const metadata = {
  title: "AIV Network",
  description:
    "Stream curated AI-generated and independent films free on AIV Network, home of AIV Originals.",
  applicationName: "AIV Network",
  metadataBase: new URL("https://aivnetwork.online"),
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script src="https://imasdk.googleapis.com/js/sdkloader/ima3.js" />
      </head>
      <body>
        {children}
        <SiteFooter />
        <AdsenseScript />
      </body>
    </html>
  );
}

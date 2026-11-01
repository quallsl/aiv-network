"use client";

// Loads AdSense only on content pages. Google does not allow ads on
// login, account, admin, form, or error screens ("screens without
// publisher-content"), and Auto ads would otherwise place them there.
import { usePathname } from "next/navigation";

const NO_ADS_PREFIXES = ["/admin", "/signin", "/account", "/submit", "/delete-account"];

export default function AdsenseScript() {
  const pathname = usePathname() || "/";
  if (NO_ADS_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    return null;
  }
  return (
    // Plain async <script> so the tag is in the server-rendered HTML,
    // where AdSense's site verification looks for it.
    <script
      async
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4013153499723354"
      crossOrigin="anonymous"
    />
  );
}

import { SITE_URL } from "../lib/films-server";

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api", "/account", "/signin", "/delete-account"],
      },
      // AdSense's crawler should be able to see every page that may show ads.
      { userAgent: "Mediapartners-Google", allow: "/" },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}

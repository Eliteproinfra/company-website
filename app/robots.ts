import type { MetadataRoute } from "next";

// Already prerendered in the server build; stated explicitly because a static
// export (scripts/export.sh) errors on any metadata route that has not opted in.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://eliteproinfra.com/sitemap.xml",
  };
}

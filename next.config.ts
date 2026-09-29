import type { NextConfig } from "next";

// Static-export mode, switched on by scripts/export.sh via NEXT_EXPORT=true.
//
// This is a SEPARATE build target from the normal one. The default build is a
// Node.js server (`next start` on the VPS) where the mail API routes work; the
// export target produces a plain `out/` folder of files for hosting that cannot
// run Node, and the forms do not work there. Keep the two apart — do not make
// export the default.
const isExport = process.env.NEXT_EXPORT === "true";

const nextConfig: NextConfig = isExport
  ? {
      output: "export",
      // distDir is deliberately left at its default. In export mode distDir IS
      // the output directory, so setting it renames `out/` rather than moving
      // the build cache somewhere separate.
      // Directory-style output (`/about/index.html` instead of `/about.html`)
      // so Apache/LiteSpeed serves clean URLs without any rewrite rules.
      trailingSlash: true,
      images: {
        // The default loader optimizes images at request time, which needs a
        // server. Export ships the originals from /public as-is instead.
        unoptimized: true,
      },
      // NOTE: redirects() is deliberately absent here — it is unsupported in a
      // static export. The /property-management redirect is served by
      // deploy/htaccess-static instead, which export.sh copies into out/.
    }
  : {
      images: {
        // Instagram reel poster frames (components/home/InstagramReels) are
        // served from Meta's CDN, which spreads them across per-region
        // subdomains — scontent-del1-1.cdninstagram.com, instagram.fdel1-2.fna
        // .fbcdn.net, and so on — so the hostnames have to be wildcarded.
        // Not needed in the export branch above: `unoptimized: true` there
        // bypasses the optimizer, which is what enforces this allowlist.
        remotePatterns: [
          { protocol: "https", hostname: "**.cdninstagram.com" },
          { protocol: "https", hostname: "**.fbcdn.net" },
        ],
      },
      async redirects() {
        return [
          {
            source: "/property-management",
            destination: "/services/property-management",
            permanent: true,
          },
        ];
      },
    };

export default nextConfig;

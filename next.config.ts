import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  async headers() {
    return [
      {
        source: "/(.*)", // apply to all routes
        headers: [
          // Prevents the app from being embedded in iframes (clickjacking protection).
          {
            key: "X-Frame-Options", 
            value: "DENY",
          },
          // Prevents the browser from trying to guess (and potentially misinterpreting) content types.
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          // Hides referrer information entirely. You can tweak this based on how strict you want to be.
          {
            key: "Referrer-Policy",
            value: "no-referrer",
          },
          // Restricts access to browser features like camera, mic, geolocation.
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          // Prevents loading of unsafe or third-party scripts/styles. 
          // Extremely effective but must be tailored carefully if using external fonts, analytics, etc.
          // {
          //   key: "Content-Security-Policy",
          //   value: [
          //     "default-src 'self';",
          //     "connect-src 'self' https://stl-backend-fork.onrender.com;",
          //     "script-src 'self';",
          //     "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;",
          //     "font-src 'self' https://fonts.gstatic.com;",
          //     "img-src 'self' data:;",
          //     "object-src 'none';",
          //   ].join(" "),
          // },
        ],
      },
    ];
  },
};

export default nextConfig;

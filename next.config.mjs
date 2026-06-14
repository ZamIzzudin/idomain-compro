/** @format */
/** @type {import('next').NextConfig} */

const nextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

// next-pwa requires CommonJS - use createRequire for ESM compatibility
import { createRequire } from "module";
const require = createRequire(import.meta.url);

let finalConfig = nextConfig;

try {
  const withPWA = require("next-pwa");
  const pwaWrapper =
    typeof withPWA === "function"
      ? withPWA
      : withPWA.default;

  finalConfig = pwaWrapper({
    dest: "public",
    register: false,
    disable: process.env.NODE_ENV === "development",
  })(nextConfig);
} catch (e) {
  console.warn("next-pwa not loaded:", e.message);
}

export default finalConfig;

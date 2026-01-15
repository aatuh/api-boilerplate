import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  transpilePackages: [
    "@api-boilerplate/ui",
    "@api-boilerplate/theme",
    "@api-boilerplate/i18n-shared",
    "@api-boilerplate/legal",
    "@api-boilerplate/content",
    "@api-boilerplate/http",
    "@api-boilerplate/env",
    "@api-boilerplate/layouts",
    "@api-boilerplate/widgets",
    "@api-boilerplate/app-config",
    "@api-boilerplate/app-api-client",
    "@api-boilerplate/app-domain",
    "@api-boilerplate/app-domain-adapters",
    "@api-boilerplate/app-hooks",
    "@api-boilerplate/app-i18n",
    "@api-boilerplate/app-legal",
  ],
};

export default nextConfig;

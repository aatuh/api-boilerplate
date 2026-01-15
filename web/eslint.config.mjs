import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    files: ["packages/services/app/domain/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: [
                "@api-boilerplate/app-api-client",
                "@api-boilerplate/app-config",
                "@api-boilerplate/app-domain-adapters",
                "@api-boilerplate/app-hooks",
                "@api-boilerplate/app-i18n",
                "@api-boilerplate/app-legal",
                "@api-boilerplate/content",
                "@api-boilerplate/env",
                "@api-boilerplate/http",
                "@api-boilerplate/i18n-shared",
                "@api-boilerplate/legal",
                "@api-boilerplate/layouts",
                "@api-boilerplate/theme",
                "@api-boilerplate/ui",
                "@api-boilerplate/widgets",
              ],
              message: "Domain layer must stay framework-agnostic and adapter-free.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["packages/services/app/domain-adapters/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: [
                "@api-boilerplate/app-config",
                "@api-boilerplate/app-hooks",
                "@api-boilerplate/app-i18n",
                "@api-boilerplate/app-legal",
                "@api-boilerplate/content",
                "@api-boilerplate/env",
                "@api-boilerplate/i18n-shared",
                "@api-boilerplate/legal",
                "@api-boilerplate/layouts",
                "@api-boilerplate/theme",
                "@api-boilerplate/ui",
                "@api-boilerplate/widgets",
              ],
              message: "Domain adapters should not depend on UI or app-level packages.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["packages/core/ui/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: [
                "@api-boilerplate/app-api-client",
                "@api-boilerplate/app-config",
                "@api-boilerplate/app-domain",
                "@api-boilerplate/app-domain-adapters",
                "@api-boilerplate/app-hooks",
                "@api-boilerplate/app-i18n",
                "@api-boilerplate/app-legal",
              ],
              message: "UI primitives should not depend on domain or adapter layers.",
            },
          ],
        },
      ],
    },
  },
]);

export default eslintConfig;

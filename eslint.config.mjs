import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  // Allow CommonJS `require()` in test and Playwright files (Node-only)
  {
    files: [
      "tests/**/*.{js,cjs,mjs,ts,tsx}",
      "tests/e2e/**/*.{js,cjs,mjs,ts,tsx}",
      "tests/unit/**/*.{js,cjs,mjs,ts,tsx}",
    ],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    },
  },
];

export default eslintConfig;

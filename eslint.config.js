import js from "@eslint/js";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import jsxA11y from "eslint-plugin-jsx-a11y";
import eslintConfigPrettier from "eslint-config-prettier";
import globals from "globals";

export default tseslint.config(
  {
    ignores: [
      "dist",
      "public",
      "coverage",
      "node_modules",
      ".cache",
      "playwright-report",
      "test-results",
      "tests/visual/__screenshots__",
      ".specify",
      "specs",
      // Gitignored scratch area holding unrelated checked-out repos. ESLint
      // does not read .gitignore, so it has to be named here.
      "tmp",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
  {
    // Accessibility rules for JSX only. Several are currently `warn` because
    // the admin editors violate them; they are promoted to `error` once the
    // schema-driven editor lands.
    files: ["**/*.tsx"],
    ...jsxA11y.flatConfigs.recommended,
  },
  {
    // The seed corpus and Firebase Admin tooling must never be imported into
    // the client bundle.
    files: ["src/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "firebase-admin",
              message: "firebase-admin is server-only; use it in scripts/.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["tests/**/*.{ts,tsx}"],
    languageOptions: { globals: globals.node },
  },
  {
    files: ["scripts/**/*.{ts,mjs}", "*.config.{ts,js}"],
    languageOptions: { globals: globals.node },
  },
  eslintConfigPrettier
);

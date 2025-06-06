import { fixupConfigRules } from "@eslint/compat";
import { FlatCompat } from "@eslint/eslintrc";
import pluginJs from "@eslint/js";
import hooksPlugin from "eslint-plugin-react-hooks";
import pluginReactConfig from "eslint-plugin-react/configs/recommended.js";
import globals from "globals";
import tseslint from "typescript-eslint";

const compat = new FlatCompat();

export default [
  { files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"] },
  { languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } } },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  // Typescript
  ...tseslint.configs.recommended,
  // Tailwind
  // React
  ...fixupConfigRules(pluginReactConfig),
  {
    plugins: {
      "react-hooks": hooksPlugin,
    },
    rules: hooksPlugin.configs.recommended.rules,
  },
  // NextJS
  {
    ignores: [".next/"],
  },
  ...fixupConfigRules(compat.extends("plugin:@next/next/core-web-vitals")),
  // Rules config
  {
    rules: {
      "react/react-in-jsx-scope": 0,
      "react/no-unescaped-entities": 0,
      "react/prop-types": 0,
      "@typescript-eslint/ban-types": 0,
      "@next/next/no-img-element": 0,
      "tailwindcss/no-custom-classname": 0,
      "@typescript-eslint/no-unused-vars": [
        1,
        {
          vars: "all",
          args: "after-used",
          ignoreRestSiblings: true,
          argsIgnorePattern: "props",
          varsIgnorePattern: "^_",
        },
      ],
    },
  },
  // Ignore files
  {
    ignores: ["tailwind.config.js", "next.config.js", "*.js"],
  },
];

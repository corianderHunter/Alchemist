module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    "plugin:vue/essential",
    "eslint:recommended",
    "@vue/typescript/recommended",
  ],
  parserOptions: {
    ecmaVersion: 2020,
  },
  ignorePatterns: ["assets"],
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "warn",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "warn",
    "@typescript-eslint/no-empty-function": "off",
    "@typescript-eslint/camelcase": 0,
    "no-empty-function": ["off"],
    "@typescript-eslint/no-explicit-any": ["off"],
    "@typescript-eslint/no-this-alias": ["off"],
    "@typescript-eslint/no-inferrable-types": "off",
  },
};
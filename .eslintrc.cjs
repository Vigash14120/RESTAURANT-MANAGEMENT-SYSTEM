module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module"
  },
  env: {
    es2022: true
  },
  plugins: ["@typescript-eslint"],
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended", "prettier"],
  ignorePatterns: ["**/dist/**", "**/node_modules/**"],
  rules: {
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_"
      }
    ]
  },
  overrides: [
    {
      files: ["apps/api/src/**/*.ts"],
      env: {
        node: true
      }
    },
    {
      files: ["apps/web/src/**/*.{ts,tsx}"],
      env: {
        browser: true
      },
      plugins: ["react", "react-hooks"],
      extends: ["plugin:react/recommended", "plugin:react-hooks/recommended"],
      settings: {
        react: {
          version: "detect"
        }
      },
      rules: {
        "react/react-in-jsx-scope": "off"
      }
    }
  ]
};

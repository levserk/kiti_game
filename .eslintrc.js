module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true
  },
  plugins: ["prettier"],
  extends: ["eslint:recommended", "plugin:prettier/recommended"],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module"
  },
  rules: {
    "prettier/prettier": 0,
    "linebreak-style": ["error", "unix"],
    semi: ["error", "always"]
  }
};

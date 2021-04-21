module.exports = {
  env: {
    commonjs: true,
    es2021: true,
    node: true,
  },
  extends: ["standard", "plugin:jsonc/recommended-with-jsonc", "prettier"],
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
    "comma-dangle": "off",
    "space-before-function-paren": "off",
  },
};

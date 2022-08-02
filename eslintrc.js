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
  rules: {
    "vue/valid-v-slot": "off",
    "prettier/prettier": 0,

    "no-explicit-any": "off",
    "explicit-module-boundary-types": "off",
  },
};

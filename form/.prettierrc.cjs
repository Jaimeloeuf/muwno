module.exports = {
  // Require is used instead of just "prettier-plugin-tailwindcss" for better
  // vscode plugin support since it can be ran before file save.
  plugins: [require("prettier-plugin-tailwindcss")],
};

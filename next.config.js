const withPWA = require("next-pwa");

module.exports = withPWA({
  pwa: {
    dest: "public",
    disable: process.env.NODE_ENV === "development",
  },
  // This is added to ensure a `lang` attribute is added to the `<html>` tag.
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
});

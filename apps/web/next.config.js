const withTM = require("next-transpile-modules")(["ui", "@jayjnu/mobx-query"]);

module.exports = withTM({
  reactStrictMode: true,
});

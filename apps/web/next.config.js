const withTM = require("next-transpile-modules")(["ui", "@jayjnu/mobx-query", "mock-api"]);

module.exports = withTM({
  reactStrictMode: true,
});

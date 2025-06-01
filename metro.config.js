const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

config.resolver.alias = {
  ...config.resolver.alias,
  "@": "./src",
  "@root": "./",
};

module.exports = withNativeWind(config, { input: "./global.css" });

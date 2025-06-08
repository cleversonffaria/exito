const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

const { transformer, resolver } = config;

config.transformer = {
  ...transformer,
  babelTransformerPath: require.resolve("react-native-svg-transformer"),
};

config.resolver = {
  ...resolver,
  assetExts: [
    ...resolver.assetExts.filter((ext) => ext !== "svg"),
    "mp4",
    "avi",
    "mov",
  ],
  sourceExts: [...resolver.sourceExts, "svg"],
  alias: {
    "@": "./src",
    "@root": "./",
    "@atom": "./src/components/atom",
    "@molecules": "./src/components/molecules",
    "@organisms": "./src/components/organisms",
    "@pages": "./src/components/pages",
    "@store": "./src/store",
    "@hooks": "./src/hooks",
    "@schemas": "./src/schemas",
    "@constants": "./src/constants",
    "@utils": "./src/utils",
    "@assets": "./src/assets",
  },
};

module.exports = withNativeWind(config, { input: "./global.css" });

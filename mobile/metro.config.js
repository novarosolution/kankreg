const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const config = getDefaultConfig(__dirname);

const { assetExts, sourceExts } = config.resolver;

config.transformer = {
  ...config.transformer,
  babelTransformerPath: require.resolve("react-native-svg-transformer"),
};

config.resolver = {
  ...config.resolver,
  assetExts: assetExts.filter((ext) => ext !== "svg"),
  // Keep json (icon glyphmaps) + svg as source extensions for Metro resolution.
  sourceExts: [...new Set([...sourceExts, "svg", "json"])],
  nodeModulesPaths: [path.resolve(__dirname, "node_modules")],
};

module.exports = config;

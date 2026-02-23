const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const path = require("path");

const config = getDefaultConfig(__dirname);

// Add watchFolders to ensure NativeWind cache directory is watched
config.watchFolders = [
  path.resolve(__dirname, "node_modules/react-native-css-interop/.cache"),
];

// Ensure cache directory is not blocked
config.resolver = {
  ...config.resolver,
  blockList: config.resolver?.blockList || [],
};

module.exports = withNativeWind(config, {
  input: "./global.css",
  // Force write CSS to file system instead of virtual modules
  // This fixes iOS styling issues in development mode
  forceWriteFileSystem: true,
});

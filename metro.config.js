const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// Firebase Auth + Hermes Fix
config.resolver.sourceExts.push("cjs");
config.resolver.unstable_enablePackageExports = false;

// NativeWind CSS
module.exports = withNativeWind(config, {
  input: "./app/globals.css",
});

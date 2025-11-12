// woff2 인식용 config

const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

const defaultAssetExts = config.resolver.assetExts;

config.resolver.assetExts = [...defaultAssetExts, "woff", "woff2"];

module.exports = config;

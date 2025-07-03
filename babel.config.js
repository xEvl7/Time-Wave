module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo", "module:metro-react-native-babel-preset"],
    plugins: [
      "@babel/plugin-syntax-dynamic-import",
      "react-native-reanimated/plugin",
    ],
  };
};

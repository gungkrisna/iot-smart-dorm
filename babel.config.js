process.env.EXPO_ROUTER_APP_ROOT = "../../src/app";
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      ['module:react-native-dotenv'],
      require.resolve('expo-router/babel'),
      '@babel/plugin-proposal-export-namespace-from',
      'react-native-reanimated/plugin'
    ],
  };
};







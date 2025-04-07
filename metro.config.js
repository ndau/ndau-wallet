const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

const {
  resolver: {sourceExts: defaultSourceExts, assetExts: defaultAssetExts},
} = getDefaultConfig(__dirname);

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
  transformer: {
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: false,
      },
    }),
  },
  resolver: {
    assetExts: defaultAssetExts.filter(ext => ext !== 'svg'),
    sourceExts: [...defaultSourceExts, 'svg'],
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);

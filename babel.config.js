module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module:react-native-dotenv',
      {
        moduleName: '@env',
        path: '.env',
        safe: false,
        allowUndefined: true,
      },
    ],
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: [
          '.ios.ts',
          '.android.ts',
          '.ios.tsx',
          '.android.tsx',
          '.ts',
          '.tsx',
          '.js',
          '.json',
        ],
        alias: {
          '@navigation': './src/navigation',
          '@modules': './src/modules',
          '@components': './src/components',
          '@theme': './src/theme',
          '@utils': './src/utils',
          '@assets': './src/assets',
          '@types': './src/types',
          '@i18n': './src/i18n',
          '@hooks': './src/hooks',
          '@context': './src/context',
          '@store': './src/store',
          '@api': './src/api',
          '@config': './src/config',
          '@constants': './src/constants',
          '@socket': './src/sockets',
          '@slices': './src/slices',
        },
      },
    ],
    'react-native-worklets/plugin',
  ],
};

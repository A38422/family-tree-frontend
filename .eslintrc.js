module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  parserOptions: {
    parser: '@babel/eslint-parser',
    requireConfigFile: false,
  },
  extends: ['@nuxtjs', 'plugin:nuxt/recommended', 'prettier'],
  plugins: [],
  // add your custom rules here
  rules: {
    'no-console': 0,
    'selector-anb-no-unmatchable': 'off',
    'no-globals-in-created': 0,
    'declaration-block-no-duplicate-properties': [
      0,
      {
        ignore: ['consecutive-duplicates'],
      },
    ],
  },
}

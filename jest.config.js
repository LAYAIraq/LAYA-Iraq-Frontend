module.exports = {
  moduleFileExtensions: [
    'js',
    'json',
    // tell Jest to handle `*.vue` files
    'vue',
    'ts'
  ],

  moduleNameMapper: {
    '/^@\/(.*)$/': '<rootDir>/src/$1',
    '^vue$': 'vue/dist/vue.common.js'
  },

  resolver: null,
  rootDir: './',

  transform: {
    // process `*.vue` files with `vue-jest`
    '.*\\.(vue)$': 'vue-jest',
    '.*\\.(js)$': 'babel-jest',
    '.*\\.(ts)$': 'ts-jest'
  },

  preset: '@vue/cli-plugin-unit-jest/presets/typescript-and-babel',
  testEnvironment: 'jsdom'
}

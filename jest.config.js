module.exports = {
  moduleFileExtensions: [
    'js',
    'json',
    'vue',
    'ts'
  ],

  moduleNameMapper: {
    '/^@\/(.*)$/': '<rootDir>/src/$1',
    '.*\\.(css|styl|less|sass|scss|svg)$': '<rootDir>/tests/mocks/style-mock.ts'
  },

  resolver: null,
  rootDir: './',

  transform: {
    '.*\\.(js)$': 'babel-jest',
    '.*\\.(ts)$': 'ts-jest',
    '.*\\.(vue)$': 'vue-jest'
  },

  preset: '@vue/cli-plugin-unit-jest/presets/typescript-and-babel',
  testEnvironment: 'jsdom'
}

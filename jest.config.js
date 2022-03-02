module.exports = {
  moduleFileExtensions: [
    'js',
    'json',
    // tell Jest to handle `*.vue` files
    'vue'
  ],
  moduleNameMapper: {
    '/^@\/(.*)$/': '<rootDir>/src/$1'
  },
  preset: '@vue/cli-plugin-unit-jest',
  resolver: null,
  rootDir: '../..',
  transform: {
    // process `*.vue` files with `vue-jest`
    '.*\\.(vue)$': 'vue-jest',
    '.*\\.(js)$': 'babel-jest'
  }
}

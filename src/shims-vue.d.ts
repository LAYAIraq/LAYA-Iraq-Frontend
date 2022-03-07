/**
 * Filename: shims-vue.d.ts
 * Use: module declaration for vue files to run tests
 * Creator: cmc
 * Date: March 6, 2021
 */
declare module '*.vue' {
  import Vue from 'vue'
  export default Vue
}

/**
 * Filename: index.ts
 * Use: expose LayaFlag to $laya
 * Creator: cmc
 * Date: October 13, 2021
 * Dependencies: vue
 */

import _Vue from 'vue'
import _view from './flag-icon.vue'

export default {
  install (Vue: typeof _Vue): void {
    Vue.component(_view.name, _view)
  }
}

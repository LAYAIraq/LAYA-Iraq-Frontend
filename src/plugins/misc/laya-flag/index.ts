/**
 * Filename: index.ts
 * Use: expose LayaFlag to $laya
 * Creator: cmc
 * Date: June 28, 2021
 * Dependencies: vue
 */

import _Vue from 'vue'
import _view from './flag.vue'

export default {
  install (Vue: typeof _Vue): void {
    Vue.component(_view.name, _view)
  }
}

/**
 * Filename: index.ts
 * Use: expose Sort to $laya
 * Creator: core
 * Date: unknown
 * Dependencies: vue
 */

import _Vue from 'vue'
import view from './view.vue'

export default {
  install (Vue: typeof _Vue): void {
    Vue.$laya.registerPlugin(
      'laya-quiz-sort',
      'assessment',
      'fas fa-sort-amount-up',
      {
        edit: view,
        // @ts-ignore
        view
      }
    )
  }
}

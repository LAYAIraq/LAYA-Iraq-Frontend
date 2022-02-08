/**
 * Filename: index.ts
 * Use: expose Sort to $laya
 * Creator: core
 * Date: unknown
 * Dependencies: vue
 */

import _Vue from 'vue'
import _view from './view.vue'

export default {
  install (Vue: typeof _Vue): void {
    Vue.$laya.registerLA(
      'laya-quiz-sort',
      'AssessmentSort',
      'layaLaSort',
      'fas fa-sort-amount-up',
      {
        new: _view,
        // @ts-ignore
        view: _view,
        edit: _view
      }
    )
  }
}

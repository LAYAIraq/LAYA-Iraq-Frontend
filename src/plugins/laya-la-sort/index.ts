/**
 * Filename: index.ts
 * Use: expose Sort to $laya
 * Creator: core
 * Date: unknown
 * Dependencies: vue
 */

import _Vue from 'vue'

import _create from './view.vue'
import _edit from './view.vue'
import _view from './view.vue'
import i18n from './i18n.js'

export default {
  install(Vue: typeof _Vue, options?: any): void {
    Vue.$laya.registerLA('laya-quiz-sort', 'AssessmentSort', i18n, {
      new: _create,
      //@ts-ignore
      view: _edit,
      edit: _view,
    })
  }
}

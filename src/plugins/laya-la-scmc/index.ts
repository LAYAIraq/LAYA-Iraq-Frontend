/**
 * Filename: index.ts
 * Use: expose Multiple Choice/Response to $laya
 * Creator: core
 * Date: unknown
 * Dependencies: vue
 */

import _Vue from 'vue'

import _create from './create.vue'
import _view from './view.vue'
import _edit from './edit.vue'
import i18n from './i18n.js'

export default {
  install(Vue: typeof _Vue, options?: any): void {
    Vue.$laya.registerLA('laya-scmc', 'AssessmentScmc',
      i18n,
      {
        new: _create,
        //@ts-ignore
        view: _view,
        edit: _edit,
      },
    )
  }
}

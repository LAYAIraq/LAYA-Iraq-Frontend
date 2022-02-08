/**
 * Filename: index.ts
 * Use: expose Relate to $laya
 * Creator: core
 * Date: unknown
 * Dependencies: vue
 */

import _Vue from 'vue'
import _view from './view.vue'

export default {
  install(Vue: typeof _Vue, options?: any): void {
    Vue.$laya.registerLA(
      'laya-quiz-relate',
      'AssessmentRelate',
      'layaLaRelate',
      'fas fa-paperclip',
      {
        new: () => import('./create.vue'),
        //@ts-ignore
        view: _view, // not lazily loaded b/c always visible
        edit: () => import('./edit.vue')
      }
    )
  }
}

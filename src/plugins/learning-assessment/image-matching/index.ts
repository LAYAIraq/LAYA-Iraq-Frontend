/**
 * Filename: index.ts
 * Use: expose Relate to $laya
 * Creator: core
 * Date: unknown
 * Dependencies: vue
 */

import _Vue from 'vue'
import _view from './image-matching-view.vue'

export default {
  install (Vue: typeof _Vue): void {
    Vue.$laya.registerPlugin(
      'image-matching',
      'assessment',
      'fas fa-paperclip',
      {
        // @ts-ignore
        view: _view, // not lazily loaded b/c always visible
        edit: () => import('./image-matching-edit.vue')
      }
    )
  }
}

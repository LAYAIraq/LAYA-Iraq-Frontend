/**
 * Filename: index.ts
 * Use: expose WYSIWYG to $laya
 * Creator: core
 * Date: unknown
 * Dependencies: vue
 */

import _Vue from 'vue'
import _view from './view.vue'

export default {
  install(Vue: typeof _Vue, options?: any): void {
    Vue.$laya.registerLB(
      'laya-wysiwyg',
      'BlockWysiwyg',
      'layaHtml',
      'fas fa-keyboard',
      {
        new: () => import('./create.vue'),
        //@ts-ignore
        view: _view, // not lazily loaded b/c always visible
        edit: () => import('./edit.vue')
    })
  }
}

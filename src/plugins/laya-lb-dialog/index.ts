/**
 * Filename: index.ts
 * Use: expose Dialog to $laya
 * Creator: core
 * Date: unknown
 * Dependencies: vue
 */

import _Vue from 'vue'
import _view from './view.vue'

export default {
  install (Vue: typeof _Vue): void {
    Vue.$laya.registerLB(
      'laya-dialog',
      'BlockDialog',
      'layaLbDialog',
      'fas fa-route',
      {
        new: () => import('./create.vue'),
        // @ts-ignore
        view: _view, // not lazily loaded b/c always visible
        edit: () => import('./edit.vue')
      }
    )
  }
}

/**
 * Filename: index.ts
 * Use: expose Free Text to $laya
 * Creator: core
 * Since: v1.0.0
 */

import _Vue from 'vue'
import edit from './free-text-edit.vue'
import view from './free-text-view.vue'

export default {
  install (Vue: typeof _Vue): void {
    Vue.$laya.registerPlugin(
      'free-text',
      'block',
      'fas fa-keyboard',
      {
        // @ts-ignore
        view, // not lazily loaded b/c always visible
        edit
      }
    )
  }
}

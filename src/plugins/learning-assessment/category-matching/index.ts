/**
 * Filename: index.ts
 * Use: Expose Drag & Drop Plugin to $laya
 * Creator: core
 * Date: unknown
 * Dependencies:
 *  vue
 */

import _Vue from 'vue'
import view from './category-matching-view.vue'
import edit from './category-matching-edit.vue'

export default {
  install (Vue: typeof _Vue): void {
    Vue.$laya.registerPlugin(
      'category-matching',
      'assessment',
      'fas fa-ellipsis-h',
      {
        // @ts-ignore
        view, // not lazily loaded b/c always needed
        edit
      }

    )
  }
}

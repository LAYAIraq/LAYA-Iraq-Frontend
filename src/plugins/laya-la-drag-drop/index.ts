/**
 * Filename: index.ts
 * Use: Expose Drag & Drop Plugin to $laya
 * Creator: core
 * Date: unknown
 * Dependencies:
 *  vue
 */

import _Vue from 'vue'
import _view from './view.vue'

export default {
  install (Vue: typeof _Vue): void {
    Vue.$laya.registerLA(
      'laya-quiz-drag-drop',
      'AssessmentDragDrop',
      'layaLaDragDrop',
      'fas fa-ellipsis-h',
      {
        new: () => import('./create.vue'),
        // @ts-ignore
        view: _view, // not lazily loaded b/c always needed
        edit: () => import('./edit.vue')
      }
    )
  }
}

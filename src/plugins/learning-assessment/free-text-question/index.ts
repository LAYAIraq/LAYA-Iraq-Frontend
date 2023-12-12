/**
 * Filename: index.ts
 * Use: expose freetext question to $laya
 * Creator: core
 * Since: v1.0.0
 */
import _Vue from 'vue'
import edit from './free-text-question-edit.vue'
import view from './free-text-question-view.vue'

export default {
  install (Vue: typeof _Vue): void {
    Vue.$laya.registerPlugin(
      'free-text-question',
      'assessment',
      'fas fa-user-graduate',
      {
        // @ts-ignore
        view, // not lazily loaded b/c always visible
        edit
      }
    )
  }
}

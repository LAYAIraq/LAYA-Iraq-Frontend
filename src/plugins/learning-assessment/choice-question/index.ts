/**
 * Filename: index.ts
 * Use: expose Choice Question to $laya
 * Creator: core
 * Since: v1.0.0
 */
import _Vue from 'vue'
import edit from './choice-question-edit.vue'
import view from './choice-question-view.vue'

export default {
  install (Vue: typeof _Vue): void {
    Vue.$laya.registerPlugin(
      'choice-question',
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

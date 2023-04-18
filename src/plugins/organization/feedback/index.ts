/**
 * Filename: index.ts
 * Use: expose Course Feedback to $laya
 * Creator: core
 * Since: v1.0.0
 */

import _Vue from 'vue'
import edit from './feedback-edit.vue'
import view from './feedback-view.vue'

export default {
  install (Vue: typeof _Vue): void {
    Vue.$laya.registerPlugin(
      'feedback',
      'organization',
      'fas fa-comment-dots',
      {
        // @ts-ignore
        view, // not lazily loaded b/c always visible
        edit
      }
    )
  }
}

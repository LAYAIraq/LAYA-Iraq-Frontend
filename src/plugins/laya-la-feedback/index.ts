/**
 * Filename: index.ts
 * Use: expose Course Feedback to $laya
 * Creator: core
 * Date: unknown
 * Dependencies: vue
 */

import _Vue from 'vue'
import _view from './view.vue'

export default {
  install (Vue: typeof _Vue): void {
    Vue.$laya.registerLA(
      'laya-course-feedback',
      'CourseFeedback',
      'layaLaFeedback',
      'fas fa-comment-dots',
      {
        new: () => import('./create.vue'),
        // @ts-ignore
        view: _view, // not lazily loaded b/c always visible
        edit: () => import('./edit.vue')
      }
    )
  }
}

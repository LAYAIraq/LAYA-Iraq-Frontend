/**
 * Filename: index.ts
 * Use: expose Course Feedback to $laya
 * Creator: core
 * Date: unknown
 * Dependencies: vue
 */

import _Vue from 'vue'

import _create from './edit.vue'
import _edit from './edit.vue'
import _view from './view.vue'

export default {
  install(Vue: typeof _Vue, options?: any): void {
    Vue.$laya.registerLA(
      'laya-course-feedback', 
      'CourseFeedback', 
      'layaLaFeedback',
      'fas fa-comment-dots',
      {
        new: _create,
        //@ts-ignore
        view: _view,
        edit: _edit
      }
    )
  }
}

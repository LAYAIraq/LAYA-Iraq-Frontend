/**
 * Filename: index.ts
 * Use: expose Video to $laya
 * Creator: core
 * Since: v1.0.0
 */

import _Vue from 'vue'
import edit from './video-edit.vue'
import view from './video-view.vue'

export default {
  install (Vue: typeof _Vue): void {
    Vue.$laya.registerPlugin(
      'video-player',
      'block',
      'fab fa-youtube',
      {
        // @ts-ignore
        view,
        edit
      }
    )
  }
}

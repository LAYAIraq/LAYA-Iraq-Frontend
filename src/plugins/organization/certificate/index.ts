/**
 * Filename: index.ts
 * Use: expose Certificate to $laya
 * Creator: nv
 * Since: v1.3.0
 */

import _Vue from 'vue'
import edit from './certificate-edit.vue'
import view from './certificate-view.vue'

export default {
  install (Vue: typeof _Vue): void {
    Vue.$laya.registerPlugin(
      'certificate',
      'organization',
      'fas fa-route',
      {
        // @ts-ignore
        view, // not lazily loaded b/c always visible
        edit
      }
    )
  }
}

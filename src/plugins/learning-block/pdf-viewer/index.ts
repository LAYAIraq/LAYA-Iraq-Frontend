/**
 * Filename: index.ts
 * Use: expose Pdf Viewer to $laya
 * Creator: nv
 * Since: v1.3.0
 */

import _Vue from 'vue'
import edit from './pdf-viewer-edit.vue'
import view from './pdf-viewer-view.vue'

export default {
  install (Vue: typeof _Vue): void {
    Vue.$laya.registerPlugin(
      'pdf-viewer',
      'block',
      'fas fa-file-pdf',
      {
        // @ts-ignore
        view, // not lazily loaded b/c always visible
        edit
      }
    )
  }
}

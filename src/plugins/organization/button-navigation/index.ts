/**
 * Filename: index.ts
 * Use: expose Button Navigation to $laya
 * Creator: core
 * Since: v1.0.0
 */

import _Vue from 'vue'
import edit from './button-navigation-edit.vue'
import view from './button-navigation-view.vue'

export default {
  install (Vue: typeof _Vue): void {
    Vue.$laya.registerPlugin(
      'button-navigation',
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

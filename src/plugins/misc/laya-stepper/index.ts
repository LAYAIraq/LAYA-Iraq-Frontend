/**
 * Filename: index.ts
 * Use: expose Stepper to $laya
 * Creator: core
 * Date: unknown
 * Dependencies: vue
 */

import _Vue from 'vue'
import _view from './view.vue'

export default {
  install (Vue: typeof _Vue): void {
    Vue.$laya.registerLB(
      'laya-stepper',
      'BlockStepper',
      'layaStepper',
      '',
      {
        new: _view,
        // @ts-ignore
        view: _view,
        edit: _view
      })
  }
}

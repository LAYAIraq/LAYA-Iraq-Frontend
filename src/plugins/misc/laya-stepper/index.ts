/**
 * Filename: index.ts
 * Use: expose Stepper to $laya
 * Creator: core
 * Date: unknown
 * Dependencies: vue
 */

import _Vue from 'vue'

import _create from './view.vue'
import _edit from './view.vue'
import _view from './view.vue'

export default {
  install(Vue: typeof _Vue, options?: any): void {
    Vue.$laya.registerLB(
      'laya-stepper', 
      'BlockStepper', 
      'layaStepper', 
      '',
      {
        new: _create,
        //@ts-ignore
        view: _view,
        edit: _view,
    })
  }
}

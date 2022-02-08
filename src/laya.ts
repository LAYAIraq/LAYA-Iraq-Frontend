/**
 * Filename: laya.ts
 * Use: make all content blocks available as global mixin
 * Creator: core
 * Date: unknown
 * Dependencies: vue
 */

import _Vue, { VueConstructor } from 'vue'

// copied from laya.d.ts
// 2. Specify a file with the types you want to augment
//    Vue has the constructor type in types/vue.d.ts
declare module 'vue/types/vue' {
  // 3. Declare augmentation for Vue
  interface Vue {
    $laya: Laya;
  }
}

declare module 'vue/types/vue' {
  // Global properties can be declared
  // on the `VueConstructor` interface
  interface VueConstructor {
    $laya: Laya;
  }
}

/** this class takes care of laya specific frontend (Vue) concerns
 *   i.e. it implements the $laya behaviour
 */

export class Laya {
  private _vue: typeof _Vue;
  private _lb: object;
  private _la: object;
  private _li: object; /* lookup for learn interactions to block/assessment */

  public get lb () {
    return this._lb
  }

  public get la () {
    return this._la
  }

  public get li () {
    return this._li
  }

  constructor (v: typeof _Vue) {
    this._vue = v
    this._lb = {}
    this._la = {}
    this._li = {}
  }

  public lookupType (type: string): object {
    return this._li[type]
  }

  public registerLB<VC1, VC2, VC3 extends VueConstructor> (
    id: string,
    type: string,
    name: string,
    icon: string,
    components: { new?: VC1; edit?: VC2; view: VC3 }
  ): void {
    this._lb[id] = { id, type, name, components, icon }
    this._li[type] = { type: 'block', id }

    if ('new' in components) {
      this._vue.component(id, components.new)
    }

    if ('edit' in components) {
      this._vue.component(id, components.edit)
    }

    this._vue.component(id, components.view)
  }

  public registerLA<VC1, VC2, VC3 extends VueConstructor> (
    id: string,
    type: string,
    name: string,
    icon: string,
    components: { new?: VC1; edit?: VC2; view: VC3 }
  ): void {
    this._la[id] = { id, type, name, components, icon }
    this._li[type] = { type: 'assessment', id }

    if ('new' in components) {
      this._vue.component(id, components.new)
    }

    if ('edit' in components) {
      this._vue.component(id, components.edit)
    }

    this._vue.component(id, components.view)
  }
}

export default {
  install (Vue: typeof _Vue, options?: any): void {
    const $laya = new Laya(Vue)
    // @ts-ignore
    Vue.$laya = $laya // important to make $laya available to other plugins.
    Vue.prototype.$laya = $laya

    Vue.mixin({
      data (): object {
        return {
          $laya: {
            lb: $laya.lb,
            la: $laya.la,
            li: $laya.li
          }
        }
      }
    })
  }
}

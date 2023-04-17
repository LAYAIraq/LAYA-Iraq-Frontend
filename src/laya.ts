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
  private readonly _la: object;
  private _assessments: object;
  private _blocks: object;
  private _organization: object;

  public get lb () {
    return this._lb
  }

  public get la () {
    return this._la
  }

  public get li () {
    return { ...this._la, ...this._lb }
  }

  public get assessments () {
    return this._assessments
  }

  public get blocks () {
    return this._blocks
  }

  public get organization () {
    return this._organization
  }

  constructor (v: typeof _Vue) {
    this._vue = v
    this._lb = {}
    this._la = {}
    this._assessments = {}
    this._blocks = {}
    this._organization = {}
  }

  public registerLB<VC1, VC2, VC3 extends VueConstructor> (
    id: string,
    type: string,
    name: string,
    icon: string,
    components: { new?: VC1; edit?: VC2; view: VC3 }
  ): void {
    this._lb[id] = { id, type, name, components, icon }

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

    if ('new' in components) {
      this._vue.component(id, components.new)
    }

    if ('edit' in components) {
      this._vue.component(id, components.edit)
    }

    this._vue.component(id, components.view)
  }

  public registerPlugin<EditComponent, ViewComponent extends VueConstructor> (
    id: string,
    type: string,
    icon: string,
    components: { edit?: EditComponent; view: ViewComponent }
  ): void {
    const plugin = { id, type, components, icon }
    if (type === 'assessment') {
      this._assessments[id] = plugin
    } else if (type === 'block') {
      this._blocks[id] = plugin
    } else if (type === 'organization') {
      this._organization[id] = plugin
    } else {
      throw new Error(`Unknown plugin type: ${type}`)
    }

    if (components.edit) {
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
            li: $laya.li,
            assessments: $laya.assessments,
            blocks: $laya.blocks,
            organization: $laya.organization
          }
        }
      }
    })
  }
}

/**
 * Filename: laya.ts
 * Use: make all content blocks available as global mixin
 * Creator: core
 * Since: v1.0.0
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
  private readonly _assessments: object;
  private readonly _blocks: object;
  private readonly _organization: object;

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
    this._assessments = {}
    this._blocks = {}
    this._organization = {}
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
  install (Vue: typeof _Vue): void {
    const $laya = new Laya(Vue)
    // @ts-ignore
    Vue.$laya = $laya // important to make $laya available to other plugins.
    Vue.prototype.$laya = $laya

    Vue.mixin({
      data (): object {
        return {
          $laya: {
            assessments: $laya.assessments,
            blocks: $laya.blocks,
            organization: $laya.organization
          }
        }
      }
    })
  }
}

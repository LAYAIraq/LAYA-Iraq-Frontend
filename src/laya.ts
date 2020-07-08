import _Vue from "vue";
import { VueConstructor } from "vue";



/** this class takes care of laya specific frontend (Vue) concerns
 *   i.e. it implements the $laya behaviour
 */

export class Laya {
  private _vue: typeof _Vue;
  private _lb: object;
  private _la: object;
  private _li: object; /* lookup for learn interactions to block/assessment */

  public get lb() {
    return this._lb;
  }

  public get la() {
    return this._la;
  }

  constructor(v: typeof _Vue) {
    this._vue = v;
    this._lb = {};
    this._la = {};
    this._li = {};
  }

  public lookupType(type: string): object {
    return this._li[type];
  }

  public registerLB<VC1, VC2, VC3 extends VueConstructor>(
    id: string,
    type: string,
    i18n: object,
    components: { new?: VC1; edit?: VC2; view: VC3 },
  ): void {
    this._lb[id] = { id, type, i18n, components };
    this._li[type] = { type: "block", id };

    if ("new" in components) {
      this._vue.component(id, components.new);
    }

    if ("edit" in components) {
      this._vue.component(id, components.edit);
    }

    this._vue.component(id, components.view);
  }

  public registerLA<VC1, VC2, VC3 extends VueConstructor>(
    id: string,
    type: string,
    i18n: object,
    components: { new?: VC1; edit?: VC2; view: VC3 },
  ): void {
    this._la[id] = { id, type, i18n, components };
    this._li[type] = { type: "assessment", id };

    if ("new" in components) {
      this._vue.component(id, components.new);
    }

    if ("edit" in components) {
      this._vue.component(id, components.edit);
    }

    this._vue.component(id, components.view);
  }
}

export default {
  install(Vue: typeof _Vue, options?: any): void {
    const $laya = new Laya(Vue);
    //@ts-ignore
    Vue.$laya = $laya; // important to make $laya available to other plugins.
    Vue.prototype.$laya = $laya;

    Vue.mixin({
      data(): object {
        return {
          $laya: {
            lb: $laya.lb,
            la: $laya.la,
          },
        };
      },
    });
  },
};

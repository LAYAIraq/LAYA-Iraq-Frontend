import _Vue from "vue";

import _create from "./view.vue";
import _edit from "./edit.vue";
import _view from "./view.vue";

export default {
  install(Vue: typeof _Vue, options?: any): void {
    Vue.$laya.registerLB("laya-ableplayer", "BlockAbleplayer", {
      de: "Externes Video (über Ableplayer)",
    }, {
      new: _create,
      //@ts-ignore
      view: _view,
      edit: _edit,
    })
  },
};

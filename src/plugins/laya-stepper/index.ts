import _Vue from "vue";

import _create from "./view.vue";
import _edit from "./view.vue";
import _view from "./view.vue";

export default {
  install(Vue: typeof _Vue, options?: any): void {
    Vue.$laya.registerLB("laya-stepper", "BlockStepper", {
      de: "Stepper",
    }, {
      new: _create,
      view: _edit,
      edit: _view,
    });
  },
};

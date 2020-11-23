import _Vue from "vue";

import _create from "./edit.vue";
import _edit from "./edit.vue";
import _view from "./view.vue";
import i18n from "./i18n.js";

export default {
  install(Vue: typeof _Vue, options?: any): void {
    Vue.$laya.registerLB("laya-plyr", "BlockPlyr", i18n, {
      new: _create,
      //@ts-ignore
      view: _view,
      edit: _edit,
    });
  },
};

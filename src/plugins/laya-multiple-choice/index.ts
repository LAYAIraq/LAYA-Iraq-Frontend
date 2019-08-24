import _Vue from "vue";

import _create from "./edit.vue";
import _view from "./view.vue";
import _edit from "./edit.vue";

export default {
  install(Vue: typeof _Vue, options?: any): void {
    Vue.$laya.registerLA("laya-multiple-choice", "AssessmentScmc", {
      de: "Multiple Choice",
    }, {
      new: _create,
      view: _edit,
      edit: _view,
    });
  },
};

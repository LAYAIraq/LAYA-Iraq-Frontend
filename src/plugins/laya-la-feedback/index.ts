import _Vue from "vue";

import _create from "./view.vue";
import _edit from "./edit.vue";
import _view from "./view.vue";
import i18n from "./i18n.js";

export default {
  install(Vue: typeof _Vue, options?: any): void {
    Vue.$laya.registerLA("laya-course-feedback", "CourseFeedback", i18n, {
      new: _create,
      //@ts-ignore
      view: _view,
      edit: _edit,
    });
  },
};

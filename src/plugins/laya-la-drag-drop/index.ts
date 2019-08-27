import _Vue from "vue";

import _create from "./view.vue";
import _edit from "./edit.vue";
import _view from "./view.vue";

export default {
  install(Vue: typeof _Vue, options?: any): void {
    Vue.$laya.registerLA("laya-quiz-drag-drop", "AssessmentDragDrop", {
      de: "Drag & Drop",
    }, {
      new: _create,
      view: _view,
      edit: _edit,
    });
  },
};

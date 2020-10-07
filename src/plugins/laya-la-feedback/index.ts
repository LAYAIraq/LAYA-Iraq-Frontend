import _Vue from "vue";

import _create from "./view.vue";
import _edit from "./edit.vue";
import _view from "./view.vue";

export default {
  install(Vue: typeof _Vue, options?: any): void {
    Vue.$laya.registerLA("laya-course-feedback", "CourseFeedback", {
     de: {name: "Rückmeldung", caption: "Eine kurze Beschreibung des Lernbaustein."}, // --> de.js
     en: {name: "Feedback", caption: "..."} // --> en.js
     }, {
      new: _create,
      //@ts-ignore
      view: _view,
      edit: _edit,
    });
  },
};

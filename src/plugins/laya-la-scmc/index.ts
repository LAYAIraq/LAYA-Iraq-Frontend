import _Vue from "vue"

import _create from "./create.vue"
import _view from "./view.vue"
import _edit from "./edit.vue"
<<<<<<< HEAD
import i18n from "./i18n"
=======
import i18n from "./i18n.js"
>>>>>>> refactor-course-edit

export default {
  install(Vue: typeof _Vue, options?: any): void {
    Vue.$laya.registerLA("laya-scmc", "AssessmentScmc",
      i18n,
      {
        new: _create,
        //@ts-ignore
        view: _view,
        edit: _edit,
      },
    )
  }
}

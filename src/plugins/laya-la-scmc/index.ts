import _Vue from "vue";

import { LayaLASingleChoice, LayaLASingleChoiceAuthor } from "./components";

export default {
  install(Vue: typeof _Vue, options?: any): void {
    Vue.$laya.registerLA(
      "laya-la-scmc",
      "AssessmentScmc",
      { de: "Single Choice / Multiple Choice" },
      {
        new: LayaLASingleChoiceAuthor,
        view: LayaLASingleChoice,
        edit: LayaLASingleChoiceAuthor,
      },
    );
  },
};

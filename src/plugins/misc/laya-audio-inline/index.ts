import _Vue from "vue";

import _view from "./view.vue";

export default {
  install(Vue: typeof _Vue, options?: any): void {
    Vue.component(_view.name, _view)
  },
};

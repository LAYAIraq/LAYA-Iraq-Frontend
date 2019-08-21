import Vue from "vue"
import App from "./App.vue"
import router from "./router"
import store from "./store"
import "./registerServiceWorker"

/* set backend address */
import backendUrl from "./backend-url"
import httpClient from "axios"
httpClient.defaults.baseURL = backendUrl

/* bootstrap */
import BootstrapVue from "bootstrap-vue"
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap-vue/dist/bootstrap-vue.css"
Vue.use(BootstrapVue);

/* Laya Interface */
import Laya from "./laya";
Vue.use(Laya);

/** LAYA core plugins */
import * as plugins from "@/plugins"
Object.values(plugins).map(plugin => Vue.use(plugin))

/* icons */
import "@fortawesome/fontawesome-free/css/all.css"

/* storage */
import Storage from "vue-ls"
Vue.use(Storage, { name: "ls", namespace: "vuejs__", storage: "local" });

Vue.config.productionTip = false;

/* wayin kickoff even speciale */
import LayaPlyrVimeo from "@/components/laya-plyr-vimeo"
import LayaTimedMsg from "@/components/laya-timed-message"
Vue.component("laya-plyr-vimeo", LayaPlyrVimeo)
Vue.component("laya-timed-msg", LayaTimedMsg)

new Vue({
  store,
  router,
  render: (h) => h(App),
}).$mount("#app");

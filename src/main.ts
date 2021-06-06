/**
 * Filename: main.ts
 * Use: packs all components of LAYA together
 * Creator: core
 * Date:unknown
 * Dependencies: see import statements
 */

import Vue from 'vue'
import App from './App.vue'
import router from './router.js'
import store from './store'
import './registerServiceWorker'

/* set backend address */
import backendUrl from './backend-url'
import httpClient from 'axios'
httpClient.defaults.baseURL = backendUrl

/* bootstrap */
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
Vue.use(BootstrapVue);

/* Laya Interface */
import Laya from './laya';
Vue.use(Laya);

/** LAYA core plugins */
import * as plugins from '@/plugins'
Object.values(plugins).map(plugin => Vue.use(plugin))

/* icons */
import '@fortawesome/fontawesome-free/css/all.css'

/* storage */
import Storage from 'vue-ls'
Vue.use(Storage, { name: 'ls', namespace: 'vuejs__', storage: 'local' });

Vue.config.productionTip = false;


new Vue({
  store,
  //@ts-ignore
  router,
  render: (h) => h(App),
}).$mount('#app');

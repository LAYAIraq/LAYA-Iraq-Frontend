/* eslint-disable import/first */
/**
 * Filename: main.ts
 * Use: packs all components of LAYA together
 * Creator: core
 * Since: v1.0.0
 */

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'

/* set backend address */
import backendUrl from './backend-url'
import httpClient from 'axios'
httpClient.defaults.baseURL = backendUrl

/* bootstrap */
import { BootstrapVue } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
Vue.use(BootstrapVue)

/* authenticated images */
import VueAuthImg from 'vue-auth-image'
Vue.use(VueAuthImg)

/* Laya Interface */
import Laya from './laya'
Vue.use(Laya)

/** LAYA core plugins */
import * as plugins from '@/plugins'
Object.values(plugins).map(plugin => Vue.use(plugin))

/* icons */
import '@fortawesome/fontawesome-free/css/all.css'

/* storage */
import Storage from 'vue-ls'
Vue.use(Storage, { name: 'ls', namespace: 'vuejs__', storage: 'local' })
Vue.config.productionTip = process.env.NODE_ENV === 'development'

new Vue({
  store,
  router,
  render: (h) => h(App)
}).$mount('#app')

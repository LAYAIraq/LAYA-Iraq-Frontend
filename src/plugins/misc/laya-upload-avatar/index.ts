import _Vue from 'vue'
import _view from './avatar.vue'

export default {
    install(Vue: typeof _Vue, options?: any): void {
        Vue.component(_view.name, _view)
    }
}


import { createLocalVue, mount, shallowMount } from '@vue/test-utils'
import Vuex from 'vuex'
// import { BootstrapVue } from 'bootstrap-vue' // uncomment if component uses Bootstrap
import 'regenerator-runtime/runtime' // for async behavior in tests

const localVue = createLocalVue()
localVue.use(Vuex)
// localVue.use(BootstrapVue) // uncomment if component uses bootstrap

describe('${NAME}', () => {
  let wrapper
  let getters
  beforeEach(() => {
    getters = {
      profileLang: () => 'en',
    }
    const store = new Vuex.Store({
      getters
    })
    // @ts-ignore
    wrapper = shallowMount(Component, { // use mount if component uses bootstrap
      store,
      // stubs: ['router-link'], // uncomment if component has router links
      localVue
    })
  })
})

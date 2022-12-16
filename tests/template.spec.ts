import 'regenerator-runtime/runtime' /// used for implementing async behavior, e.g. pressing buttons or input
import {
  createLocalVue,
  // mount, // uncomment this line to use mount (necessary when component uses bootstrap-vue)
  shallowMount
} from '@vue/test-utils' // minimal setup
import Component from '@/path-to-component.vue' // import the component
import Vuex from 'vuex' // vuex is always imported for i18n
// import { BootstrapVue } from 'bootstrap-vue' // uncomment this line to use bootstrap-vue

const localVue = createLocalVue() // setting up local vue instance
localVue.use(Vuex) // always needed for i18n
// localVue.use(BootstrapVue) // uncomment this line to use bootstrap-vue

describe('Component', () => {
  let getters // mock vuex getters, always needed for i18n
  // let actions // mock vuex actions
  // let mutations // mock vuex mutations
  // let state // mock vuex state, needed if component manipulates state
  let wrapper // test wrapper

  beforeEach(() => {
    getters = {
      profileLang: () => 'en' // necessary in every component for rendering, english as testing locale
      // more mock getters here
    }
    // mock actions, mutations, state here
    // actions = { }
    // mutations = { }
    // state = { }
    const store = new Vuex.Store({ // mock store for local Vue instance
      // mutations,
      // actions,
      // state,
      getters
    })
    wrapper = shallowMount( // use mount if component uses bootstrap-vue
      Component, {
        // mocks: { // mocks global objects, needed when component uses router or $laya
        //   $router: { // mock for Vue router
        //     push: jest.fn()
        //   }
        // },
        store,
        localVue
      }
    )
  })

  it('renders', () => {
    expect(wrapper.exists()).toBe(true)
  })

  // test cases go here
})

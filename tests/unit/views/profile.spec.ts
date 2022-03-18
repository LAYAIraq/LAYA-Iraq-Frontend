import { createLocalVue, shallowMount } from '@vue/test-utils'
import ProfileView from '@/views/profile.vue'
import Vuex from 'vuex'
import 'regenerator-runtime/runtime'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('profile view', () => {
  let mutations
  let actions
  let wrapper
  let vm
  beforeEach(() => {
    const getters = {
      profileLang: () => 'en',
      passwordRepeat: () => 'secret12',
      passwordSet: () => 'secret12'
    }
    const state = {
      avatar: '',
      email: 'admin@laya',
      lang: 'en',
      prefs: {
        media: {
          audio: true,
          simple: true,
          text: true,
          video: true
        },
        font:{
          chosen: 'standard',
          size: 18
        }
      },
      username: 'admin',
      realm: null,
      emailVerified: false,
      id: 1
    }

    mutations = {
      setPrefs: jest.fn((prefs) => {
        state.prefs = prefs
      })
    }

    actions = {
      saveProfile: jest.fn(),
      changePassword: jest.fn()
    }
    const store = new Vuex.Store({
      getters,
      modules: {
        profile: {
          state,
          mutations,
          actions
        }
      }
    })

    wrapper = shallowMount(ProfileView, {
      computed: {
        passwordOk () {
          return true
        }
      },
      mocks: {
        $bvToast: {
          show: jest.fn()
        }
      },
      store,
      stubs: [
        'b-toast',
        'password-input'
      ]
    })
    vm = wrapper.vm as any
  })

  it('', () => {

  })
})

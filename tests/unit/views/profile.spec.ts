import { createLocalVue, shallowMount } from '@vue/test-utils'
import ProfileView from '@/views/profile.vue'
import Vuex from 'vuex'
import { BootstrapVue } from 'bootstrap-vue'
import 'regenerator-runtime/runtime'

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(BootstrapVue)

describe('profile view', () => {
  let mutations
  let state
  let actions
  let wrapper
  let vm
  beforeEach(() => {
    const getters = {
      profileLang: () => 'en',
      passwordRepeat: () => '',
      passwordSet: () => 'secret12'
    }
    state = {
      avatar: 'mypic.png',
      email: 'admin@laya',
      lang: 'en',
      prefs: {},
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
          getters: {
            profile () {
              return state
            }
          },
          mutations,
          actions
        }
      }
    })

    wrapper = shallowMount(ProfileView, {
      data () {
        return {
          passwordOk: true
        }
      },
      localVue,
      store,
      stubs: [
        'password-input'
      ]
    })
    vm = wrapper.vm as any
  })

  it('saves media input as chosen', async () => {
    const mediaPrefChecks = wrapper.findAll('input')
    expect(mediaPrefChecks.length).toBe(7)
    let myAss = 0
    mediaPrefChecks.wrappers.forEach((wrapper) => {
      // console.log(wrapper)
      if (wrapper.attributes('type') === 'checkbox') {
        myAss++
        wrapper.setChecked(true)
      }
    })
    expect(myAss).toBe(4)
    await localVue.nextTick()
    expect(vm.prefs.media).toStrictEqual({
      text: true,
      video: true,
      audio: true,
      simple: true
    })
    const button = wrapper.find('button')
    await button.trigger('click')
    expect(mutations.setPrefs).toHaveBeenCalledWith(
      expect.objectContaining({ id: 1 }), expect.objectContaining({
        media: {
          text: true,
          video: true,
          audio: true,
          simple: true
        }
      }))
    const inputFields = wrapper.findAll('input').filter(elem => elem.attributes('type') === 'checkbox')
    inputFields.setChecked(false)
    await button.trigger('click')
    expect(mutations.setPrefs).toHaveBeenLastCalledWith(
      expect.objectContaining({ id: 1 }), expect.objectContaining({
        media: {
          text: false,
          video: false,
          audio: false,
          simple: false
        }
      }))
    inputFields.at(1).setChecked(true)
    inputFields.at(3).setChecked(true)
    await button.trigger('click')
    expect(mutations.setPrefs).toHaveBeenLastCalledWith(
      expect.objectContaining({ id: 1 }), expect.objectContaining({
        media: {
          text: false,
          video: false,
          audio: true,
          simple: true
        }
      }))
    expect(actions.saveProfile).toHaveBeenCalled()
    expect(actions.changePassword).toHaveBeenCalled()
    // expect(actions.saveProfile).toHaveBeenCalledTimes(3)
  })

  it('disables button when password input wrong', async () => {
    const button = wrapper.find('button')
    expect(button.attributes('disabled')).toBeUndefined()
    vm.passwordOk = false
    await vm.$nextTick()
    expect(button.attributes('disabled')).toBeDefined()
  })

  it('calls store methods on destroy', () => {
    wrapper.destroy()
    expect(actions.saveProfile).toHaveBeenCalled()
    expect(mutations.setPrefs).toHaveBeenCalled()
  })
})

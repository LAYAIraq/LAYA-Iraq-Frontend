import { createLocalVue, mount, shallowMount } from '@vue/test-utils'
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
  let getters
  let actions
  let wrapper
  let vm
  let store
  beforeEach(() => {
    getters = {
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
    store = new Vuex.Store({
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

    wrapper = mount(ProfileView, {
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
    expect(mediaPrefChecks.length).toBe(10)
    mediaPrefChecks.wrappers.forEach((wrapper) => {
      // console.log(wrapper)
      if (wrapper.attributes('type') === 'checkbox') {
        wrapper.setChecked(true)
      }
    })
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

  it('sets correct size when range is set', async () => {
    const fontSelector = wrapper.find('.custom-range')
    // expect(fontSelector.exists()).toBeTruthy()
    // fontSelector = fontSelector.wrappers.filter(wrapper => wrapper.attributes('type') === 'range')
    expect(fontSelector.exists()).toBeTruthy()
    await fontSelector.setValue(1)
    await localVue.nextTick()
    expect(wrapper.vm.chosenSize).toBe(4)
  })

  it('shows toast when password is saved', async () => {
    actions.changePassword = jest.fn(() => Promise.resolve())
    getters.passwordRepeat = () => 'secret12'
    store = new Vuex.Store({
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
      store,
      localVue,
      stubs: [
        'password-input'
      ]
    })
    await wrapper.setData({ passwordOk: true })
    const button = wrapper.find('button')
    await button.trigger('click')
    expect(actions.changePassword).toHaveBeenCalled()
    expect(wrapper.find('#submit-ok').exists()).toBeTruthy()
  })

  it('shows toast when password saving failed', async () => {
    actions.changePassword = jest.fn(() => Promise.reject(new Error('fail')))
    getters.passwordRepeat = () => 'secret12' // TODO: reduce duplication
    store = new Vuex.Store({
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
      store,
      localVue,
      stubs: [
        'password-input'
      ]
    })
    await wrapper.setData({ passwordOk: true })
    const button = wrapper.find('button')
    await button.trigger('click')
    expect(actions.changePassword).toHaveBeenCalled()
    expect(wrapper.find('#submit-failed').exists()).toBeTruthy()
    // expoect
  })
})

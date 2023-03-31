import { createLocalVue, mount } from '@vue/test-utils'
import Login from '@/components/general/login.vue'
import Vuex from 'vuex'
import { BootstrapVue } from 'bootstrap-vue'
import 'regenerator-runtime/runtime'

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(BootstrapVue)

describe('login component', () => {
  let getters
  let actions
  let mutations
  let wrapper
  let vm
  let emailInput
  let pwdInput
  let sendButton
  let logSpy
  beforeEach(() => {
    console.log = jest.fn()
    getters = {
      profileLang: () => 'en'
    }
    actions = {
      sendCredentials: jest.fn(),
      fetchProfile: jest.fn(),
      fetchRole: jest.fn()
    }
    mutations = {
      login: jest.fn()
    }
    const store = new Vuex.Store({
      getters,
      mutations,
      actions
    })
    const router = {
      replace: jest.fn()
    }
    wrapper = mount(
      Login, {
        store,
        stubs: [
          'router-link'
        ],
        mocks: {
          $router: router,
          $ls: {
            get: jest.fn(),
            set: jest.fn()
          },
          $route: {
            params: {
              verified: false
            }
          },
          i18n: {
            'login.errMsg': 'login error'
          }
        },
        localVue
      }
    )
    vm = wrapper.vm as any
    emailInput = wrapper.find('#email-input')
    pwdInput = wrapper.find('#pwd-input')
    sendButton = wrapper.find('#login-button')
    logSpy = jest.spyOn(console, 'log')
  })

  it('has input fields and button', () => {
    expect(emailInput).toBeDefined()
    expect(pwdInput).toBeDefined()
    expect(sendButton).toBeDefined()
  })

  it('doesn\'t send anything when clicking with no email set', () => {
    // const logSpy = jest.spyOn(console, 'log')
    pwdInput.setValue('yomama')
    sendButton.trigger('click')
    expect(mutations.login).toHaveBeenCalledTimes(0)
    expect(actions.fetchProfile).toHaveBeenCalledTimes(0)
    expect(actions.fetchRole).toHaveBeenCalledTimes(0)
    expect(logSpy).toHaveBeenCalledWith('Not Submitting')
  })

  it('doesn\'t send anything when clicking with no password set', () => {
    // const logSpy = jest.spyOn(console, 'log')
    emailInput.setValue('test@account')
    sendButton.trigger('click')
    expect(mutations.login).toHaveBeenCalledTimes(0)
    expect(actions.fetchProfile).toHaveBeenCalledTimes(0)
    expect(actions.fetchRole).toHaveBeenCalledTimes(0)
    expect(logSpy).toHaveBeenCalledWith('Not Submitting')
  })

  it('sends http request when both things are filled out', async () => {
    emailInput.setValue('name@domain')
    pwdInput.setValue('secret')
    sendButton.trigger('click')
    expect(logSpy).toHaveBeenCalledWith('Submitting...')
  })

  it('calls store', () => {
    const myResp = { id: 1, userId: 'KEKW', created: Date.now() }
    actions.sendCredentials.mockResolvedValue(myResp)
    emailInput.setValue('name@domain')
    pwdInput.setValue('secret')
    sendButton.trigger('click')
    expect(actions.sendCredentials).toHaveBeenCalledWith(
      expect.objectContaining({
        getters: {
          profileLang: 'en'
        }
      }),
      expect.objectContaining({
        email: 'name@domain',
        password: 'secret'
      })
    )
  })

  it('shows link when submit failed', () => {
    vm.submitFailed = true
    // actions.sendCredentials.mockRejectedValue(new Error('error!'))
    // emailInput.setValue('name@domain')
    // pwdInput.setValue('secret')
    // sendButton.trigger('click')
    const newLink = wrapper.find('#forgotten-password')
    expect(newLink).toBeDefined()
  })
})

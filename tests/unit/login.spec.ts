import { createLocalVue, shallowMount } from '@vue/test-utils'
import Login from '@/views/login.vue'
import Vuex from 'vuex'
import Storage from 'vue-ls'
const localVue = createLocalVue()
localVue.use(Vuex)
// localVue.use(Storage, { name: 'ls', namespace: 'vuejs__', storage: 'local' })

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
  let http
  beforeEach(() => {

    getters = {
      profileLang: () => 'en'
    }
    actions = {
      sendCredentials: () => {
        return Promise.resolve('true')
      },
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
    http = {
      post: jest.fn()
    }
    wrapper = shallowMount(
      Login, {
        store,
        stubs: [
          'router-link'
        ],
        mocks: {
          $router: router,
          $ls: {
            get: () => jest.fn()
          },
          $route: {
            params: {
              verified: false
            }
          },
          http: http
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

  it('sends http request when both things are filled out', () => {
    const user = {
      email: 'name@domain',
      userId: 420
    }

    http.post.mockResolvedValueOnce(user)
    emailInput.setValue('name@domain')
    pwdInput.setValue('secret')
    sendButton.trigger('click')
    expect(http.post).toHaveBeenCalled()
  })

})

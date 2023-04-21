import { createLocalVue, mount } from '@vue/test-utils'
import Vuex from 'vuex'
import PasswordInput from '@/components/helpers/password-input.vue'
import 'regenerator-runtime/runtime'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('password input component', () => {
  let state
  let getters
  let mutations
  let wrapper
  let pwdInput
  let pwdRepeat
  beforeEach(() => {
    state = {
      password: '',
      passwordRepeat: ''
    }
    getters = {
      profileLanguage: () => 'en',
      password: () => state.password,
      passwordRepeat: () => state.passwordRepeat
    }
    mutations = {
      passwordSet (state, input) {
        state.password = input
      },
      passwordRepeatSet (state, input) {
        state.passwordRepeat = input
      }
    }
    const store = new Vuex.Store({
      getters,
      state,
      mutations
    })
    wrapper = mount(PasswordInput, {
      store,
      localVue
    })
    pwdInput = wrapper.find('.pwd-input').find('input')
    pwdRepeat = wrapper.find('#repeatPwd')
  })

  it('shows error message when passwords not identical', async () => {
    await pwdInput.setValue('secret12')
    await pwdRepeat.setValue('secret11')
    expect(wrapper.vm.pwdMatch).toBeFalsy()
    const diffErr = wrapper.find('#pwd-diff-msg')
    expect(diffErr?.text()).toBeTruthy()
  })

  it('shows no error when passwords match and have min length', async () => {
    await pwdRepeat.setValue('verystrongpassword')
    await pwdInput.setValue('verystrongpassword')
    const diffErr = wrapper.find('#pwd-diff-msg')
    expect(diffErr.element).toBeUndefined()
  })

  it('shows error when passwords are not long enough', async () => {
    await pwdRepeat.setValue('secret')
    await pwdInput.setValue('secret')
    const errors = wrapper.find('#errors')
    expect(errors.text()).toBe('Password is not long enough!')
  })

  it('warns when passwords are not strong', async () => {
    await pwdRepeat.setValue('abcacabcac')
    await pwdInput.setValue('abcacabcac')
    const errors = wrapper.find('#suggestions')
    expect(errors.text()).toBeTruthy()
  })
})

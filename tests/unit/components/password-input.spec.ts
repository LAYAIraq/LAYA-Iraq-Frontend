import { createLocalVue, mount } from '@vue/test-utils'
import Vuex from 'vuex'
import PasswordInput from '@/components/password-input.vue'
import Password from 'vue-password-strength-meter'
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
      passwordSet: '',
      passwordRepeat: ''
    }
    getters = {
      profileLang: () => 'en',
      passwordSet: () => state.passwordSet,
      passwordRepeat: () => state.passwordRepeat
    }
    mutations = {
      setPwd (state, input) {
        state.passwordSet = input
      },
      setPwdRepeat (state, input) {
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
    expect(diffErr).toBeDefined()
    expect(diffErr.text()).toBeTruthy()
  })

  it('shows no error when passwords match and have min length', async () => {
    await pwdInput.setValue('secret12')
    await pwdRepeat.setValue('secret12')
    const diffErr = wrapper.find('#pwd-diff-msg')
    expect(diffErr.element).toBeUndefined()
  })

  it('shows error when passwords are not long enough', async () => {
    await pwdInput.setValue('secret')
    await pwdRepeat.setValue('secret')
    const errors = wrapper.find('#errors')
    expect(errors.text()).toBeTruthy()
  })

  it('warns when passwords are not strong', async () => {
    const pwd = wrapper.findComponent(Password)
    // console.log(pwd)
    expect(pwd.exists).toBeTruthy()
    const emitSpy = jest.spyOn(pwd.vm, '$emit')
    const warningSetter = jest.spyOn(wrapper.vm, 'pwdHints')
    await pwdInput.setValue('password')
    await pwdRepeat.setValue('password')
    expect(emitSpy).toHaveBeenLastCalledWith('feedback', expect.objectContaining({
      suggestions: expect.any(Array),
      warning: expect.any(String)
    }))
    await localVue.nextTick()
    expect(warningSetter).toHaveBeenCalledWith(expect.objectContaining({
      suggestions: expect.any(Array),
      warning: expect.any(String)
    }))
    expect(wrapper.vm.warnings.length).toBeTruthy()
    const errors = wrapper.find('#pwd-suggestions')
    expect(errors.text()).toBeTruthy()
  })
})

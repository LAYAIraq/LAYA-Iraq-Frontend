import { createLocalVue, shallowMount } from '@vue/test-utils'
import Vuex from 'vuex'
import PasswordInput from '@/components/password-input.vue'
import 'regenerator-runtime/runtime'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('password input component', () => {
  let getters
  let mutations
  let wrapper
  let vm
  beforeEach(() => {
    getters = {
      profileLang: () => 'en'
    }
  })

  it('shows error message when passwords not identical', () => {
    getters = {
      ...getters,
      passwordSet: () => 'secret',
      passwordRepeat: () => 'ecret'
    }
    const store = new Vuex.Store({
      getters
    })
    wrapper = shallowMount(PasswordInput, {
      stubs: ['password'],
      store,
      localVue
    })
    vm = wrapper.vm as any
    expect(vm.pwdMatch).toBeFalsy()
    const errors = wrapper.find('#errors')
    expect(errors).toBeDefined()
    expect(errors.text()).toBeDefined()
  })

  it('sets passwordRepeat to input', async () => {
    getters = {
      ...getters,
      passwordSet: () => 'secret',
      passwordRepeat: () => 'ecret'
    }
    mutations = {
      setPwdRepeat: jest.fn()
    }
    const store = new Vuex.Store({
      getters,
      mutations
    })
    wrapper = shallowMount(PasswordInput, {
      stubs: ['password'],
      store,
      localVue
    })
    const pwdRepeat = wrapper.find('#repeatPwd')
    await pwdRepeat.setValue('secret')
    expect(mutations.setPwdRepeat).toHaveBeenCalledWith({}, 'secret')
  })

  it('sets state correctly when passwords match and have min length', () => {
    getters = {
      ...getters,
      passwordSet: () => 'secret12',
      passwordRepeat: () => 'secret12'
    }
    const store = new Vuex.Store({ getters })
    wrapper = shallowMount(PasswordInput, {
      store,
      stubs: ['password'],
      localVue
    })
    vm = wrapper.vm as any
    expect(vm.pwdMatch).toBeTruthy()
    expect(vm.pwdSecureLength).toBeTruthy()
  })
})

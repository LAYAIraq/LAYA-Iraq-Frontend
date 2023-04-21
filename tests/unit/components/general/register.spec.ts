import { createLocalVue, shallowMount } from '@vue/test-utils'
import Vuex from 'vuex'
import RegisterView from '@/components/general/register.vue'
import 'regenerator-runtime/runtime'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('register component', () => {
  const getters = {
    profileLanguage: () => 'en',
    passwordRepeat: () => 'secret'
  }
  const actions = {
    checkEmailTaken: jest.fn(() => Promise.reject(new Error('404'))),
    checkNameTaken: jest.fn(() => Promise.resolve(false)),
    registerUser: jest.fn(() => Promise.resolve)
  }
  let wrapper
  let vm
  let nameInput
  let nameError
  let emailInput
  let emailError
  let store
  beforeEach(() => {
    store = new Vuex.Store({
      getters,
      actions
    })
    wrapper = shallowMount(RegisterView, {
      data () {
        return {
          passwordOk: true
        }
      },
      mocks: {
        $ls: {
          get: () => false
        },
        $router: {
          replace: () => jest.fn()
        }
      },
      store,
      stubs: [
        'password-input',
        'router-link'
      ],
      localVue
    })
    vm = wrapper.vm as any
    nameInput = wrapper.find('#name-input')
    emailInput = wrapper.find('#email-input')
    emailError = wrapper.find('#email-err')
  })

  it('no error when empty name but no input', () => {
    const nameEmptyError = wrapper.find('#name-empty-err')
    expect(nameEmptyError.exists()).toBeFalsy()
  })

  it('error when empty name but input has started', async () => {
    await nameInput.setValue('someName')
    await nameInput.setValue('')
    const nameEmptyError = wrapper.find('#name-empty-err')
    expect(nameEmptyError.exists()).toBeTruthy()
  })

  it('error when name has space', async () => {
    await nameInput.setValue('some name')
    nameError = wrapper.find('#name-err')
    expect(nameError.exists()).toBeTruthy()
    await nameInput.setValue('some\tname')
    nameError = wrapper.find('#name-err')
    expect(nameError.exists()).toBeTruthy()
  })

  it('error when name has other than numbers and digits', async () => {
    await nameInput.setValue('?!jhasdb')
    nameError = wrapper.find('#name-err')
    expect(nameError.exists()).toBeTruthy()
  })

  it('error when non-utf8 signs', async () => {
    await nameInput.setValue('こんばんは')
    nameError = wrapper.find('#name-err')
    expect(nameError.exists()).toBeTruthy()
  })

  it('error when emoji input', async () => {
    await nameInput.setValue('💭❤💞💯📘🎹⚽🍊😅🎃😻👢☂🌸⛄⭐🙈🍍☕🚚🏰👣')
    nameError = wrapper.find('#name-err')
    expect(nameError.exists()).toBeTruthy()
  })

  it('no error message when name has only letters', async () => {
    await nameInput.setValue('SomeName')
    nameError = wrapper.find('#name-err')
    expect(nameError.exists()).toBeFalsy()
    await nameInput.setValue('somename')
    expect(nameError.exists()).toBeFalsy()
  })

  it('no error when name has only digits', async () => {
    await nameInput.setValue('1234567890')
    nameError = wrapper.find('#name-err')
    expect(nameError.exists()).toBeFalsy()
  })

  it('no error when name has digits and characters combined', async () => {
    await nameInput.setValue('50m3n4m3')
    nameError = wrapper.find('#name-err')
    expect(nameError.exists()).toBeFalsy()
    await nameInput.setValue('bms1234567890sdv')
    expect(nameError.exists()).toBeFalsy()
  })

  it('error when wrong email address', async () => {
    await emailInput.setValue('abs')
    emailError = wrapper.find('#email-err')
    expect(emailError.exists()).toBeTruthy()
    await emailInput.setValue('abs.de')
    emailError = wrapper.find('#email-err')
    expect(emailError.exists()).toBeTruthy()
    // following are omitted b/c allowed
    // await emailInput.setValue('abs@a')
    // expect(emailError.attributes('style')).toBe('')
    // await emailInput.setValue('abs@asdb.')
    // expect(emailError.attributes('style')).toBe('')
  })
  it('no error when correct email', async () => {
    await emailInput.setValue('abs@example.com')
    emailError = wrapper.find('#email-err')
    expect(emailError.exists()).toBeFalsy()
    await emailInput.setValue('some-name@example.com')
    emailError = wrapper.find('#email-err')
    expect(emailError.exists()).toBeFalsy()
    await emailInput.setValue('some.name@example.com')
    emailError = wrapper.find('#email-err')
    expect(emailError.exists()).toBeFalsy()
    await emailInput.setValue('abs@complicated-example.com')
    emailError = wrapper.find('#email-err')
    expect(emailError.exists()).toBeFalsy()
    await emailInput.setValue('abs@subdomain.example.com')
    emailError = wrapper.find('#email-err')
    expect(emailError.exists()).toBeFalsy()
  })

  it('shows button when input is filled correctly', async () => {
    await nameInput.setValue('correctName')
    await emailInput.setValue('correct@example.com')
    const sendButton = wrapper.find('button')
    expect(sendButton).toBeDefined()
    expect(sendButton.attributes('disabled')).toBeUndefined()
  })

  it('doesn\'t show button with wrong name', async () => {
    await nameInput.setValue('wrong Name')
    await emailInput.setValue('correct@example.com')
    const sendButton = wrapper.find('button')
    expect(sendButton).toBeDefined()
    expect(sendButton.attributes('disabled')).toBe('disabled')
  })

  it('doesn\'t show button with wrong email', async () => {
    await nameInput.setValue('CorrectName')
    await emailInput.setValue('wrongexample.com')
    const sendButton = wrapper.find('button')
    expect(sendButton).toBeDefined()
    expect(sendButton.attributes('disabled')).toBe('disabled')
  })

  it('fires register request when button is clicked', async () => {
    // wrapper.vm.passwordOk = true
    await nameInput.trigger('blur')
    await nameInput.setValue('CorrectName')
    await nameInput.trigger('blur')
    await localVue.nextTick()
    expect(actions.checkNameTaken).toHaveBeenCalled()
    await emailInput.trigger('blur')
    await emailInput.setValue('correct@email.com')
    await emailInput.trigger('blur')
    expect(actions.checkEmailTaken).toHaveBeenCalled()
    const sendButton = wrapper.find('button')
    await sendButton.trigger('click')
    expect(actions.registerUser).toHaveBeenCalled()
  })

  it('catches rejects of store promises', async () => {
    console.error = jest.fn()
    const tmpGetters = {
      profileLanguage: () => 'en',
      passwordRepeat: () => 'a',
      passwordSet: () => 'a'
    }
    const tmpActions = {
      checkEmailTaken: jest.fn(() => Promise.resolve),
      checkNameTaken: jest.fn(() => Promise.reject(new Error('false'))),
      registerUser: jest.fn(() => Promise.reject(new Error('false')))
    }
    store = new Vuex.Store({
      getters: tmpGetters,
      actions: tmpActions
    })
    wrapper = shallowMount(
      RegisterView, {
        mocks: {
          $ls: {
            get: () => jest.fn()
          },
          $router: {
            replace: () => jest.fn()
          }
        },
        store,
        stubs: ['router-link'],
        localVue
      }
    )
    await nameInput.setValue('CorrectName')
    await nameInput.trigger('blur')
    await emailInput.setValue('correct@email.com')
    await emailInput.trigger('blur')
    const button = wrapper.find('button')
    await button.trigger('click')
    // wrapper.vm.passwordOk = true
    wrapper.vm.submit()
    wrapper.vm.passwordOk = true
    wrapper.vm.submit()
    expect(tmpActions.registerUser).toHaveBeenCalled()
  })

  it('has form error correct', async () => {
    const tmpGetters = {
      profileLanguage: () => 'en',
      passwordRepeat: () => '',
      passwordSet: () => ''
    }
    store = new Vuex.Store({
      getters: tmpGetters,
      actions
    })
    wrapper = shallowMount(
      RegisterView, {
        mocks: {
          $ls: {
            get: () => jest.fn()
          },
          $router: {
            replace: () => jest.fn()
          }
        },
        store,
        stubs: ['router-link'],
        localVue
      }
    )
    const button = wrapper.find('button')
    expect(button.attributes('disabled')).toBeTruthy()
  })

  it('redirects logged users', () => {
    wrapper = shallowMount(
      RegisterView, {
        mocks: {
          $ls: {
            get: () => true
          },
          $router: {
            replace: jest.fn()
          }
        },
        store,
        stubs: ['router-link'],
        localVue
      }
    )
    expect(wrapper.vm.$router.replace).toHaveBeenCalled()
  })
})

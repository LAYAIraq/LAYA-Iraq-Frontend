import { createLocalVue, shallowMount } from '@vue/test-utils'
import Vuex from 'vuex'
import RegisterView from '@/views/register.vue'
import 'regenerator-runtime/runtime'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('register component', () => {
  const getters = {
    profileLang: () => 'en',
    passwordRepeat: () => 'secret',
    passwordSet: () => 'secret12'
  }
  let wrapper
  let vm
  let nameInput
  let nameError
  let emailInput
  let emailError
  beforeEach(() => {
    const store = new Vuex.Store({ getters })
    wrapper = shallowMount(RegisterView, {
      data () {
        return {
          passwordOk: true
        }
      },
      mocks: {
        $ls: {
          get: () => jest.fn()
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
    nameError = wrapper.find('#name-err')
    emailInput = wrapper.find('#email-input')
    emailError = wrapper.find('#email-err')
  })

  it('error when name has space', async () => {
    await nameInput.setValue('some name')
    expect(nameError.attributes('style')).toBe('')
    await nameInput.setValue('some\tname')
    expect(nameError.attributes('style')).toBe('')
  })

  it('error when name has other than numbers and digits', async () => {
    await nameInput.setValue('?!jhasdb')
    expect(nameError.attributes('style')).toBe('')
    await nameInput.setValue('()')
    expect(nameError.attributes('style')).toBe('')
    await nameInput.setValue('exMarxTheSpot!')
    expect(nameError.attributes('style')).toBe('')
    await nameInput.setValue('こんばんは')
    expect(nameError.attributes('style')).toBe('')
    await nameInput.setValue('💭❤💞💯📘🎹⚽🍊😅🎃😻👢☂🌸⛄⭐🙈🍍☕🚚🏰👣')
    expect(nameError.attributes('style')).toBe('')
  })

  it('no error message when name has only letters', async () => {
    await nameInput.setValue('SomeName')
    expect(nameError.attributes('style')).toBe('display: none;')
    await nameInput.setValue('somename')
    expect(nameError.attributes('style')).toBe('display: none;')
  })

  it('no error when name has digits', async () => {
    await nameInput.setValue('50343')
    expect(nameError.attributes('style')).toBe('display: none;')
    await nameInput.setValue('1234567890')
    expect(nameError.attributes('style')).toBe('display: none;')
  })

  it('no error when name has digits and characters combined', async () => {
    await nameInput.setValue('50m3n4m3')
    expect(nameError.attributes('style')).toBe('display: none;')
    await nameInput.setValue('bms1234567890sdv')
    expect(nameError.attributes('style')).toBe('display: none;')
  })

  it('error when wrong email address', async () => {
    await emailInput.setValue('abs')
    expect(emailError.attributes('style')).toBe('')
    await emailInput.setValue('abs.de')
    expect(emailError.attributes('style')).toBe('')
    // following are omitted b/c allowed
    // await emailInput.setValue('abs@a')
    // expect(emailError.attributes('style')).toBe('')
    // await emailInput.setValue('abs@asdb.')
    // expect(emailError.attributes('style')).toBe('')
  })
  it('no error when correct email', async () => {
    await emailInput.setValue('abs@example.com')
    expect(emailError.attributes('style')).toBe('display: none;')
    await emailInput.setValue('some-name@example.com')
    expect(emailError.attributes('style')).toBe('display: none;')
    await emailInput.setValue('some.name@example.com')
    expect(emailError.attributes('style')).toBe('display: none;')
    await emailInput.setValue('abs@complicated-example.com')
    expect(emailError.attributes('style')).toBe('display: none;')
    await emailInput.setValue('abs@subdomain.example.com')
    expect(emailError.attributes('style')).toBe('display: none;')
  })

  it('shows button when input is filled correctly', async () => {
    await nameInput.setValue('correctName')
    await emailInput.setValue('correct@example.com')
    const sendButton = wrapper.find('button')
    expect(sendButton).toBeDefined()
  })

  it('doesn\'t show button with wrong name', async () => {
    await nameInput.setValue('wrong Name')
    await emailInput.setValue('correct@example.com')
    const sendButton = wrapper.find('button')
    expect(sendButton.exists()).toBeFalsy()
  })

  it('doesn\'t show button with wrong email', async () => {
    await nameInput.setValue('CorrectName')
    await emailInput.setValue('wrongexample.com')
    const sendButton = wrapper.find('button')
    expect(sendButton.exists()).toBeFalsy()
  })
})

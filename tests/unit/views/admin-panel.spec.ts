import 'regenerator-runtime/runtime'
import {
  createLocalVue,
  mount
} from '@vue/test-utils'
import AdminPanel from '@/views/admin-panel.vue'
import Vuex from 'vuex'
import { BootstrapVue } from 'bootstrap-vue'

const localVue = createLocalVue() // setting up local vue instance
localVue.use(Vuex)
localVue.use(BootstrapVue)

describe('Admin Panel', () => {
  let getters
  let actions
  // let mutations
  let state
  let wrapper
  let consoleWarn

  beforeAll(() => {
    consoleWarn = console.warn // mute console warnings (tooltips produce them here)
    console.warn = jest.fn()
  })
  beforeEach(() => {
    getters = {
      profileLang: () => 'en', // necessary in every component for rendering
      isAdmin: () => true, // necessary for rendering
      userId: () => 1, // necessary for rendering,
      users: () => state.users
    }
    // mock actions, mutations, state here
    actions = {
      changeEmail: jest.fn(),
      changeRole: jest.fn(),
      createUser: jest.fn(() => Promise.resolve()),
      deleteUser: jest.fn(),
      fetchUserList: jest.fn(),
      resetUserPassword: jest.fn()
    }
    // mutations = { }
    state = {
      users: [ // mock user list, editable for paging test
        { id: 1, username: 'admin', email: 'admin@laya', emailVerified: true, role: 'admin' },
        { id: 2, username: 'testAuthor', email: 'user@laya', emailVerified: true, role: 'author' },
        { id: 3, username: 'testEditor', email: 'user2@laya', emailVerified: true, role: 'editor' },
        { id: 4, username: 'testStudent1', email: 'user3@laya', emailVerified: true, role: 'student' },
        { id: 5, username: 'testStudent2', email: 'user4@laya', emailVerified: true, role: 'student' }
      ]
    }
    const store = new Vuex.Store({ // mock store for local Vue instance
      // mutations,
      actions,
      // state,
      getters
    })
    wrapper = mount( // use mount if component uses bootstrap-vue
      AdminPanel, {
        mocks: { // mocks global objects, needed when component uses router or $laya
          $router: { // mock for Vue router
            push: jest.fn()
          }
        },
        store,
        localVue
      }
    )
  })

  afterAll(() => {
    console.warn = consoleWarn
  })

  describe('user list', () => {
    it('shows correct number of users', () => {
      expect(wrapper.findAll('.user-list-item').length).toBe(5)
    })
    describe('user list filtering', () => {

    })

    describe('paging', () => {

    })
  })

  describe('user management buttons', () => {
    describe('create user button', () => {

    })
    describe('reset password button', () => {

    })
    describe('delete user button', () => {

    })
    describe('promote user button', () => {

    })
    describe('edit email button', () => {

    })
  })
})

import { createLocalVue, mount } from '@vue/test-utils'
import Header from '@/components/general/header.vue'
import BootstrapVue from 'bootstrap-vue'
import Vuex from 'vuex'
import 'regenerator-runtime/runtime'

const localVue = createLocalVue()
localVue.use(BootstrapVue)
localVue.use(Vuex)

describe('Header unauthorized', () => {
  let wrapper
  beforeEach(() => {
    const getters = {
      profileLanguage: () => 'en',
      userOnline: () => false
    }
    const store = new Vuex.Store({
      getters,
      mutations: {
        logout: jest.fn(),
        setLang: jest.fn()
      }
    })
    wrapper = mount(Header, {
      store,
      localVue
    })
  })

  it('has 4 links', async () => {
    const links = wrapper.findAll('a')
    expect(links.length).toBe(4)
  })
})

describe('Header authorized', () => {
  let wrapper
  let mutations
  let actions
  let state
  beforeEach(() => {
    state = {
      admin: false,
      editor: false
    }
    const getters = {
      isAdmin: () => state.admin,
      isEditor: () => state.editor,
      notifications: () => [],
      notificationsUnreadNumber: () => 0,
      profileLanguage: () => 'en',
      unreadMessages: () => 0,
      userOnline: () => true
    }
    mutations = {
      logout: jest.fn(),
      languageSet: jest.fn(),
      roleSet: jest.fn()
    }
    actions = {
      setUserLang: jest.fn(),
      notificationsFetchInitial: jest.fn(),
      notificationsFetchNew: jest.fn()
    }
    const store = new Vuex.Store({
      state,
      actions,
      getters,
      mutations
    })
    wrapper = mount(Header, {
      mocks: {
        $ls: {
          remove: jest.fn()
        },
        $router: {
          push: jest.fn()
        }
      },
      store,
      stubs: ['ly-header-notifications', 'router-link'],
      localVue
    })
  })

  it('has 8 links', async () => {
    const links = wrapper.findAll('a')
    expect(links.length).toBe(8)
  })

  it('triggers logout and redirects when clicked', async () => {
    const logoutAnchor = wrapper.findAll('a').wrappers[6] // logout is second to last
    expect(logoutAnchor.text()).toBe('Logout')
    await logoutAnchor.trigger('click')
    expect(wrapper.vm.$ls.remove).toHaveBeenCalled()
    expect(wrapper.vm.$router.push).toHaveBeenCalledWith('/login')
    expect(mutations.logout).toHaveBeenCalled()
  })

  it('fires changes language request', async () => {
    const langButtons = wrapper.find('.dropdown-menu').findAll('button')
    expect(langButtons.length).toBeGreaterThanOrEqual(1)
    await langButtons.wrappers.forEach(wrapper => wrapper.trigger('click'))
    await localVue.nextTick()
    expect(mutations.languageSet).toHaveBeenCalledWith(expect.any(Object), 'en')
    // expect(actions.profileUpdateLanguage).toHaveBeenCalled()
  })

  it('for admin shows link to admin panel', async () => {
    state.admin = true
    await localVue.nextTick()
    expect(
      wrapper.findAll('a').wrappers.some(wrap => wrap.text() === 'Admin Panel')
    ).toBeTruthy()
  })

  it('for editor shows link to editor panel', async () => {
    state.editor = true
    await localVue.nextTick()
    expect(
      wrapper.findAll('a').wrappers.some(wrap => wrap.text() === 'Editor Panel')
    ).toBeTruthy()
  })
})

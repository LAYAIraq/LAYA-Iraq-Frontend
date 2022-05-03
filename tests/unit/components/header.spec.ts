import { createLocalVue, mount } from '@vue/test-utils'
import Header from '@/components/header.vue'
import BootstrapVue from 'bootstrap-vue'
import Vuex from 'vuex'
import 'regenerator-runtime/runtime'

const localVue = createLocalVue()
localVue.use(BootstrapVue)
localVue.use(Vuex)

describe('Header unauthorized', () => {
  let wrapper
  let actions
  beforeEach(() => {
    const getters = {
      profileLang: () => 'en'
    }
    const auth = {
      state: {
        online: false
      }
    }
    actions = {
      getBrowserLocale: jest.fn(() => Promise.resolve())
    }
    const store = new Vuex.Store({
      actions,
      getters,
      mutations: {
        logout: jest.fn(),
        setLang: jest.fn()
      },
      modules: {
        auth
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
      messages: () => [],
      profileLang: () => 'en',
      unreadMessages: () => 0
    }
    mutations = {
      logout: jest.fn(),
      setLang: jest.fn()
    }
    actions = {
      getBrowserLocale: jest.fn(() => Promise.reject(new Error('none'))),
      setUserLang: jest.fn()
    }
    const auth = {
      state: {
        online: true
      }
    }
    const store = new Vuex.Store({
      state,
      actions,
      getters,
      mutations,
      modules: {
        auth
      }
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
      stubs: ['ly-header-notifications'],
      localVue
    })
  })

  it('has 5 links', async () => {
    const links = wrapper.findAll('a')
    expect(links.length).toBe(5)
  })

  it('triggers logout and redirects when clicked', async () => {
    const logoutAnchor = wrapper.findAll('a').wrappers[3]
    expect(logoutAnchor.text()).toBe('Logout')
    await logoutAnchor.trigger('click')
    expect(wrapper.vm.$ls.remove).toHaveBeenCalled()
    expect(wrapper.vm.$router.push).toHaveBeenCalledWith('/login')
    expect(mutations.logout).toHaveBeenCalled()
  })

  it('fires changes language request', async () => {
    const langButtons = wrapper.find('.dropdown-menu').findAll('button')
    await langButtons.wrappers.forEach(wrapper => wrapper.trigger('click'))
    expect(mutations.setLang).toHaveBeenCalledTimes(5)
    expect(actions.setUserLang).toHaveBeenCalledTimes(4)
  })

  it('for admin has 6 links, one to admin panel', async () => {
    state.admin = true
    await localVue.nextTick()
    expect(wrapper.findAll('a').length).toBe(6)
    let adminPanelPresent = false
    wrapper.findAll('a').wrappers.forEach(wrap => {
      if (wrap.text() === 'Admin Panel') {
        adminPanelPresent = true
      }
    })
    expect(adminPanelPresent).toBeTruthy()
  })

  it('for editor has 6 links, one to editor panel', async () => {
    state.editor = true
    await localVue.nextTick()
    expect(wrapper.findAll('a').length).toBe(6)
    let editorPanelPresent = false
    wrapper.findAll('a').wrappers.forEach(wrap => {
      if (wrap.text() === 'Editor Panel') {
        editorPanelPresent = true
      }
    })
    expect(editorPanelPresent).toBeTruthy()
  })
})

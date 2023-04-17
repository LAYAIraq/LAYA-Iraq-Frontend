import { createLocalVue, mount } from '@vue/test-utils'
import Vuex from 'vuex'
import { BootstrapVue } from 'bootstrap-vue'
import HeaderNotifications from '@/components/notifications/header-notifications.vue'
import 'regenerator-runtime/runtime'

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(BootstrapVue)

describe('header notifications dropdown', () => {
  let wrapper
  let actions
  let mutations
  let getters
  let state
  beforeEach(() => {
    getters = {
      profileLang: () => 'en',
      userId: () => 1,
      messages: () => state.messages,
      unreadMessages: () => state.unreadMessages,
      unreadMsgNo: () => state.unreadMsgNo
    }
    mutations = {
      allRead: jest.fn()
    }
    state = {
      messages: [],
      unreadMessages: false,
      unreadMsgNo: 0
    }
    actions = {
      getAllMessages: jest.fn(() => Promise.resolve(state.messages = [
        { msg: 'mofo', time: 1, read: false },
        { msg: 'mofo', time: 2, read: false },
        { msg: 'mofo', time: 3, read: false },
        { msg: 'mofo', time: 4, read: false },
        { msg: 'mofo', time: 5, read: false }
      ])),
      getNewMessages: jest.fn(() => state.messages.push({
        msg: 'mofo', time: 6, read: false
      })),
      updateReadProp: jest.fn(() => {
        state.messages.forEach(msg => {
          msg.read = true
        })
      })
    }
    const store = new Vuex.Store({
      actions,
      getters,
      mutations,
      state
    })
    wrapper = mount(HeaderNotifications, {
      store,
      stubs: ['router-link'],
      localVue
    })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('requests messages on creation', async () => {
    await localVue.nextTick()
    expect(wrapper.findAll('a').length).toBe(8)
  })

  it('calls allRead when clicked', async () => {
    const markAsReadButton = wrapper.findAll('button').wrappers[1] // 'all read' button
    // expect (getButton !== markAsReadButton).toBeTruthy()
    expect(markAsReadButton.text()).toBe('Mark all as read')
    await markAsReadButton.trigger('click')
    expect(mutations.allRead).toHaveBeenCalled()
  })

  it('fetches more messages on click', async () => {
    const button = wrapper.findAll('button').wrappers[2] // 'fetch more' button
    await button.trigger('click')
    expect(actions.getNewMessages).toHaveBeenCalled()
    await localVue.nextTick()
  })

  it('shows icon when there are unread messages', async () => {
    state.unreadMessages = true
    state.unreadMsgNo = 5
    await localVue.nextTick()
    const unreadBadge = wrapper.find('.note-badge')
    expect(unreadBadge.exists()).toBeTruthy()
    expect(unreadBadge.text()).toBe('5')
  })
})

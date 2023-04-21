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
      profileLanguage: () => 'en',
      userId: () => 1,
      notifications: () => state.notifications,
      unreadMessages: () => state.unreadMessages,
      notificationsUnreadNumber: () => state.notificationsUnreadNumber
    }
    mutations = {
      notificationsReadAll: jest.fn()
    }
    state = {
      notifications: [],
      unreadMessages: false,
      notificationsUnreadNumber: 0
    }
    const notificationsSet = () => {
      Promise.resolve(state.notifications = [
        { msg: 'mofo', time: 1, read: false },
        { msg: 'mofo', time: 2, read: false },
        { msg: 'mofo', time: 3, read: false },
        { msg: 'mofo', time: 4, read: false },
        { msg: 'mofo', time: 5, read: false }
      ])
    }
    actions = {
      notificationsFetchAll: jest.fn(notificationsSet),
      notificationsFetchInitial: jest.fn(notificationsSet),
      notificationsFetchNew: jest.fn(() => state.notifications.push({
        msg: 'mofo', time: 6, read: false
      })),
      notificationsUpdateRead: jest.fn(() => {
        state.notifications.forEach(msg => {
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

  it('requests notifications on creation', async () => {
    await localVue.nextTick()
    expect(wrapper.findAll('a').length).toBe(8)
  })

  it('calls notificationsReadAll when clicked', async () => {
    const markAsReadButton = wrapper.findAll('button').at(1) // 'all read' button
    // buttons.wrappers.forEach(e => console.log(e.text()))
    // const markAsReadButton = buttons.wrappers.find(e => e.text === 'Mark all as read')
    // expect (getButton !== markAsReadButton).toBeTruthy()
    expect(markAsReadButton.text()).toBe('Mark all as read')
    await markAsReadButton.trigger('click')
    expect(mutations.notificationsReadAll).toHaveBeenCalled()
  })

  it('fetches more notifications on click', async () => {
    const button = wrapper.findAll('button').wrappers[2] // 'fetch more' button
    await button.trigger('click')
    expect(actions.notificationsFetchNew).toHaveBeenCalled()
    await localVue.nextTick()
  })

  it('shows icon when there are unread notifications', async () => {
    state.unreadMessages = true
    state.notificationsUnreadNumber = 5
    await localVue.nextTick()
    const unreadBadge = wrapper.find('.note-badge')
    expect(unreadBadge.exists()).toBeTruthy()
    expect(unreadBadge.text()).toBe('5')
  })
})

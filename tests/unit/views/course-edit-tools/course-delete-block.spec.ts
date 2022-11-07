import 'regenerator-runtime/runtime'
import { createLocalVue, mount } from '@vue/test-utils'
import CourseDeleteBlock from '@/views/course-edit-tools/course-delete-block.vue'
import Vuex from 'vuex'
import { BootstrapVue } from 'bootstrap-vue'

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(BootstrapVue)

describe('Course delete block', () => {
  let getters
  let actions
  let mutations
  let wrapper
  let button
  let modalButtons
  beforeEach(() => {
    getters = {
      profileLang: () => 'en',
      course: () => {
        return {
          courseId: 'test'
        }
      },
      content: () => [{
        id: 'test'
      }]
    }
    actions = {
      storeCourse: jest.fn(() => {
        return Promise.resolve()
      })
    }
    mutations = {
      delContent: jest.fn()
    }
    const store = new Vuex.Store({
      getters,
      mutations,
      actions
    })
    wrapper = mount(
      CourseDeleteBlock, {
        mocks: {
          $router: jest.fn()
        },
        store,
        localVue,
        propsData: {
          step: '1'
        }
      }
    )
    expect(wrapper.exists()).toBeTruthy()
    button = wrapper.findComponent('button')
  })

  it('prompts a modal when clicking button', async () => {
    const modal = wrapper.find('#author-delContent-confirm')
    expect(modal.isVisible()).toBeFalsy()
    expect(button.exists()).toBeTruthy()
    await button.trigger('click')
    expect(modal.isVisible()).toBeTruthy()
  })

  it('calls all store methods when clicking ok', async () => {
    await button.trigger('click')
    modalButtons = wrapper.findAll('button')
    modalButtons.wrappers.forEach(wrap => {
      if (wrap.text() === 'Delete') {
        button = wrap
      }
    })
    await button.trigger('click')
    expect(mutations.delContent).toHaveBeenCalled()
    expect(actions.storeCourse).toHaveBeenCalled()
  })

  it('is not rendered when there is no content', async () => {
    getters.content = () => []
    const store = new Vuex.Store({
      getters,
      mutations,
      actions
    })
    wrapper = mount(
      CourseDeleteBlock, {
        mocks: {
          $router: jest.fn()
        },
        store,
        localVue,
        propsData: {
          step: '1'
        }
      }
    )
    expect(wrapper.find('#delete-content').exists()).toBeFalsy()
  })
})

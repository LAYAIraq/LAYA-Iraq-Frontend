import 'regenerator-runtime/runtime'
import { createLocalVue, mount } from '@vue/test-utils'
import CourseDeleteBlock from '@/components/course/course-edit/course-block-delete.vue'
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
      profileLanguage: () => 'en',
      courseContent () {
        return {
          test: {
            id: 'test'
          }
        }
      },
      courseContentPathId: () => () => 'test',
      courseRoutes: () => {
        return {
          test: ['test'],
          '': []
        }
      }
    }
    actions = {
      courseUpdate: jest.fn(() => {
        return Promise.resolve()
      })
    }
    mutations = {
      courseChaptersContentRemove: jest.fn(),
      courseContentRemove: jest.fn(),
      courseRoutesUpdate: jest.fn()
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
        localVue
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
    expect(mutations.courseContentRemove).toHaveBeenCalledWith(expect.any(Object), 'test')
    expect(actions.courseUpdate).toHaveBeenCalled()
  })

  it('is not rendered when there is no content', async () => {
    getters.courseContentPathId = () => () => ''
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
        localVue
      }
    )
    // console.log(wrapper.vm)
    expect(wrapper.vm.$data.contentToDisplay).toBeFalsy()
    expect(wrapper.find('#delete-content').exists()).toBeFalsy()
  })
})

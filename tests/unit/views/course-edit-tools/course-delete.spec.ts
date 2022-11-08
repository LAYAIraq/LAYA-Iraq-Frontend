import 'regenerator-runtime/runtime'
import { createLocalVue, mount } from '@vue/test-utils'
import CourseDelete from '@/views/course-edit-tools/course-delete.vue'
import Vuex from 'vuex'
import { BootstrapVue } from 'bootstrap-vue'

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(BootstrapVue)

describe('CourseDelete.vue', () => {
  describe('deleteCourse() resolves', () => {
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
        }
      }
      actions = {
        deleteCourse: jest.fn(() => {
          return Promise.resolve()
        })
      }
      mutations = {
        removeFromCourseList: jest.fn()
      }
      const store = new Vuex.Store({
        getters,
        mutations,
        actions
      })
      wrapper = mount(
        CourseDelete, {
          mocks: {
            $router: {
              push: jest.fn()
            }
          },
          store,
          localVue
        }
      )
      button = wrapper.findComponent('button')
    })

    it('prompts a modal when clicking button', async () => {
      expect(button.exists()).toBeTruthy()
      const modal = wrapper.find('#author-del-course-confirm')
      expect(modal.isVisible()).toBeFalsy()
      await button.trigger('click')
      expect(modal.exists()).toBeTruthy()
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
      expect(actions.deleteCourse).toHaveBeenCalled()
      expect(mutations.removeFromCourseList).toHaveBeenCalled()
      expect(wrapper.vm.$router.push).toHaveBeenCalledWith('/courses')
      // expect(vm.$router.push).toHaveBeenCalled()
    })
  })

  describe('deleteCourse() rejects', () => {
    it('prompts error log when store returns rejection', async () => {
      const getters = {
        profileLang: () => 'en',
        course: () => {
          return {
            courseId: 'test'
          }
        }
      }
      const actions = {
        deleteCourse: jest.fn(() => {
          return Promise.reject(new Error('err!'))
        })
      }
      const mutations = {
        removeFromCourseList: jest.fn()
      }
      const store = new Vuex.Store({
        getters,
        mutations,
        actions
      })
      const wrapper = mount(CourseDelete, {
        mocks: {
          $router: {
            push: jest.fn()
          }
        },
        store,
        localVue
      })
      let button = wrapper.find('button')
      console.error = jest.fn()
      await button.trigger('click')
      const modalButtons = wrapper.findAll('button')
      modalButtons.wrappers.forEach(wrap => {
        if (wrap.text() === 'Delete') {
          button = wrap
        }
      })
      await button.trigger('click')
      await localVue.nextTick()
      expect(actions.deleteCourse).toHaveBeenCalled()
      expect(console.error).toHaveBeenCalledWith('ERROR:', expect.any(Error))
    })
  })
})

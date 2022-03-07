import 'regenerator-runtime/runtime'
import { createLocalVue, shallowMount } from '@vue/test-utils'
import CourseDelete from '@/views/course-edit-tools/course-delete.vue'
import Vuex from 'vuex'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('Course delete', () => {
  it('prompts a modal when clicking button', async () => {
    const getters = {
      profileLang: () => 'en'
    }
    const store = new Vuex.Store({
      getters
    })
    const wrapper = shallowMount(
      CourseDelete, {
        store,
        stubs: ['b-button', 'b-modal'],
        localVue
      }
    )
    const button = wrapper.find('#delete-button')
    await button.trigger('click')
    const modal = wrapper.find('#author-delCourse-confirm')
    expect(modal).toBeDefined()
  })

  it('fires store method deleteCourse', () => {
    const getters = {
      profileLang: () => 'en'
    }
    const actions = {
      deleteCourse: jest.fn(),
      fetchCourseList: () => {}
    }
    const store = new Vuex.Store({
      getters,
      actions
    })
    const wrapper = shallowMount(
      CourseDelete, {
        store,
        stubs: ['b-button', 'b-modal'],
        mocks: {
          $router: {
            push: () => {}
          }
        },
        localVue
      }
    )
    const vm = wrapper.vm as any
    vm.delCourse()
    expect(actions.deleteCourse).toHaveBeenCalled()
  })
})

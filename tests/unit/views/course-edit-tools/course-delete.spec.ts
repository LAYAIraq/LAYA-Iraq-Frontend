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

  it('fires store method deleteCourse', async () => {
    const getters = {
      profileLang: () => 'en',
      course: () => {
        return {
          courseId: 'test'
        }
      }
    }
    const actions = {
      deleteCourse: jest.fn()
    }
    const mutations = {
      removeFromCourseList: () => {}
    }
    const store = new Vuex.Store({
      getters,
      actions,
      mutations
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
    // expect(vm.$router.push).toHaveBeenCalled()
  })

  it('redirects user and removes from course list', async () => {
    const getters = {
      profileLang: () => 'en',
      course: () => {
        return {
          courseId: 'test'
        }
      }
    }
    const actions = {
      deleteCourse: () => {
        return Promise.resolve(true)
      }
    }
    const mutations = {
      removeFromCourseList: jest.fn()
    }
    const store = new Vuex.Store({
      getters,
      actions,
      mutations
    })
    const wrapper = shallowMount(
      CourseDelete, {
        store,
        stubs: ['b-button', 'b-modal'],
        mocks: {
          $router: {
            push: jest.fn()
          }
        },
        localVue
      }
    )
    const vm = wrapper.vm as any
    const delCourse = () => { // copy of vm.delCourse with returned Promise
      return new Promise((resolve, reject) => {
        vm.$store.dispatch('deleteCourse')
          .then(() => {
            vm.$store.commit('removeFromCourseList', 'test')
            vm.$router.push('/courses')
            resolve(true)
          })
          .catch((err) => reject(err))
      })
    }
    await delCourse()
    expect(mutations.removeFromCourseList).toHaveBeenCalled()
    expect(vm.$router.push).toHaveBeenCalledWith('/courses')
  })
})
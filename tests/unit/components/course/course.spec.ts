/**
 * @file This file contains unit tests for the course component.
 * @author: cmc
 * @since v1.3.0
 */
import { createLocalVue, mount } from '@vue/test-utils'
import Course from '@/components/course/course.vue'
import Vuex from 'vuex'
import VueRouter from 'vue-router'

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(VueRouter)
const router = new VueRouter({
  routes: [
    { name: 'course', path: '/courses/:name/:coursePath?' }
  ]
})

const state = {
  courseChapterNames: {},
  courseSimple: false
}
const getters = {
  courseChapterNames: () => state.courseChapterNames,
  courseSimple: () => state.courseSimple,
  profileLanguage: () => 'en'
}
const mutations = {
  setSimple: (state, value) => {
    state.courseSimple = value
  }
}
const store = new Vuex.Store({
  state,
  getters,
  mutations
})

describe.skip('Course component', () => { // skipped, testing store module precedes
  let wrapper
  beforeAll(() => {
    wrapper = mount(Course, {
      localVue,
      router,
      store,
      propsData: {
        coursePath: 'test'
      }
    })
  })
  describe('computed properties', () => {
    describe('followContent', () => {
      beforeAll(() => {
        wrapper.setProperty()
      })
      it('transforms array of follow elements into array of router functions of same length', () => {

      })
    })
  })
})

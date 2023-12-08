/**
 * @file This file contains unit tests for the course-detail-header component.
 * @author: cmc
 * @since v1.3.0
 */
import { createLocalVue, mount } from '@vue/test-utils'
import CourseHeader from '@/components/course/course-header.vue'
import Vuex from 'vuex'
import VueRouter from 'vue-router'

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(VueRouter)
const router = new VueRouter({
  routes: [
    { name: 'course-list', path: '/courses' },
    { name: 'course', path: '/courses/:name/:coursePath*' }
  ]
})

describe('course detail header', () => {
  const courseName = 'Test Course'
  const contentTitle = {
    text: 'Content Title',
    simple: 'Simple Title'
  }
  const state = {
    courseChapterNames: {},
    courseSimple: false
  }
  const getters = {
    courseChapterNames: () => state.courseChapterNames,
    courseSimple: () => state.courseSimple,
    courseContentPathId: () => () => 'test',
    courseRoutes: () => {
      return {
        test: ['test'],
        '': []
      }
    },
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
  let wrapper
  describe('basic functionality', () => {
    beforeAll(() => {
      wrapper = mount(CourseHeader, {
        localVue,
        store,
        router,
        propsData: {
          contentTitle,
          courseName,
          coursePath: 'test-path'
        }
      })
    })
    it('renders the course name', () => {
      expect(wrapper.find('#course-title').text()).toBe(courseName)
    })
    it('renders three breadcrumb links with correct text', () => {
      const breadcrumbs = wrapper.findAll('.breadcrumb-item')
      expect(breadcrumbs.length).toBe(3)
      expect(breadcrumbs.at(0).text()).toBe('All courses')
      expect(breadcrumbs.at(1).text()).toBe('Test Course')
      expect(breadcrumbs.at(2).text()).toBe('Content Title')
    })
    it('breadcrumb links refer to correct locations', () => {
      const breadcrumbs = wrapper.findAll('a')
      expect(breadcrumbs.at(0).attributes('href')).toBe('#/courses')
      expect(breadcrumbs.at(1).attributes('href')).toBe('#/courses/test-course')
    })
  })
  describe('simple course functionality', () => {
    beforeAll(() => {
      store.commit('setSimple', true)
    })
    it('renders the simple course title', () => {
      expect(wrapper.findAll('.breadcrumb-item').at(2).text()).toBe(contentTitle.simple)
    })
  })
  describe('nested chapters (no chapterName lookup)', () => {
    beforeAll(() => {
      store.commit('setSimple', false)
      wrapper = mount(CourseHeader, {
        localVue,
        store,
        router,
        propsData: {
          contentTitle,
          courseName,
          coursePath: 'main-chapter/sub-chapter/sub-sub-chapter/quiz'
        }
      })
    })
    it('renders the complete path correctly', () => {
      expect(wrapper.findAll('.breadcrumb-item').length).toBe(6)
    })
    it('renders the correct links', () => {
      const breadcrumbs = wrapper.findAll('a')
      expect(breadcrumbs.at(0).attributes('href')).toBe('#/courses')
      expect(breadcrumbs.at(1).attributes('href')).toBe('#/courses/test-course')
      expect(breadcrumbs.at(2).attributes('href')).toBe('#/courses/test-course/main-chapter')
      expect(breadcrumbs.at(3).attributes('href')).toContain('sub-chapter') // nested subchapters are encoded
      expect(breadcrumbs.at(4).attributes('href')).toContain('sub-sub-chapter')
    })
    it('renders the correct text', () => {
      const breadcrumbs = wrapper.findAll('.breadcrumb-item')
      expect(breadcrumbs.at(2).text()).toBe('Main Chapter')
      expect(breadcrumbs.at(3).text()).toBe('Sub Chapter')
      expect(breadcrumbs.at(4).text()).toBe('Sub Sub Chapter')
      expect(breadcrumbs.at(5).text()).toBe('Content Title')
    })
  })
  describe('nested chapters (with chapterName lookup)', () => {
    beforeAll(() => {
      store.commit('setSimple', false)
      state.courseChapterNames = {
        'main-chapter': 'Very Elaborate Chapter Name',
        'sub-chapter': 'Tedious Little Sub Chapter',
        'sub-sub-chapter': 'Unnecessary Sub Sub Chapter'
      }
      wrapper = mount(CourseHeader, {
        localVue,
        store,
        router,
        propsData: {
          contentTitle,
          courseName,
          coursePath: 'main-chapter/sub-chapter/sub-sub-chapter/quiz'
        }
      })
    })
    it('renders the correct text', () => {
      const breadcrumbs = wrapper.findAll('.breadcrumb-item')
      expect(breadcrumbs.at(2).text()).toBe('Very Elaborate Chapter Name')
      expect(breadcrumbs.at(3).text()).toBe('Tedious Little Sub Chapter')
      expect(breadcrumbs.at(4).text()).toBe('Unnecessary Sub Sub Chapter')
    })
  })
})

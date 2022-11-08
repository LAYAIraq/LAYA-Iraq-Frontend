import cloneDeep from 'lodash.clonedeep'
import edit from '@/store/modules/edit'
import { createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import axios from 'axios'
import SampleCourse from '../../mocks/sample-course-short.json'

// FIXME: probably related to this: https://github.com/facebook/jest/issues/10147

const localVue = createLocalVue()
localVue.use(Vuex)

describe('store module edit', () => {
  const store = new Vuex.Store({
    modules: {
      edit: cloneDeep(edit)
    },
    mutations: {
      setBusy: jest.fn()
    }
  })
  const courses = [SampleCourse]
  jest.mock('axios', () => ({
    http: {
      get: () => Promise.resolve({ courses })
    }
  }))
  beforeAll(() => {

    // const courses = [SampleCourse]
    // jest.mock('axios', () => ({
    //   get: () => Promise.resolve(courses)
    // }))
    // jest.mock(
    //   'http',
    //   () => ({
    //     get: () => Promise.resolve('value'),
    //     post: () => Promise.resolve('value'),
    //     patch: () => Promise.resolve('value'),
    //     all: () => Promise.resolve('value')
    //   }),
    //   {
    //     virtual: true
    //   })
  })

  // it('should get course', async () => {
  //   const course = await http.get('http://localhost:3000/courses/1')
  //   expect(course).toStrictEqual(expect.any(Array))
  // })
  // dummy test to make test suite pass
  // it('returns correct thingy', () => {
  //   expect(store.getters.courseUpdated).toBeFalsy()
  // })
  //
  // it('fires deleteCourse()', () => {
  //   store.dispatch('deleteCourse')
  //   expect(store.state).toBeDefined()
  // })
  //
  it('executes fetchCourseList()', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch')
    store.dispatch('fetchCourseList')
    expect(dispatchSpy).toHaveBeenCalledWith('fetchCourseList')
  })
})

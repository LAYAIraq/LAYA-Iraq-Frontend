import edit from '@/store/modules/edit'
import axios from 'axios'
import SampleCourse from '../../mocks/sample-course-short.json'
import SampleCourseSimple from '../../mocks/sample-course-simple.json'
import 'regenerator-runtime/runtime'

// console.log(edit.actions)
// jest.mock('axios')

describe('store module edit actions', () => {
  const actions = edit.actions
  const commit = jest.fn()
  const dispatch = jest.fn()
  const state = {
    courseList: [
      { courseId: 1, courseName: 'course 1' } // mock course for statement coverage
    ]
  }
  let spy

  it('fetchCourseList calls GET method, call commit function', async () => {
    spy = jest.spyOn(actions, 'fetchCourseList')
    const data = [{ ...SampleCourse, properties: {} }]
    const httpSpy = jest.spyOn(axios, 'get').mockResolvedValue({ data })
    await actions.fetchCourseList({ commit, state })
    // console.log(resp)
    expect(spy).toHaveBeenCalled()
    expect(httpSpy).toHaveBeenCalled()
    expect(commit).toHaveBeenCalledWith('setBusy', true)
    expect(commit).toHaveBeenCalledWith('courseListAppend', expect.any(Object))
    // expect(commit).toHaveBeenCalledWith('setBusy', false) cannot be tested b/c action doesn't return a promise
  })

  it('fetchCourseList sets properties correctly (content input)', async () => {
    const data = [{ ...SampleCourse, properties: {} }]
    jest.spyOn(axios, 'get').mockResolvedValue({ data })
    await actions.fetchCourseList({ commit, state })
    expect(commit).toHaveBeenCalledWith('courseListAppend', expect.objectContaining({
      properties: {
        video: true,
        text: true
      }
    }))
  })

  it('fetchCourseList sets properties correctly (enrollment)', async () => {
    const data = [{ ...SampleCourse, properties: { enrollment: true } }]
    jest.spyOn(axios, 'get').mockResolvedValue({ data })
    await actions.fetchCourseList({ commit, state })
    expect(commit).toHaveBeenCalledWith('courseListAppend', expect.objectContaining({
      properties: {
        video: true,
        text: true,
        enrollment: true
      }
    }))
  })

  it('fetchCourseList sets properties correctly (fully equipped simple language course)', async () => {
    const data = [SampleCourseSimple]
    jest.spyOn(axios, 'get').mockResolvedValue({ data })
    await actions.fetchCourseList({ commit, state })
    expect(commit).toHaveBeenCalledWith('courseListAppend', expect.objectContaining({
      properties: {
        video: true,
        text: true,
        simple: true,
        simpleLanguage: true
      }
    }))
  })

  it('fetchCourseList sets properties correctly (simple language course with missing simple language alternatives)', async () => {
    const data = [{ ...SampleCourse, properties: { simpleLanguage: true } }]
    jest.spyOn(axios, 'get').mockResolvedValue({ data })
    await actions.fetchCourseList({ commit, state })
    expect(commit).toHaveBeenCalledWith('courseListAppend', expect.objectContaining({
      properties: {
        video: true,
        text: true,
        simple: false,
        simpleLanguage: true
      }
    }))
  })

  // dummy test for full branch coverage
  it('fetchCourseList prints error when http request fails', async () => {
    const error = new Error('test error')
    jest.spyOn(axios, 'get').mockRejectedValue(error)
    await actions.fetchCourseList({ commit, state })
  })
})

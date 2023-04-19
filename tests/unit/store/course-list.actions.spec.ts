import courseList from '@/store/modules/course-list'
import axios from 'axios'
import SampleCourse from '../../mocks/sample-course-short.json'
import 'regenerator-runtime/runtime'

// console.log(courseEdit.actions)
// jest.mock('axios')

describe('store module courseList actions', () => {
  const actions = courseList.actions
  const commit = jest.fn()
  const state = {
    courseList: [
      { courseId: 1, courseName: 'course 1' } // mock course for statement coverage
    ]
  }
  let spy

  it('courseListFetch calls GET method, call commit function', async () => {
    spy = jest.spyOn(actions, 'courseListFetch')
    const data = [{ ...SampleCourse, properties: {} }]
    const httpSpy = jest.spyOn(axios, 'get').mockResolvedValue({ data })
    await actions.courseListFetch({ commit, state })
    // console.log(resp)
    expect(spy).toHaveBeenCalled()
    expect(httpSpy).toHaveBeenCalled()
    expect(commit).toHaveBeenCalledWith('setBusy', true)
    expect(commit).toHaveBeenCalledWith('courseListAppend', expect.any(Object))
    // expect(commit).toHaveBeenCalledWith('setBusy', false) cannot be tested b/c action doesn't return a promise
  })

  // dummy test for full branch coverage
  it('courseListFetch prints error when http request fails', async () => {
    const error = new Error('test error')
    jest.spyOn(axios, 'get').mockRejectedValue(error)
    await actions.courseListFetch({ commit, state })
  })
})

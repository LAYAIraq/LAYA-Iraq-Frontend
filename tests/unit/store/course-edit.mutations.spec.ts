import 'regenerator-runtime/runtime'
import SampleCourse from '../../mocks/sample-course-short.json'
import axios from 'axios'
import SampleCourseSimple from '../../mocks/sample-course-simple.json'

describe.skip('course edit mutations', () => {
  // TODO add tests for simple language and property check that have been in courseListFetch before
  // it('courseListFetch sets properties correctly (content input)', async () => {
  //   const data = [{ ...SampleCourse, properties: {} }]
  //   jest.spyOn(axios, 'get').mockResolvedValue({ data })
  //   await actions.courseListFetch({ commit, state })
  //   expect(commit).toHaveBeenCalledWith('courseListAppend', expect.objectContaining({
  //     properties: {
  //       video: true,
  //       text: true
  //     }
  //   }))
  // })
  //
  // it('courseListFetch sets properties correctly (enrollment)', async () => {
  //   const data = [{ ...SampleCourse, properties: { enrollment: true } }]
  //   jest.spyOn(axios, 'get').mockResolvedValue({ data })
  //   await actions.courseListFetch({ commit, state })
  //   expect(commit).toHaveBeenCalledWith('courseListAppend', expect.objectContaining({
  //     properties: {
  //       video: true,
  //       text: true,
  //       enrollment: true
  //     }
  //   }))
  // })
  //
  // it('courseListFetch sets properties correctly (fully equipped simple language course)', async () => {
  //   const data = [SampleCourseSimple]
  //   jest.spyOn(axios, 'get').mockResolvedValue({ data })
  //   await actions.courseListFetch({ commit, state })
  //   expect(commit).toHaveBeenCalledWith('courseListAppend', expect.objectContaining({
  //     properties: {
  //       video: true,
  //       text: true,
  //       simple: true,
  //       simpleLanguage: true
  //     }
  //   }))
  // })
  //
  // it('courseListFetch sets properties correctly (simple language course with missing simple language alternatives)', async () => {
  //   const data = [{ ...SampleCourse, properties: { simpleLanguage: true } }]
  //   jest.spyOn(axios, 'get').mockResolvedValue({ data })
  //   await actions.courseListFetch({ commit, state })
  //   expect(commit).toHaveBeenCalledWith('courseListAppend', expect.objectContaining({
  //     properties: {
  //       video: true,
  //       text: true,
  //       simple: false,
  //       simpleLanguage: true
  //     }
  //   }))
  // })
})

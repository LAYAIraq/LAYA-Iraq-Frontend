/**
 * Filename: course.ts
 * Use: organize course
 * Author: cmc
 * Since: v1.3.0
 */
import http, { AxiosResponse } from 'axios'
import { Course } from '@/mixins/types/course-structure'

export default {
  state: {
    cLanguage: 'english'
  },
  getters: {
    courseLanguage: (state: { cLanguage: string }) => state.cLanguage
  },
  actions: {
    /**
     * @description gets a course from new back end and calls
     *   courseStructureDestructure mutation
     *  @param commit - commit function
     *  @param courseIdentifier - identifier for course, can be id or slug
     */
    /**
     courseFetch ({ commit }, courseIdentifier: string) {
      return new Promise((resolve, reject) => {
        http.get(`courses/${courseIdentifier}`)
          .then((response: AxiosResponse<Course>) => {
            commit('courseStructureDestructure', response.data)
            resolve(response)
          })
          .catch((error) => {
            reject(error)
          })
      })
    }
     **/
  },
  /**
   * function courseUpdateLanguage: persist locale to backend
   * Author: nv
   * Since: v1.3.0
   * @param param0 contains state variables
   * @param langData contains course language and id
   */
  courseUpdateLanguage (
    { commit, state },
    langData: {
      lang: string,
      cid: number
    }
  ) {
    // save language choice in User's profile
    http.post( // TODO figure out if endpoint is needed
      `/course/${langData.cid}/change-language`,
      langData
    )
      .then(() => {
        state.cLanguage = langData.lang
      })
      .catch((err) => console.error(err))
  }
}

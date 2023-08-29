/**
 * Filename: course.ts
 * Use: organize course
 * Author: cmc
 * Since: v1.3.0
 */
import http, { AxiosResponse } from 'axios'
import { Course } from '@/mixins/types/course-structure'

export default {
  actions: {
    /**
     * @description gets a course from new back end and calls
     *   courseStructureDestructure mutation
     *  @param commit - commit function
     *  @param courseIdentifier - identifier for course, can be id or slug
     */
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
    },

    /**
     * find course by id.
     * @param id to get course for
     */
    courseGetById ({ commit }, id: string) {
      return new Promise((resolve, reject) => {
        http.get(`courses/${id}`).then(course => {
          resolve(course)
        }).catch(error => reject(error))
      })
    }
  }
}

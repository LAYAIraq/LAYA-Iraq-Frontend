import http from 'axios'
import { slugify } from '@/mixins/general/course-structure'
export default {
  state: {
    courseList: []
  },
  getters: {
    /**
     * Function courseList: returns list of courses
     *
     * Author: cmc
     *
     * Last Updated: January 27, 2022
     *
     * @param state contains courseList
     * @returns array of courses
     */
    courseList (state: { courseList: object[] }) {
      return state.courseList
    }
  },
  mutations: {
    /**
     * Function courseListAppend: add course object
     *  to courseList array
     *
     * Author: cmc
     *
     * Last Updated: November 7, 2022 by cmc
     *
     * @param state contains courseList array
     * @param courseListItem course object to be added to list
     */
    courseListAppend (
      state: { courseList: object[] },
      courseListItem: {
        abstract: string,
        keywords: string,
        author: number,
        authorName: string,
        category: string,
        language: string,
        courseId: string,
        name: string,
        properties: object,
        slug: string
      }
    ) {
      state.courseList.push(courseListItem)
    },

    /**
     * Function to replace properties attribute for course in course list
     *
     * Author: pj
     *
     * Last Updated: August 14 2023 by nv
     *
     * @param state course list array
     * @param data new properties to be set
     */
    courseListPropertiesUpdate (
      state: {
        courseList: Array<{
          courseId: string,
          properties: object
        }> },
      data: {
        course: {
          courseId: string
        },
        prefs: object
      }
    ) {
      const listEntry = state.courseList.find(x => x.courseId === data.course.courseId)
      if (listEntry) { // update properties of listEntry if present
        listEntry.properties = {
          ...listEntry.properties,
          ...data.prefs
        }
      }
    },
    /**
     * function courseListRemove: remove an item from the course list
     *
     * Author: cmc
     *
     * Last Updated: November 7, 2022
     * @param state contains courseList
     * @param {string} courseId of course item to delete
     */
    courseListRemove (
      state: {
        courseList: Array<{
          courseId: string
        }>
      },
      courseId: string
    ) {
      const idx = state.courseList.findIndex(elem => elem.courseId === courseId)
      state.courseList.splice(idx, 1)
    },
    /**
     * Function courseListUpdate: update courseList after name change of course
     *
     * Author: cmc
     *
     * Last Updated: August 14 2023 by nv
     * @param state contains courseList
     * @param data courseId, new name for course in list
     */
    courseListUpdate (
      state: {
        courseList: Array<{
          abstract: string,
          authorName: string,
          keywords: string,
          category: string,
          language: string,
          courseId: string,
          name: string,
          slug: string
        }>
      },
      data: {
        courseId: string,
        name: string
      }
    ) {
      const listItem = state.courseList.find((item: { courseId: string, name: string }) => item.courseId === data.courseId)
      if (listItem) {
        listItem.name = data.name
      }
    }
  },
  actions: {
    /**
     * Function courseListFetch: get list of courses
     *
     * Author: cmc
     *
     * Last Updated: August 14 2023 by nv
     *
     * @param param0 state variables
     */
    courseListFetch ({ commit, state }) {
      commit('setBusy', true)
      http.get('courses')
        .then(({ data }) => {
          for (const courseObject of data) {
            const listData = {
              abstract: courseObject.abstract,
              keywords: courseObject.keywords,
              category: courseObject.category,
              language: courseObject.language,
              name: courseObject.name,
              slug: slugify(courseObject.name), // TODO: handle arabic & kurdish
              properties: courseObject.properties,
              courseId: courseObject.courseId,
              author: courseObject.authorId,
              authorName: courseObject.authorName
            }

            if (!state.courseList.some( // add to course list if not present
              (e: { courseId: String }) => e.courseId === listData.courseId)
            ) {
              commit('courseListAppend', listData)
            }
          }
        })
        .catch(err => console.error(err))
        .finally(() => { commit('setBusy', false) })
    }
  }
}

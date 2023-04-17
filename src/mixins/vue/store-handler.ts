/**
 * Filename: store-handler.ts
 * Use: contains methods to use store in components
 * Creator: cmc
 * Since: v1.1.0
 */

export default {
  methods: {

    /**
     * Function courseFetch(): get course from database and put in store,
     *  start other functions if successful
     *
     * Author: cmc
     *
     * Last Updated: October 21, 2021
     */
    courseFetch (name) {
      const courseName = name || this.$route.params.name // use argument if given, otherwise use router params
      this.$store.dispatch('fetchCourse', courseName)
        .then(() => {
          this.enrollmentFetch()
          this.$store.commit('unsetCourseUpdated')
          document.title = `LAYA | ${this.$store.state.edit.course.name}`
        })
        .catch(err => {
          this.$router.push('/courses')
          console.error(err)
        })
    },
    /**
     * Function enrollmentFetch: load enrollment status of user
     *
     * Author: cmc
     *
     * Last Updated: December 13, 2022 by cmc
     */
    enrollmentFetch () {
      if (this.course.properties?.enrollment) {
        this.$store.dispatch('fetchEnrollment', this.course.courseId)
      }
    },

    /**
     * Function enrollmentUpdate: update enrollment in store
     *
     * Author: cmc
     *
     * Last Updated: October 27, 2020
     */
    enrollmentUpdate () {
      this.$store.dispatch('updateEnrollment')
    },

    /**
     * Function flagsFetch: Fetch flags for course from vuex
     *
     * Author: cmc
     *
     * Last Updated: July 7, 2021
     */
    flagsFetch () {
      this.$store.dispatch('getCourseFlags', this.course.courseId)
    },

    /**
     * function flagsUpdate: persist flag state in database
     *
     * Author: cmc
     *
     * Last Updated: July 7, 2021
     */
    flagsUpdate () {
      this.$store.dispatch('updateFlags')
    },

    /**
     * Function notificationsFetch: get messages newer than
     *  newest in store
     *
     * Author: cmc
     *
     * Last Updated: June 26, 2021
     */
    notificationsFetch () {
      this.$store.dispatch('getNewMessages')
    },

    /**
     * Function notificationsMarkRead: set allRead commit in store
     *
     * Author: cmc
     *
     * Last Updated: May 28, 2021
     */
    notificationsMarkRead () {
      this.$store.commit('allRead')
    }
  }
}

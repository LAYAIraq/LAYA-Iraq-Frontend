/**
 * Filename: store-handler.ts
 * Use: contains methods to obtain data from db to store
 * Creator: cmc
 * Date: October 21, 2021
 * Dependencies: none
 */

export default {
  methods: {

    /**
     * Function fetchCourse(): get course from database and put in store,
     *  start other functions if successful
     *
     * Author: cmc
     *
     * Last Updated: October 21, 2021
     */
    fetchCourse(name) {
      const courseName = name || this.$route.params.name // use argument if given, otherwise use router params
      this.$store.dispatch('fetchCourse', courseName)
      .then(resp => {
        console.log(resp)
        // this.fetchEnrollment() // commented out b/c no enrollment
        this.fetchFlags()
        this.$forceUpdate()
      })
      .catch(err => {
        this.$router.push('/courses')
        console.error(err)
      })
    },
    /**
     * Function fetchEnrollment: load enrollment status of user
     *
     * Author: cmc
     *
     * Last Updated: October 27, 2020
     */
    fetchEnrollment() {
      if(this.course.needsEnrollment) {
        this.$store.dispatch('fetchEnrollment', this.course.courseId)
      }
    },

    /**
     * Function fetchFlags: Fetch flags for course from vuex
     *
     * Author: cmc
     *
     * Last Updated: July 7, 2021
     */
    fetchFlags() {
      this.$store.dispatch('getCourseFlags', this.course.courseId)
    },


    /**
     * Function getNewNotifications: get messages newer than
     *  newest in store
     *
     * Author: cmc
     *
     * Last Updated: June 26, 2021
     */
    getNewNotifications() {
      this.$store.dispatch('getNewMessages')
    },

    /**
     * Function markAllAsRead: set allRead commit in store
     *
     * Author: cmc
     *
     * Last Updated: May 28, 2021
     */
    markAllAsRead() {
      this.$store.commit('allRead')
    },

    /**
     * function saveFlags: persist flag state in database
     *
     * Author: cmc
     *
     * Last Updated: July 7, 2021
     */
    updateFlags() {
      this.$store.dispatch('updateFlags')
    },

    /**
     * Function updateEnrollment: update enrollment in store
     *
     * Author: cmc
     *
     * Last Updated: October 27, 2020
     */
    updateEnrollment() {
      this.$store.dispatch('updateEnrollment')
    },
  }
}

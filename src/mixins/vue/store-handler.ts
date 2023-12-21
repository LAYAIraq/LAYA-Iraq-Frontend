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
    courseFetch (name: string) {
      const courseName = name || this.$route.params.name // use argument if given, otherwise use router params
      this.$store.dispatch('courseFetch', courseName)
        .then(() => {
          this.enrollmentFetch()
          this.$store.commit('courseUpdatedSet', false)
          document.title = `LAYA | ${this.$store.getters.course.name}`
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
        this.$store.dispatch('enrollmentFetch', this.course.courseId)
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
      this.$store.dispatch('enrollmentUpdate')
    },

    /**
     * Function flagsFetch: Fetch flags for course from vuex
     *
     * Author: cmc
     *
     * Last Updated: July 7, 2021
     */
    flagsFetch () {
      this.$store.dispatch('courseFlagsFetch', this.course.courseId)
    },

    /**
     * function flagsUpdate: persist flag state in database
     *
     * Author: cmc
     *
     * Last Updated: July 7, 2021
     */
    flagsUpdate () {
      this.$store.dispatch('courseFlagsUpdate')
    },

    /**
     * Function notificationsFetch: get notifications newer than
     *  newest in store
     *
     * Author: cmc
     *
     * Last Updated: June 26, 2021
     */
    notificationsFetch () {
      this.$store.dispatch('notificationsFetchNew')
    },

    /**
     * Function notificationsMarkRead: set notificationsReadAll commit in store
     *
     * Author: cmc
     *
     * Last Updated: May 28, 2021
     */
    notificationsMarkRead () {
      this.$store.commit('notificationsReadAll')
    }
  }
}

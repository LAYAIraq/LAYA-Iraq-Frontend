/**
 * Filename: watch-content.ts
 * Use: Add watcher for content to every view, thus updating when data changes
 * Creator: cmc
 * Last Updated: August 23, 2021
 * Dependencies: none
 */

import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters(['courseUpdated', 'storeBusy'])
  },
  // watch: {
  //   content: {
  //     deep: true,
  //     handler() {
  //       console.log('content changed!')
  //       this.fetchData()
  //     }
  //   }
  // }

  watch: {
    courseUpdated (val) {
      if (val) { // set to true
        this.fetchData()
        this.$store.commit('unsetCourseUpdated')
      }
    },
    storeBusy (val) {
      if (!val) {
        console.log('store finished loading!!')
      }
    }
  }
  // created() {
  //   this.$store.commit('unsetCourseUpdated')
  // }
}

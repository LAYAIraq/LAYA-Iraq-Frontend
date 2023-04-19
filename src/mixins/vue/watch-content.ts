/**
 * Filename: watch-content.ts
 * Use: Add watcher for content to every view, thus updating when data changes
 * Creator: cmc
 * Since: v1.1.0
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
        this.$store.commit('courseUpdatedSet', false)
      }
    },
    storeBusy (val) {
      if (!val) {
        console.log('store finished loading!!')
      }
    }
  }
  // created() {
  //   this.$store.commit('courseUpdatedSet', false)
  // }
}

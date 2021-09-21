/**
 * Filename: watch-content.ts
 * Use: Add watcher for content to every view, thus updating when data changes
 * Creator: cmc
 * Last Updated: August 23, 2021
 * Dependencies: none
 */

import { mapGetters } from 'vuex'
export default {
  ...mapGetters(['content']),

  created() { // watch content in vuex store
    this.unwatch = this.$store.watch(
      (state, getters) => getters.content,
      () => {
        this.fetchData() // when updated, re-do deep copying
      },
      { deep: true }
    )
  },

  beforeDestroy() {
    this.unwatch()
  }
}
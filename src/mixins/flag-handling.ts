/**
 * Filename: flag-handling.ts
 * Use: add properties and methods to handle flags in plugin views
 * Creator: cmc
 * Date: August 25, 2021
 * Dependencies: @/src/plugins/misc/flag
 */

export default {
  data () {
    return {
      flagOpen: false
    }
  },
  methods: {
    /**
     * function toggleFlagOpen: atomic to have only one open flag
     * Author: cmc
     * Last Updated: August 23, 2021
     * @param val boolean
     */
    toggleFlagOpen (val) {
      this.flagOpen = val
    }
  }
}

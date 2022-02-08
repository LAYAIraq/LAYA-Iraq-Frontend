/**
 * File: fetch-notifications.ts
 * Use: reuse methods for message fetching
 * Creator: cmc
 * Date: June 26, 2021
 * Dependencies: none
 */

export default {
  methods: {
    /**
     * Function markAllAsRead: set allRead commit in store
     * Author: cmc
     * Last Updated: May 28, 2021
    */
    markAllAsRead () {
      this.$store.commit('allRead')
    },

    /**
     * Function getNewNotifications: get messages newer than
     *  newest in store
     * Author: cmc
     * Last Updated: June 26, 2021
     */
    getNewNotifications () {
      this.$store.dispatch('getNewMessages')
    }
  }
}

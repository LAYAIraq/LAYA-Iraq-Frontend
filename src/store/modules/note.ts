/**
 * Filename: note.ts
 * Use: setting busy for certain frontend components
 * Creator: core
 * Date: unknown
 * Dependencies: none
 */

export default {
  state: {
    busy: false,
    myCourses: 0
  },
  getters: {
    /**
     * function storeBusy: returns true if busy boolean is set
     *
     * Author: cmc
     *
     * Last Updated: January 11, 2021
     * @param state contains busy bool
     * @returns {boolean} true if store is busy
     */
    storeBusy (state: { busy: boolean }) {
      return state.busy
    }
  },
  mutations: {
    /**
     * Function addMyCourse: increment myCourses variable
     *
     * Author: core
     *
     * Last Updated: unknown
     *
     * @param state contains myCourses variable
     */
    addMyCourse (state: { myCourses: number }) {
      state.myCourses++
    },

    /**
     * Function clearMyCourse: set myCourses to 0
     *
     * Author: core
     *
     * Last Updated: unknown
     *
     * @param state contains myCourses
     */
    clearMyCourse (state: { myCourses: number }) {
      state.myCourses = 0
    },

    /**
     * Function setBusy: set busy to given boolean value
     *
     * Author: core
     *
     * Last Updated: January 27, 2022
     *
     * @param state contains busy boolean
     * @param bool boolean value to set
     */
    setBusy (
      state: { busy: boolean },
      bool: boolean
    ) {
      state.busy = bool
    }
  }
}

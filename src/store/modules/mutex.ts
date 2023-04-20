/**
 * Filename: mutex.ts
 * Use: setting busy for certain frontend components
 * Creator: core
 * Since: v1.0.0
 */

export default {
  state: {
    busy: false
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
    storeBusy: (state: { busy: boolean }) => state.busy
  },
  mutations: {
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

/**
 * Filename: choices-common-methods.ts
 * Use: reduce redundancy by sharing common methods
 * Creator: cmc
 * Date: October 17, 2022
 * Dependencies: uuid
 */

import { v4 as uuidv4 } from 'uuid'
export default {
  watch: {
    multiple (val) { // reset solutions when changed to single choice
      if (!val) {
        // eslint-disable-next-line no-return-assign
        this.solutions = this.solutions.map((s, i) => s = false)
      }
    }
  },

  methods: {
    /**
     * Function _delItem(idx): Delete item at given index
     *
     * Author: core
     *
     * Last Updated: unknown
     */
    _delItem (idx) {
      this.options.splice(idx, 1)
    },

    /**
     * Function _addItem: Add item to options
     * Author: core
     * Last Updated: June 28, 2021
     */
    _addItem () {
      this.options.push({
        text: this.y18n('layaLaScmc.edit.sampleOption'),
        flagged: false,
        id: uuidv4()
      })
    }
  }
}

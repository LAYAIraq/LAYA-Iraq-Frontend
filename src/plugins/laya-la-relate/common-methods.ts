/**
 * File: common-methods.ts
 * Use: reduce redundancy by sharing common methods
 * Creator: cmc
 * Date: April 24, 2022
 * Dependencies: uuid
 */

import { v4 as uuidv4 } from 'uuid'
export default {
  methods: {
  /**
   * Function _delPair: remove item at position idx
   *
   * Author: core
   *
   * Last Updated: April 24, 2022 by cmc
   *
   * @param {*} idx index at which to remove
   */
    _delPair (idx) {
      this.pairs.splice(idx, 1)
    },

    /**
     * Function _addPair: add an empty pair
     *
     * Author: core
     *
     * Last Updated: June 28, 2021
     */
    _addPair () {
      this.pairs.push({ img: '', audio: '', relation: -1, label: '', labelSimple: '', flagged: false, id: uuidv4() })
    },

    /**
     * Function _delRelation: remove a relation
     *
     * Author: core
     *
     * Last Updated: unkown
     *
     * @param {*} idx index of relation to remove
     */
    _delRelation (idx) {
      this.relations.splice(idx, 1)
      this.relationsSimple.splice(idx, 1)
    },

    /**
     * Function _addRelation: add an empty relation
     *
     * Author: core
     *
     * Last Updated: unknown
     */
    _addRelation () {
      this.relations.push('')
      this.relationsSimple.push('')
    }
  }
}

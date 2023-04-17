/**
 * Filename: array.ts
 * Use: array manipulation methods
 * Creator: cmc
 * Since: v1.3.0
 */
export default {
  methods: {
    /**
     * @function Add new item to items
     * @author cmc
     * @since v1.3.0
     * @param {*} arr array to add to
     * @param {*} val value to be added
     */
    _itemAdd (arr, val?) {
      arr.push(val ?? {})
    },
    /**
     * @function remove item at position idx
     * @author cmc
     * @since v1.3.0
     * @param {*} arr array to remove from
     * @param {*} idx index at which to remove
     */
    _itemDelete (arr, idx) {
      arr.splice(idx, 1)
    }
  }
}

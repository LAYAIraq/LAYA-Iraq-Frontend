 
import { v4 as uuidv4 } from 'uuid'
export default {
  methods: {
    /**
     * Function _delItem: remove item at position idx
     *
     * Author: core
     *
     * Last Updated: unknown
     *
     * @param {*} idx index at which to remove
     */
    _delItem (idx) {
      this.items.splice(idx, 1)
    },

    /**
     * Function _addItem: Add new item to items
     * Author: core
     * Last Updated: June 6, 2021
     * @param {string} str string to be added
     */
    _addItem (str) {
      this.items.push({ label: str, category: -1, flagged: false, id: uuidv4() })
    },

    /**
     * Function _delCategory: delete category at position idx
     *
     * Author: core
     *
     * Last Updated: unknown
     *
     * @param {*} idx index at which to remove the category
     */
    _delCategory (idx) {
      this.categories.splice(idx, 1)
    },
    /**
     * Function _addCategory: Add new category to categories
     *
     * Author: core
     *
     * Last Updated: unknown
     *
     */
    _addCategory () {
      this.categories.push({})
    }
  }
}

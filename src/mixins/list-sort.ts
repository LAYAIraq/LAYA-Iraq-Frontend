/**
*  Filename: list-sort.ts
*  Use: Define methods for sorting lists
*  Creator: cmc
*  Date: April 28, 2021
*  Dependencies:
*   vuex
*/

import { mapGetters } from 'vuex'
import * as locale from 'src/assets/i18n'
export default {
  computed: {
    ...mapGetters(['profileLang']),

    /**
     * tooltips(): filters i18n file for needed tooltip keys
     *
     * Author: cmc
     *
     * Last Updated: May 5, 2021
     */
    tooltips () {
      // needed keys
      const needed = [
        'listSort.sort',
        'listSort.sortAsc',
        'listSort.sortDesc'
      ]

      // filtered object from i18n
      return Object.keys(locale[this.profileLang])
        .filter(key => needed.includes(key))
        .reduce((obj, key) => {
          return {
            ...obj,
            [key]: locale[this.profileLang][key]
          }
        }, {})
    }
  },
  data () {
    return {
      sortBy: '',
      sortAsc: true
    }
  },
  methods: {
    /**
     * Function sort: sort list
     *
     * Author: cmc
     *
     * Last Updated: April 28, 2021
     *
     * @param {array} _list some array
     * @returns {array} array: Original list if no
     *  sort prop is set, sorted list if it is,
     *  null if input is undefined
     */
    sortList (_list) {
      const list = [..._list]
      const { sortBy, sortAsc } = this
      if (sortBy === '') {
        return _list || null
      } else {
        if (sortAsc) {
          return list.sort((a, b) => a[sortBy] - b[sortBy])
        } else {
          return list.sort((a, b) => b[sortBy] - a[sortBy])
        }
      }
    },

    /**
     * Function sortByProp: sort list by given property
     *
     * Author: cmc
     *
     * Last Updated: April 28, 2021
     *
     * @param {string} prop the property to sort by
     */
    sortByProp (prop) {
      if (this.sortBy === prop) {
        this.toggleSortDir()
      } else {
        this.sortBy = prop
      }
    },

    /**
     * sortIcon: return icon css class depending on how names are sorted
     *
     * Author: cmc
     *
     * Last Updated: April 28, 2021
     *
     * @param {string} prop property which is in column
     */
    sortIcon (prop) {
      return {
        'fas fa-sort-up': this.sortBy === prop && !this.sortAsc,
        'fas fa-sort-down': this.sortBy === prop && this.sortAsc,
        'fas fa-sort': this.sortBy !== prop
      }
    },

    sortTooltip (prop) {
      const propClass = this.sortIcon(prop)
      if (propClass['fas fa-sort-up']) {
        return this.tooltips['listSort.sortAsc']
      } else if (propClass['fas fa-sort-down']) {
        return this.tooltips['listSort.sortDesc']
      } else return this.tooltips['listSort.sort']
    },

    /**
     * Function toggleSortDir: toggle sort direction
     *
     * Author: cmc
     *
     * Last Updated: April 28, 2021
     */
    toggleSortDir () {
      this.sortAsc = !this.sortAsc
    }
  }
}

/**
*  Filename: list-sort.ts
*  Use: Define methods for sorting lists
*  Creator: cmc
*  Since: v1.1.0
*/

import { mapGetters } from 'vuex'
import * as locale from '../../assets/i18n'
export default {
  computed: {
    ...mapGetters(['profileLanguage']),

    /**
     * tooltips(): filters i18n file for needed tooltip keys
     * Author: cmc
     * Since: v1.1.0
     */
    tooltips () {
      // needed keys
      const needed = [
        'listSort.sort',
        'listSort.sortAsc',
        'listSort.sortDesc'
      ]

      // filtered object from i18n
      return Object.keys(locale[this.profileLanguage])
        .filter(key => needed.includes(key))
        .reduce((obj, key) => {
          return {
            ...obj,
            [key]: locale[this.profileLanguage][key]
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
     * Since: v1.1.0
     *
     * @param _list some array
     * @returns Original list if no
     *  sort prop is set, sorted list if it is,
     *  null if input is undefined
     */
    sortList (_list: any[]) {
      const list = [..._list]
      const { sortBy, sortAsc } = this
      if (sortBy === '') {
        return _list || null
      } else {
        return list.sort((a, b) => {
          if (typeof a[sortBy] === 'string' && typeof b[sortBy] === 'string') {
            return sortAsc ? a[sortBy].localeCompare(b[sortBy]) : b[sortBy].localeCompare(a[sortBy])
          } else if (typeof a[sortBy] === 'number' && typeof b[sortBy] === 'number') {
            return sortAsc ? a[sortBy] - b[sortBy] : b[sortBy] - a[sortBy]
          } else {
            return 0
          }
        })
      }
    },

    /**
     * Function sortByProp: sort list by given property
     *
     * Author: cmc
     *
     * Last Updated: April 28, 2021
     *
     * @param prop the property to sort by
     */
    sortByProp (prop: string) {
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
     * @param prop property which is in column
     */
    sortIcon (prop: string) {
      return {
        'fas fa-sort-up': this.sortBy === prop && !this.sortAsc,
        'fas fa-sort-down': this.sortBy === prop && this.sortAsc,
        'fas fa-sort': this.sortBy !== prop
      }
    },

    /**
     * @description return localized tooltip depending on sort direction
     * @author cmc
     * @param prop sort direction string
     */
    sortTooltip (prop: string) {
      const propClass = this.sortIcon(prop)
      if (propClass['fas fa-sort-up']) {
        return this.tooltips['listSort.sortAsc']
      } else if (propClass['fas fa-sort-down']) {
        return this.tooltips['listSort.sortDesc']
      } else return this.tooltips['listSort.sort']
    },

    /**
     * Function toggleSortDir: toggle sort direction
     * Author: cmc
     * Since: v1.1.0
     */
    toggleSortDir () {
      this.sortAsc = !this.sortAsc
    }
  }
}

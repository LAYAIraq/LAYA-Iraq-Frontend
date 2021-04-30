<!-- 
  Filename: list-sort.vue
  Use: Define methods for sorting lists
  Creator: cmc
  Date: April 28, 2021
  Dependencies: 
    vuex
-->
<script>
import { mapGetters } from 'vuex'
import * as locale from '@/i18n/list-sort'
export default {
  computed: {
    ...mapGetters(['profileLang']),
    tooltips() {
      return locale[this.profileLang]
    }
  },
  data() {
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
    sortList(_list) {
      let list = [..._list]
      const { sortBy, sortAsc } = this
      if (sortBy === '') {
        return _list ? _list : null
      }
      else {
        if (sortAsc) {
          return list.sort((a,b) => a[sortBy] < b[sortBy])
        }
        else {
          return list.sort((a,b) => a[sortBy] >= b[sortBy])
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
    sortByProp(prop) {
      if (this.sortBy === prop) {
        this.toggleSortDir()
      }
      else {
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
    sortIcon(prop) {
      return {
        'fas fa-sort-up': this.sortBy === prop && !this.sortAsc,
        'fas fa-sort-down': this.sortBy === prop && this.sortAsc,
        'fas fa-sort': this.sortBy !== prop
      }
    },

    sortTooltip(prop) {
      let propClass = this.sortIcon(prop)
      if(propClass['fas fa-sort-up']){
        return this.tooltips.sortDesc
      }
      else if (propClass['fas fa-sort-down']) {
        return this.tooltips.sortAsc
      }
      else return this.tooltips.sort
    },

    /**
     * Function toggleSortDir: toggle sort direction
     * 
     * Author: cmc
     * 
     * Last Updated: April 28, 2021
     */
    toggleSortDir() {
      this.sortAsc = !this.sortAsc
    }
  }
}
</script>
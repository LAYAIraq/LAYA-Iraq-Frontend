/**
 * Filename: check-flags.js
 * Use: check flags when viewing a content block
 * Creator: cmc
 * Date: July 7, 2021
 * Dependencies: vuex
 */
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters(['courseFlags'])
  },
  data() {
    return {
      flaggables: []
    }
  },

  beforeMount () {
    this.populateFlaggables()
  },

  methods: {
    /**
     * function checkFlags: check if flaggable props have a flag, set
     *  flagged to true if yes
     * Author: cmc
     * Last Updated: July 7, 2021
     */
    checkFlags() {
      for (let elem of this.flaggables) {
        for (const flag of this.courseFlags) {
          if (flag.referenceId === elem.id) {
            elem.flagged = true
            break
          }
        }
      }
    },

    populateFlaggables() {
      this.$data.forEach(elem => {
        if(Object.prototype.hasOwnProperty
          .call(elem, 'flagged')) {
          this.flaggables.push(elem)
        } else if (Array.isArray(elem)) {
          elem.forEach(child => {
            if(Object.prototype.hasOwnProperty
              .call(child, 'flagged')) {
              this.flaggables.push(child)
            }
          })
        } else {
          console.log('Item is not flaggable: ', elem)
        }
      })
    }
  }
}
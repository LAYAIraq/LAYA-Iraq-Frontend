/**
 * Filename: routes.ts
 * Use: inject properties for route dependent props
 * Creator: cmc
 * Since: v1.1.0
 */
import { mapGetters } from 'vuex'

export default {
  props: {
    coursePath: { // TODO: revise for repeated routes https://router.vuejs.org/guide/essentials/route-matching-syntax#Repeatable-params
      type: String,
      default () {
        return ''
      }
    },
    name: {
      type: String,
      default () {
        return ''
      }
    },
    chapters: {
      type: Array,
      default () {
        return []
      }
    },
    slug: {
      type: String,
      default () {
        return ''
      }
    },
    step: {
      type: String,
      default () {
        return ''
      }
    }
  },
  computed: {
    ...mapGetters(['courseContent', 'courseContentPathId']),
    /**
     * contentToDisplay: return current content block
     *
     * Author: cmc
     *
     * Last Updated: October 27, 2020
     */
    contentToDisplay () {
      return this.courseContent[this.pathId]
    },
    pathId () {
      return this.courseContentPathId(this.coursePath)
    }
  }
}

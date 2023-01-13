/**
 * Filename: route-props.ts
 * Use: inject properties for route dependent props
 * Creator: cmc
 * Date: February 8, 2022
 * Dependencies: none
 */
import { mapGetters } from 'vuex'

export default {
  props: {
    coursePath: {
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
      type: String,
      default () {
        return ''
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
    ...mapGetters(['courseContentPathId']),
    pathId () {
      return this.courseContentPathId(this.coursePath)
    }
  }
}

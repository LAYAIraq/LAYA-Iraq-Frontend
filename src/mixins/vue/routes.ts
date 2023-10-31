/**
 * Filename: routes.ts
 * Use: inject properties for route dependent props
 * Creator: cmc
 * Since: v1.1.0
 */
import { mapGetters } from 'vuex'

export default {
  props: {
    coursePath: {
      type: [Array, String],
      default () {
        return []
      }
    },
    name: {
      type: String,
      default () {
        return ''
      }
    }
  },
  computed: {
    ...mapGetters(['courseContent', 'courseContentPathId', 'courseRoutes']),
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
    /**
     * @description return path as list of strings
     * @author cmc
     * @since v1.3.1
     * @returns list of sub-chapters
     */
    pathChapters () {
      return Array.isArray(this.coursePath) ? this.coursePath : this.coursePath.split('/')
    },
    /**
     * @description return true if coursePath prop is the full path of the content ID
     * @author cmc
     * @since v1.3.1
     * @returns if path is the full path for the pathId
     */
    pathChaptersFull () {
      return this.pathChapters.length === this.courseRoutes[this.pathId].length
    },
    /**
     * @description return id for content block with current path
     * @author cmc
     * @since v1.3.1
     * @returns id of content
     */
    pathId () {
      return this.courseContentPathId(this.pathChapters)
    }
  },
  methods: {
    /**
     * @description replaces route with the full path (including sub-chapters) if it's just a fraction
     * @author cmc
     * @since v1.3.1
     */
    routeNormalize () {
      if (!(this.pathChapters.length === this.courseRoutes[this.pathId].length) && this.pathId !== this.courseStart) {
        this.$router.replace({ params: { name: this.name, coursePath: this.courseRoutes(this.pathId) } })
      }
    }
  }
}

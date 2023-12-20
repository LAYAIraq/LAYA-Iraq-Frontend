/**
 * Filename: routes.ts
 * Use: inject properties for route dependent props
 * Creator: cmc
 * Since: v1.1.0
 */
import { mapGetters } from 'vuex'
import { slugify } from '@/mixins/general/slugs'

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
    ...mapGetters(['course', 'courseContent', 'courseContentPathId', 'courseRoutes', 'courseStart']),
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
      return this.courseRoutes && this.courseRoutes[this.pathId]
        ? this.pathChapters.length === this.courseRoutes[this.pathId].length
        : null
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
  watch: {
    pathChaptersFull (val: boolean) {
      if (!val && this.pathChapters.length > 0) { // avoid re-evaluation when pathChapters is empty list
        this.routeNormalize()
      }
    }
  },
  methods: {
    /**
     * @description replaces route with the full path (including sub-chapters) unless it's the course start
     * @author cmc
     * @since v1.3.1
     */
    routeNormalize () {
      if (!this.pathChaptersFull) {
        this.$router.replace({
          params: {
            name: slugify(this.course.name),
            coursePath: this.pathId === this.courseStart
              ? []
              : this.courseRoutes[this.pathId]
          }
        })
      }
    }
  }
}

/**
 * Filename: plugin-view.ts
 * Use: inject properties for plugin view component
 * Creator: cmc
 * Since: v1.1.0
 */

import { mapGetters } from 'vuex'

export default {
  props: {
    nextContent: {
      type: [Array, String],
      default () {
        return () => {}
      }
    },
    viewData: {
      type: Object,
      default () { return null }
    },
    editPreview: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters(['courseContentIdRouteMap']),
    onFinish () {
      if (Array.isArray(this.nextContent)) {
        return () => {
          const routes = []
          this.nextContent.forEach((id: string) => {
            routes.push(() => this.$router.push({ path: this.courseContentIdRouteMap[id] }))
          })
        }
      } else {
        return () => this.$router.push({ path: this.courseContentIdRouteMap[this.nextContent] })
      }
    }

  }
}

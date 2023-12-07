/**
 * Filename: plugin-view.ts
 * Use: inject properties for plugin view component
 * Creator: cmc
 * Since: v1.1.0
 */
import { mapGetters } from 'vuex'

export default {
  props: {
    viewData: {
      type: Object,
      required: true
    },
    editPreview: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters(['courseEnd', 'enrollment']),
    lastContentBlock () {
      return this.courseEnd === this.viewData.id
    }
  }
}

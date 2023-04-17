/**
 * Filename: view-plugin-props.ts
 * Use: inject properties for plugin view component
 * Creator: cmc
 * Since: v1.1.0
 */

export default {
  props: {
    onFinish: {
      type: [Function, Array],
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
  }
}

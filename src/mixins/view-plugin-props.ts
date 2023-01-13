/**
 * Filename: view-plugin-props.ts
 * Use: inject properties for plugin view component
 * Creator: cmc
 * Date: February 8, 2022
 * Dependencies: none
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

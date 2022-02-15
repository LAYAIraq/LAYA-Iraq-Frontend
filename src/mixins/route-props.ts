/**
 * Filename: route-props.ts
 * Use: inject properties for route dependent props
 * Creator: cmc
 * Date: February 8, 2022
 * Dependencies: none
 */

export default {
  props: {
    name: {
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
  }
}

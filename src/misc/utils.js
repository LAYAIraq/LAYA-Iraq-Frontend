/**
 * Filename: utils.js
 * Use: Gives functions that are used in several components
 * Author: core
 * Date: unknown
 * Dependencies: none
 */

export default {

  /**
   * Function categorize: push list from arr to target, if exists
   *
   * Author: core
   *
   * Last Updated: March 12, 2021
   * @param {*} arr source array
   * @param {*} target target array
   * @param {*} key the key that should be copied
   */
  categorize (arr, target, key) {
    if (!arr) return
    arr.forEach(data => {
      const { category } = data
      if (!target[category]) {
        target[category] = {}
        target[category][key] = []
      }
      if (!target[category][key]) {
        target[category][key] = []
      }
      target[category][key].push(data)
    })
  },

  /**
   * Function fileSize: verbalize file size
   *
   * Author: cmc
   *
   * Last Updated: April 1, 2021
   * @param {number} size size of a file
   * @returns a string making the size human-readable
   */
  fileSize (size) {
    if (size > 1024 * 1024) {
      const mbsize = Math.round(size / 1024 / 1024 * 10) / 10
      return `${mbsize} MBytes`
    } else if (size > 1024) {
      const kbsize = Math.round(size / 1024 * 10) / 10
      return `${kbsize} kBytes`
    } else {
      return `${size} Bytes`
    }
  }
}

/**
 * @description strips key from object, return new object w/o key
 * @param key - the key to strip
 * @param obj - object containing `key`
 * @returns object without `key`
 */
export const stripKey = (key, obj) => {
  return (({ [key]: any, ...o }) => o)(obj)
}

/**
 * @description deep copy an object, intended for use with vuex references
 * @author cmc
 * @param obj - object to copy
 * @return {any} - deep copy of obj
 */
export const deepCopy = (obj) => {
  return JSON.parse(JSON.stringify(obj))
}

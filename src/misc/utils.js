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
      const {category} = data
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
  fileSize(size) {
    if(size>1024*1024){
      let mbsize = Math.round(size/1024/1024 *10) /10
      return `${mbsize} MBytes`
    }
    else if (size>1024){
      let kbsize = Math.round(size/1024 *10) /10
      return `${kbsize} kBytes`
    }
    else {
      return `${size} Bytes`
    }
  }
}



/**
 * Filename: utils.js
 * Use: Gives functions that are used in several components
 * Author: core
 * Date: unknown
 * Dependencies: none
 */

export default {

  /**
   * Function shortDate: Shorten date to DD-MM-YY
   * 
   * Author: core
   * 
   * Last Updated: March 12, 2021
   * 
   * @param {*} dateStr given date as string
   * @param {*} lang interface language, hard set as 'de'
   * @returns Localized date string
   */
  shortDate(dateStr, lang = 'de') {
    return new Date(Date.parse(dateStr))
      .toLocaleDateString(lang, {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit'
      })
  },

  /**
   * Function locDate: localize given date string
   * 
   * Author: core
   * 
   * Last Updated: March 12, 2021
   * @param {*} dateStr date given as string
   * @param {*} lang language given as string
   */
  locDate(dateStr, lang) {
    return new Date(Date.parse(dateStr))
      .toLocaleDateString(lang)
  },

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
   * Function verbalizeTime: puts time that users spent in words (English only)
   * 
   * Author: cmc
   * 
   * Last Updated: March 12, 2021
   * @param {*} time time in ms
   */
  verbalizeTime(time) {
    var days = Math.floor(time/1000/60/60/24);
    time -= days*1000*60*60*24

    var hours = Math.floor(time/1000/60/60);
    time -= hours*1000*60*60

    var minutes = Math.floor(time/1000/60);
    time -= minutes*1000*60

    var seconds = Math.floor(time/1000);
    return `${days}d ${hours}h ${minutes}m ${seconds}s`

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



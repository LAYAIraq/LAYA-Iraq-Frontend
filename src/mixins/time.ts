/**
 * Filename: time.ts
 * Use: provide localized timestamps
 * Author: cmc
 * Date: June 1, 2021
 * Dependencies: none
*/
export default {

  methods: {
    /**
     * function timeSince: returns a worded timestamp
     *  aka "some seconds ago"
     *
     * Author: cmc
     *
     * Last Updated: October 19, 2021
     * @param {number|string} timeStamp a date
     */
    timeSince (timeStamp) {
      const now = Date.now()
      const newTimeStamp = typeof (timeStamp) === 'number' ? timeStamp : Date.parse(timeStamp)
      const secondsPast = (now - newTimeStamp) / 1000
      if (secondsPast < 60) {
        return this.i18n['time.secondsPast'].replace('<T>', Math.round(secondsPast))
      } else if (secondsPast < 3600) {
        return this.i18n['time.minutesPast'].replace('<T>', Math.round(secondsPast / 60))
      } else if (secondsPast <= 86400) {
        return this.i18n['time.hoursPast'].replace('<T>', Math.round(secondsPast / 3600))
      } else if (secondsPast <= 604800) {
        return this.i18n['time.daysPast'].replace('<T>', Math.round(secondsPast / 86400))
      } else if (secondsPast <= 2592000) {
        return this.i18n['time.weeksPast'].replace('<T>', Math.round(secondsPast / 604800))
      } else if (secondsPast <= 31104000) {
        return this.i18n['time.monthsPast'].replace('<T>', Math.round(secondsPast / 2592000))
      } else {
        return this.i18n['time.moreThanYear']
      }
    },

    /**
     * Function shortDate: Shorten date to DD-MM-YY
     *
     * Author: core
     *
     * Last Updated: March 12, 2021
     *
     * @param {*} dateStr given date as string
     * @returns Localized date string
     */
    shortDate (dateStr) {
      return new Date(Date.parse(dateStr))
        .toLocaleDateString(this.profileLang, {
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
     */
    locDate (dateStr) {
      return new Date(Date.parse(dateStr))
        .toLocaleDateString(this.profileLang)
    },

    /**
     * Function locTime: localize given date string
     *
     * Author: cmc
     *
     * Last Updated: May 27, 2021
     * @param {*} dateStr date given as string
     */
    locTime (dateStr) {
      return new Date(Date.parse(dateStr))
        .toLocaleTimeString(this.profileLang, {
          hour: '2-digit',
          minute: '2-digit'
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
    verbalizeTime (time) {
      const days = Math.floor(time / 1000 / 60 / 60 / 24)
      time -= days * 1000 * 60 * 60 * 24

      const hours = Math.floor(time / 1000 / 60 / 60)
      time -= hours * 1000 * 60 * 60

      const minutes = Math.floor(time / 1000 / 60)
      time -= minutes * 1000 * 60

      const seconds = Math.floor(time / 1000)
      return `${days}d ${hours}h ${minutes}m ${seconds}s`
    }
  }
}

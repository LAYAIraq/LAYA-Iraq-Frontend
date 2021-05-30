<script>
export default {

  methods: {
    /**
     * function timeSince: returns a worded timestamp
     *  aka "some seconds ago"
     * Author: cmc
     * Last Updated: May 30, 2021
     */
    timeSince(timeStamp) {
      let now = new Date()
      let newTimeStamp = Date.parse(timeStamp)
      let secondsPast = (now - newTimeStamp) / 1000;
      let timePast = 0
      if (secondsPast < 60) {
        timePast = parseInt(secondsPast)
        return this.i18n['time.secondsPast'].replace('<T>', timePast)
      }
      else if (secondsPast < 3600) {
        timePast = parseInt(secondsPast / 60)
        return this.i18n['time.minutesPast'].replace('<T>', timePast)
      }
      else if (secondsPast <= 86400) {
        timePast = parseInt(secondsPast / 3600)
        return this.i18n['time.hoursPast'].replace('<T>', timePast)
      }
      else if (secondsPast <= 604800) {
        timePast = parseInt(secondsPast / 86400)
        return this.i18n['time.daysPast'].replace('<T>', timePast)
      }
      else if (secondsPast <= 2592000) {
        timePast = parseInt(secondsPast / 604800)
        return this.i18n['time.weeksPast'].replace('<T>', timePast)
      }
      else if (secondsPast <= 31104000) {
        timePast = parseInt(secondsPast / 2592000)
        return this.i18n['time.monthsPast'].replace('<T>', timePast)
      }
      else {
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
     * @param {*} lang interface language, hard set as 'de'
     * @returns Localized date string
     */
    shortDate(dateStr) {
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
     * @param {*} lang language given as string
     */
    locDate(dateStr) {
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
     * @param {*} lang language given as string
     */
    locTime(dateStr) {
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
    verbalizeTime(time) {
      var days = Math.floor(time/1000/60/60/24);
      time -= days*1000*60*60*24

      var hours = Math.floor(time/1000/60/60);
      time -= hours*1000*60*60

      var minutes = Math.floor(time/1000/60);
      time -= minutes*1000*60

      var seconds = Math.floor(time/1000);
      return `${days}d ${hours}h ${minutes}m ${seconds}s`
    }
  }
}
</script>
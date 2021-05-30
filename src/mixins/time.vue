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
      timeStamp = Date.parse(timeStamp)
      let secondsPast = (now.getTime() - timeStamp) / 1000;
      if (secondsPast < 60) {
        return parseInt(secondsPast) + 's';
      }
      if (secondsPast < 3600) {
        return parseInt(secondsPast / 60) + 'm';
      }
      if (secondsPast <= 86400) {
        return parseInt(secondsPast / 3600) + 'h';
      }
      if (secondsPast > 86400) {
        let day = timeStamp.getDate();
        let month = timeStamp.toDateString().match(/ [a-zA-Z]*/)[0].replace(" ", "");
        let year = timeStamp.getFullYear() == now.getFullYear() ? "" : " " + timeStamp.getFullYear();
        return day + " " + month + year;
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
     * Function locTime: localize given date string
     * 
     * Author: cmc
     * 
     * Last Updated: May 27, 2021
     * @param {*} dateStr date given as string
     * @param {*} lang language given as string
     */
    locTime(dateStr, lang) {
      return new Date(Date.parse(dateStr))
        .toLocaleTimeString(lang)
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
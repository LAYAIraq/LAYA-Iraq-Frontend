export default {

  shortDate (dateStr, lang = 'de') {
    return new Date(Date.parse(dateStr))
      .toLocaleDateString(lang, {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit'
      })
  },

  locDate (dateStr, lang = 'de') {
    return new Date(Date.parse(dateStr))
      .toLocaleDateString(lang)
  },

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

  verbalizeTime (time) {
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

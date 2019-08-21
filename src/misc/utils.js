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
  }
}

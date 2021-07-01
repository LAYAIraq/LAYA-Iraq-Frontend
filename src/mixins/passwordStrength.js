/**
 * Filename: passwordStrength.js
 * Use: Provide feedback regarding password strength
 * Author: pj
 * Date: June 28, 2021
 * Dependencies: none
 */

export default {

  methods: {
    pwdStrength ({ suggestions, warning }) {
      if (this.repeatPwd !== '') {
        let k, j// check for different language
        for (j = 0; j < this.possibleWarnings.length; j++) {
          if (warning === this.possibleWarnings[j]) {
            warning = this.i18n['pwdLanguageSwitchWarning' + j]
          }
        }
        for (j = 0; j < suggestions.length; j++) {
          for (k = 0; k < this.possibleSuggestions.length; k++) {
            if (suggestions[j] === this.possibleSuggestions[k]) {
              suggestions[j] = this.i18n['pwdLanguageSwitchSuggestion' + k]
            }
          }
        }

        if (warning.length !== 0) {
          warning = warning.concat('. ') // fix punctuation
        }
        let i
        for (i = 0; i < suggestions.length; i++) {
          warning = warning.concat(' ' + suggestions[i])
          if (warning[warning.length - 1] !== '.') {
            warning = warning.concat('.') // fix punctuation
          }
        }

        document.getElementById('testPwdMeter').innerHTML = warning
      } else {
        document.getElementById('testPwdMeter').innerHTML = ''
      }
    }
  }
}

/**
 * Filename: passwordStrength.js
 * Use: Provide feedback regarding password strength
 * Author: pj
 * Date: June 28, 2021
 * Dependencies: none
 */

export default {

  data() {
    return {
      possibleWarnings: ['Straight rows of keys are easy to guess', 'Short keyboard patterns are easy to guess', 'Repeats like "aaa" are easy to guess',
        'Repeats like "abcabcabc" are only slightly harder to guess than "abc"', 'Sequences like abc or 6543 are easy to guess',
        'Recent years are easy to guess', 'Dates are often easy to guess', 'This is a top-10 common password', 'This is a top-100 common password',
        'This is a very common password', 'This is similar to a commonly used password', 'A word by itself is easy to guess',
        'Names and surnames by themselves are easy to guess', 'Common names and surnames are easy to guess'], // length = 14
      possibleSuggestions: ['Use a few words, avoid common phrases', 'No need for symbols, digits, or uppercase letters',
        'Add another word or two. Uncommon words are better.', 'Use a longer keyboard pattern with more turns', 'Avoid repeated words and characters',
        'Avoid sequences', 'Avoid recent years', 'Avoid years that are associated with you', 'Avoid dates and years that are associated with you',
        "Capitalization doesn't help very much", 'All-uppercase is almost as easy to guess as all-lowercase', "Reversed words aren't much harder to guess",
        "Predictable substitutions like '@' instead of 'a' don't help very much"], // length = 13
      warnings: ''
    }
  },

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

        this.warnings = warning
      } else {
        this.warnings = ''
      }
    }
  }
}

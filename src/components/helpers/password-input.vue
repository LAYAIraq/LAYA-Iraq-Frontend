<template>
  <div class="pwd-input">
    <!-- Password -->
    <div class="form-group row">
      <div class="col-5">
        <span
          id="pwd-label"
          :class="`col-${labelWidth}`"
        >
          <div
            class="row"
            style="position:relative; top:-20px;"
          >
            <label>
              <i class="fas fa-key"></i>
              {{ newInput? y18n('profile.newPassword'): y18n('passwordPH') }}
            </label>
          </div>
        </span>
      </div>
      <div class="col-7">
        <password
          v-model="pwdSet"
          class="pwd-input"
          :class="langIsAr? 'reverse': ''"
          :default-class="'form-control'"
          :label-hide="y18n('password.hide')"
          :label-show="y18n('password.show')"
          :secure-length="Number(secureLength)"
          :placeholder="newInput? y18n('profile.newPassword'): y18n('passwordPH')"
          :toggle="!langIsAr"
          :badge="!langIsAr"
          @feedback="pwdHints"
          @score="setPwdStrength"
        ></password>
        <strong
          v-if="showWordedStrength"
          class="form-text text-center"
        >
          {{ wordedPwdStrength }}
        </strong>
      </div>
    </div>

    <!-- repeat password -->
    <div class="form-group row">
      <div class="col-5">
        <span
          id="repeat-label"
          for="repeatPwd"
          :class="`col-${labelWidth}`"
          class="col-form-label"
        >
          <div
            class="row"
            style="position:relative; top:-20px;"
          >
            <label>
              <i class="fas fa-redo-alt"></i>
              {{ y18n('password2PH') }}
            </label>
          </div>
        </span>
      </div>

      <div class="col-7">
        <input
          id="repeatPwd"
          v-model="pwdRepeat"
          type="password"
          class="form-control"
          :placeholder="y18n('password2PH')"
        >
      </div>
    </div>

    <!-- password suggestions -->
    <div
      v-if="showPasswordSuggestions && warnings.length !== 0"
      class="form-group row"
    >
      <div
        :class="`col-${labelWidth}`"
        class="col-form-label d-inline-block"
      >
        <span v-if="labelIconsOnly">
          <i
            v-b-tooltip.auto
            class="fas fa-lightbulb"
            :title="y18n('profile.passwordSuggestion')"
          ></i>
        </span>
        <span v-else>
          {{ y18n('profile.passwordSuggestion') }}
        </span>
      </div>
      <div
        id="suggestions"
        class="col"
      >
        <strong
          id="pwd-suggestions"
          class="form-text text-center"
        >
          {{ warnings }}
        </strong>
      </div>
    </div>

    <!-- error messages -->
    <div
      v-if="!pwdSecureLength || !pwdMatch"
      class="form-group row"
    >
      <div
        :class="`col-${labelWidth}`"
        class="col-form-label d-inline-block"
      >
        <span v-if="labelIconsOnly">
          <i
            v-b-tooltip.auto
            class="fas fa-exclamation-triangle"
            :title="y18n('password.error')"
          ></i>
        </span>
        <span v-else>
          {{ y18n('password.error') }}
        </span>
      </div>
      <div
        id="errors"
        class="col"
      >
        <strong
          id="pwd-diff-msg"
          class="form-text text-center"
        >
          {{ pwdDiffMsg }}
        </strong>
        <strong
          id="pwd-not-secure"
          class="form-text text-center"
        >
          {{ pwdSecureLengthNotReachedMsg }}
        </strong>
      </div>
    </div>
  </div>
</template>

<script>
import Password from 'vue-password-strength-meter'
import { locale } from '@/mixins'
import { mapGetters } from 'vuex'

export default {
  name: 'PasswordInput',
  components: {
    Password
  },
  mixins: [
    locale
  ],
  props: {
    /* input password */
    inputPwd: {
      type: String,
      default () {
        return ''
      }
    },
    /* repeat input password */
    inputPwdRepeat: {
      type: String,
      default () {
        return ''
      }
    },
    /* boolean for label output */
    labelIconsOnly: {
      type: Boolean,
      default () { return false }
    },
    /* width of labeling, uses bootstrap col widths */
    labelWidth: {
      type: Number,
      default () { return 3 }
    },
    /* boolean if it's a new password */
    newInput: {
      type: Boolean,
      default () { return false }
    },
    /* secure pwd length, shows indicator if input is below */
    secureLength: {
      type: Number,
      default () { return 8 }
    },
    /* boolean for showing verbal output */
    showWordedStrength: {
      type: Boolean,
      default () { return true }
    },
    /* boolean for showing suggestions to improve password */
    showPasswordSuggestions: {
      type: Boolean,
      default () { return true }
    }

  },
  data () {
    return {
      passwordStrength: null,
      possibleWarnings: [
        'Straights of keys are easy to guess',
        'Short keyboard patterns are easy to guess',
        'Repeats like "aaa" are easy to guess',
        'Repeats like "abcabcabc" are only slightly harder to guess than "abc"',
        'Sequences like abc or 6543 are easy to guess',
        'Recent years are easy to guess',
        'Dates are often easy to guess',
        'This is a top-10 common password',
        'This is a top-100 common password',
        'This is a very common password',
        'This is similar to a commonly used password',
        'A word by itself is easy to guess',
        'Names and surnames by themselves are easy to guess',
        'Common names and surnames are easy to guess'
      ], // length = 14
      possibleSuggestions: [
        'Use a few words, avoid common phrases',
        'No need for symbols, digits, or uppercase letters',
        'Add another word or two. Uncommon words are better.',
        'Use a longer keyboard pattern with more turns',
        'Avoid repeated words and characters',
        'Avoid sequences', 'Avoid recent years',
        'Avoid years that are associated with you',
        'Avoid dates and years that are associated with you',
        'Capitalization doesn\'t help very much',
        'All-uppercase is almost as easy to guess as all-lowercase',
        'Reversed words aren\'t much harder to guess',
        'Predictable substitutions like \'@\' instead of \'a\' don\'t help very much'
      ], // length = 13
      warnings: ''
    }
  },

  computed: {
    ...mapGetters([
      'password',
      'passwordRepeat'
    ]),

    /**
     * inputWidth: returns number for matching label in bootstrap
     *
     * Author: cmc
     *
     * Last Updated: January 18, 2021
     * @returns {number} 12 - labelWidth
     */
    inputWidth () {
      return 12 - this.labelWidth
    },

    /**
     * pwdDiffMsg: returns a message if passwords differ
     *
     * Author: cmc
     *
     * Last Updated: March 24, 2021
     */
    pwdDiffMsg () {
      return !this.pwdMatch ? this.y18n('profile.passwordDiffer') : ''
    },

    /**
     * pwdMatch: returns true if passwords are identical
     *
     * Author: cmc
     *
     * Last Updated: January 17, 2021
     * @returns {boolean} true if passwords match
     */
    pwdMatch () {
      return this.pwdSet === this.pwdRepeat
    },

    /**
     * pwdRepeat: get and set store property passwordRepeat
     *  this is used b/c of unusual behavior when using props
     *
     *  Author: cmc
     *
     *  Last Updated: January 17, 2021
     */
    pwdRepeat: {
      get () {
        return this.passwordRepeat
      },
      set (input) {
        this.$store.commit('passwordRepeatSet', input)
      }
    },

    /**
     * pwdSecureLength: return true if password exceeds minimum length
     *
     * Author: cmc
     *
     * Last Updated: January 18, 2022
     * @returns {boolean} true if password if sufficiently long
     */
    pwdSecureLength () {
      return this.pwdSet.length >= this.secureLength
    },

    /**
     * pwdSecureLengthNotReachedMsg: return message if password is not long enough
     *
     * Author: cmc
     *
     * Last Updated: January 18, 2022
     * @returns {string} message that pwd is not long enough
     */
    pwdSecureLengthNotReachedMsg () {
      return !this.pwdSecureLength
        ? this.y18n('password.secureLengthNotReached')
        : ''
    },

    /**
     * pwdSet: get and set store property password
     *  this is used b/c of unusual behavior when using props
     *
     *  Author: cmc
     *
     *  Last Updated: January 17, 2021
     */
    pwdSet: {
      get () {
        return this.password
      },
      set (input) {
        this.$store.commit('passwordSet', input)
      }
    },

    // /**
    //  * showSuggestions: boolean to show suggestions
    //  *
    //  * Author: cmc
    //  *
    //  * Last Updated: September 22, 2021
    //  * @returns {boolean} true if any of the suggestions aren't empty,
    //  *  but not all
    //  */
    // showSuggestions () {
    //   return (
    //     this.warnings !== '' ||
    //       this.pwdDiffMsg !== '' ||
    //       this.pwdMsg !== '') &&
    //     (this.warnings !== this.pwdDiffMsg)
    // },

    /**
     * wordedPwdStrength(): word pwd strength for linguistic support
     *
     * Author: cmc
     *
     * Last Updated: September 22, 2021
     * @returns {string} password strength in locale
     */
    wordedPwdStrength () {
      return this.passwordStrength != null
        ? this.y18n(`passwordStrength${this.passwordStrength}`)
        : ''
    }
  },

  watch: {
    pwdMatch () {
      this.$emit('compliantLength', this.pwdSecureLength)
    }
  },

  methods: {
    /**
     * function pwdHints: word zxvn warnings, suggestions in user locale
     *
     * Author: pj
     *
     * Last Updated: April 5, 2022 by cmc
     * @param suggestions
     * @param warning
     */
    pwdHints ({ suggestions, warning }) {
      if (this.pwdRepeat !== '') { // start checking when user repeated password
        for (const j in this.possibleWarnings) {
          if (warning === this.possibleWarnings[j]) {
            warning = this.i18n['passwordLanguageSwitchWarning' + j]
          }
        }
        for (const j in suggestions) {
          for (const k in this.possibleSuggestions) {
            if (suggestions[j] === this.possibleSuggestions[k]) {
              suggestions[j] = this.i18n['passwordLanguageSwitchSuggestion' + k]
            }
          }
        }
        if (warning.length !== 0) {
          warning = warning.concat('. ') // fix punctuation
        }
        for (const i in suggestions) {
          warning = warning.concat(' ' + suggestions[i])
          if (warning[warning.length - 1] !== '.') {
            warning = warning.concat('.') // fix punctuation
          }
        }

        this.warnings = warning
      } else {
        this.warnings = ''
      }
    },
    /**
     * function setPwdStrength: set passwordStrength data property
     *
     * Author: cmc
     *
     * Last Updated: September 22, 2021
     */
    setPwdStrength (num) {
      this.passwordStrength = num
    }

  }
}

</script>

<style scoped>
.form-group {
  display: flex;
  flex-wrap: wrap;
}

.pwd-input {
  max-width: 1200px !important;
}

.reverse > * > * {
  right: 85% !important;
}
</style>

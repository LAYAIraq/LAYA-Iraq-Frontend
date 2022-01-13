<template>
  <div class="laya-pwd-input">
    <!-- Password -->
    <div class="form-group">
      <span
        id="pwd-label"
        :class="`col-${labelWidth}`"
        class="col-form-label"
      >
        <span v-if="labelIconsOnly">
           <i
             class="fas fa-key"
             :title="newInput? i18n['profile.newPwd']: i18n['pwdPH']"
             v-b-tooltip.auto
           ></i>
        </span>
        <span v-else>
           {{ newInput? i18n['profile.newPwd']: i18n['pwdPH'] }}
        </span>

      </span>
      <div class="col">
        <password
          :class="langIsAr? 'reverse': ''"
          v-model="inputPwd"
          :defaultClass="'form-control'"
          :label-hide="i18n['password.hide']"
          :label-show="i18n['password.show']"
          :secure-length="Number(secureLength)"
          :placeholder="newInput? i18n['profile.newPwd']: i18n['pwdPH']"
          :toggle="!langIsAr"
          :badge="!langIsAr"
          aria-describedby="pwd-label"
          @feedback="pwdStrength"
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
    <div class="form-group">
      <label
        id="repeat-label"
        for="repeatPwd"
        :class="`col-sm-${labelWidth}`"
        class="col-form-label"
      >
        <span v-if="labelIconsOnly">
           <i
             class="fas fa-redo-alt"
             :title="i18n['pwd2PH']"
             v-b-tooltip.auto
           ></i>
        </span>
        <span v-else>
          {{ i18n['pwd2PH'] }}
        </span>
      </label>
      <div class="col">
        <input
          id="repeatPwd"
          type="password"
          class="form-control w-100"
          v-model="inputPwdRepeat"
          :placeholder="i18n['pwd2PH']"
          aria-describedby="repeat-label"
        >
      </div>
    </div>

    <!-- password suggestions -->
    <div
      v-if="showSuggestions"
      class="form-group"
    >
      <div
        :class="`col-${labelWidth}`"
        class="col-form-label d-inline-block"
      >
        <span v-if="labelIconsOnly">
           <i
             class="fas fa-lightbulb"
             :title="i18n['profile.pwdSuggestion']"
             v-b-tooltip.auto
           ></i>
        </span>
        <span v-else>
          {{ i18n['profile.pwdSuggestion'] }}
        </span>
      </div>
      <div
        class="col"
        id="pwd-suggestions"
      >
        <strong
          id="testPwdMeter"
          class="form-text text-center">
          {{ warnings }}
        </strong>

        <strong
          id="pwdDiffMsg"
          class="form-text text-center"
        >
          {{ pwdDiffMsg }}
        </strong>
      </div>
    </div>

<!--    <password-->
<!--      id="pwdMeter-2"-->
<!--      v-model="pwd"-->
<!--      :strength-meter-only="true"-->
<!--      :secure-length="Number(8)"-->
<!--      @feedback="pwdStrength"-->
<!--      @score="setPwdStrength"-->
<!--    ></password>-->
<!--    <strong class="form-text text-center">-->
<!--      {{ wordedPwdStrength }}-->
<!--    </strong>-->
  </div>
</template>

<script>
import Password from 'vue-password-strength-meter'
import { locale } from '@/mixins'

export default {
  name: 'LayaPasswordInput',
  components: {
    Password
  },
  mixins: [
    locale
  ],
  props: {
    /* input passwords to calculate strength */
    inputPwd: String,
    inputPwdRepeat: String,
    /* boolean for label output */
    labelIconsOnly: {
      type: Boolean,
      default: false
    },
    /* width of labeling, uses bootstrap col widths */
    labelWidth: {
      type: Number,
      default: 3
    },
    /* boolean if it's a new password */
    newInput: {
      type: Boolean,
      default: false
    },
    /* secure pwd length, shows indicator if input is below */
    secureLength: {
      type: Number,
      default: 8
    },
    /* boolean for showing verbal output */
    showWordedStrength: {
      type: Boolean,
      default: true
    },
    /* boolean for showing suggestions to improve password */
    showPasswordSuggestions: {
      type: Boolean,
      default: true
    }

  },
  data() {
    return {
      passwordStrength: null,
      possibleWarnings: ['Straights of keys are easy to guess', 'Short keyboard patterns are easy to guess', 'Repeats like "aaa" are easy to guess',
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

  computed: {

    /**
     * pwdDiffMsg: returns a message if passwords differ
     *
     * Author: cmc
     *
     * Last Updated: March 24, 2021
     */
    pwdDiffMsg() {
      return !this.pwdMatch? this.i18n['profile.pwdDiffer'] : ''
    },

    pwdMatch() {
      return this.inputPwd === this.inputPwdRepeat
    },

    /**
     * showSuggestions: boolean to show suggestions
     *
     * Author: cmc
     *
     * Last Updated: September 22, 2021
     * @returns {boolean} true if any of the suggestions aren't empty,
     *  but not all
     */
    showSuggestions() {
      return (
        this.warnings !== '' ||
        this.pwdDiffMsg !== '' ||
        this.pwdMsg !== '') &&
        (this.warnings !== this.pwdDiffMsg)

    },
    /**
     * wordedPwdStrength(): word pwd strength for linguistic support
     *
     * Author: cmc
     *
     * Last Updated: September 22, 2021
     * @returns {string} password strength in locale
     */
    wordedPwdStrength() {
      return this.passwordStrength != null?
        this.i18n[`pwdStrength${this.passwordStrength}`]:
        ''
    }
  },

  watch: {
    pwdMatch(val) {
      if (val) {
        this.$emit('compliantPwd', this.inputPwd)
      }
    }
  },

  methods: {
    /**
     * function pwdStrength: word zxvn warnings, suggestions in user locale
     *
     * Author: pj
     *
     * Last Updated: June 28, 2021
     * @param suggestions
     * @param warning
     */
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
    },
    /**
     * function setPwdStrength: set passwordStrength data property
     *
     * Author: cmc
     *
     * Last Updated: September 22, 2021
     */
    setPwdStrength(num) {
      this.passwordStrength = num
    },

  }
}

</script>

<style scoped>
.form-group {
  display: flex;
  flex-wrap: wrap;
}

.reverse > * > * {
  right: 85% !important;
}
</style>

// noinspection HtmlUnknownTarget

/**
  Filename: locale.ts
  Use: Expose i18n local to components
  Creator: cmc
  Date: May 3, 2021
  Dependencies:
    vuex,
    @/i18n
*/

import { mapGetters } from 'vuex'
import * as i18n from '@/i18n'
export default {
  computed: {
    ...mapGetters(['profileLang']),

    /**
     * i18n: return locale for user language property
     *
     * Author: cmc
     *
     * Last Updated: May 3, 2021
     */
    i18n () {
      return i18n[this.profileLang]
    },

    /**
     * langIsAr: checks if Arabic script language is set, for rtl shenanigans
     *
     * Author: cmc
     *
     * Last Updated: November 16, 2021
     * @returns true if 'ar' or 'ku' is set as profileLang
     */
    langIsAr () {
      return this.profileLang === 'ar' || this.profileLang === 'ku'
    }
  },

  methods: {
    /**
     * function linkReplacement(): return a string pattern for strings, intended
     *  to use with replacePattern()
     *
     * Author: cmc
     *
     * Last Updated: April 5, 2022
     * @param external optional boolean if link should be opened in new window
     */
    linkReplacement (external?: boolean) {
      return external
        ? '<a href="$2" target="_blank">$1</a>'
        : '<a href="$2">$1</a>'
    },

    /**
     * function replacePattern(str, pattern, replacement): alias for str.replace(pattern, replacement)
     *
     * Author: cmc
     *
     * Last Updated: April 5, 2022
     * @param str string to be altered
     * @param pattern regex or substring to be replaced
     * @param replacement replacement to be used
     */
    replacePattern (str: string, pattern: RegExp | string, replacement: string) {
      return str.replace(pattern, replacement)
    },

    /**
     * function y18n(prop): returns i18n[prop] if it exists, the English equivalent
     *  if it doesn't, also falls back if key doesn't exist altogether
     *
     *  Author: cmc
     *
     *  Last Updated: April 5, 2022
     * @param prop key of the i18n object to return
     */
    y18n (prop: string) {
      return this.i18n[prop] // does key exist in selected locale?
        ? this.i18n[prop] // yes
        : i18n['en'][prop] // does key exist in English?
          ? i18n['en'][prop] // yes
          : 'This text is not available in any language. Please excuse the inconvenience.' // fallback
    }
  }
}

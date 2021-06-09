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
     * Author: cmc
     * Last Updated: May 3, 2021
     */
    i18n() {
      return i18n[this.profileLang]
    },

    /**
     * langIsAr: checks if Arabic is set, for rtl shenanigans
     * Author: cmc
     * Last Updated: June 3, 2021
     * @returns true if 'ar' is set as profileLang
     */
    langIsAr() {
      return this.profileLang === 'ar'
    }
  }
}
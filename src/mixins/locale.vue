<!--
  Filename: locale.vue 
  Use: Expose i18n local to components
  Creator: cmc
  Date: May 3, 2021
  Dependencies:
    vuex,
    @/i18n
-->

<script>
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
    i18n() {
      return i18n[this.profileLang]
    }
  }
}
</script>
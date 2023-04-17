/**
 * Filename: password.ts
 * Use: Set passwordOk boolean and return passwordSet and passwordRepeat
 * Creator: cmc
 * Since: v1.1.0
 */
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      passwordOk: false
    }
  },
  computed: {
    ...mapGetters([
      'passwordRepeat',
      'passwordSet'
    ])
  },

  methods: {
    /**
     * Function newPwdOk: set passwordOk boolean accordingly
     *
     * Author: cmc
     *
     * Last Updated: February 21, 2022
     * @param {boolean} val secure password
     */
    newPwdOk (val) {
      this.passwordOk = val
    }
  }
}

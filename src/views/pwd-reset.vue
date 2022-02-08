<template>
  <div class="container text-center pt-5">
    <!-- password change input -->
    <div
      id="change-password-input"
      v-if="!resetSuccess"
    >
      <div class="row mb-3">
        <h2 class="mx-auto">
          {{ i18n['password.submit' ]}}
        </h2>
      </div>
      <!-- password -->
      <div class="row">
        <PasswordInput
          :input-pwd="pwd"
          :input-pwd-repeat="pwdRepeat"
          :label-icons-only="false"
          :label-width="3"
          :new-input="true"
          @compliantLength="setCompliance"
          class="mx-auto"
        ></PasswordInput>
      </div>
      <div>
        <b-button
          type="submit"
          variant="info"
          :disabled="!pwdCompliant"
          @click.prevent="resetPassword"
        >
          <i
            v-if="busy"
            class="fas fa-spinner"
          ></i>
          {{ i18n['password.submit'] }}
        </b-button>
      </div>
    </div>
    <!-- redirect message after successful change request -->
    <div v-else>
      {{ i18n['password.redirectMsg'] }}
    </div>

  </div>
</template>

<script>
import http from 'axios'
import { locale } from '@/mixins'
import PasswordInput from '@/components/password-input'
import { mapGetters } from 'vuex'

export default {
  name: 'passwordReset',
  components: {
    PasswordInput // not lazily loaded b/c always visible
  },
  mixins: [
    locale
  ],
  data () {
    return {
      busy: false,
      resetSuccess: false,
      pwd: '',
      pwdCompliant: false,
      pwdRepeat: ''
    }
  },

  computed: {
    ...mapGetters(['passwordSet'])
  },

  watch: {
    /**
     * watcher resetSuccess: push route to login when it turns true
     *
     * Author cmc
     *
     * Last Updated: January 18, 2022
     * @param val boolean
     */
    resetSuccess(val) {
      if (val) { // val is boolean
        // this.$router.push('/login')
      }
    }
  },

  created () {
    this.removeAuthenticated()
  },

  methods: {

    /**
     * function removeAuthenticated: remove auth if other user than
     *  the one coming to this view is logged on
     *
     * Author cmc
     *
     * Last Updated: January 18, 2022
     */
    removeAuthenticated () {
      const auth = this.$ls.get('auth')
      if (auth && auth.userId !== this.$route.query.uid) { // someone is logged on, not matching uid
        this.$ls.remove('auth')
        this.$store.commit('logout')
      }
    },

    /**
     * function resetPassword: fire set-pwd request that validates
     *  the token and sets the new password
     *
     * Author cmc
     *
     * Last Updated: January 18, 2022
     */
    resetPassword () {
      this.busy = true
      http.post('/accounts/set-pwd/', {
        userId: this.$route.query.uid,
        verificationToken: this.$route.query.token,
        password: this.passwordSet
      })
      .then(() => {
        this.showToast('success')
        this.resetSuccess = true
        this.$store.commit('setPwd', '')
      })
      .catch((err) => {
        console.error(err)
        this.showToast('error')
      })
      .finally(() => {
        this.busy = false
      })
    },

    /**
     * function setCompliance: set pwdCompliant to given value
     *
     * Author cmc
     *
     * Last Updated: January 18, 2022
     * @param bool boolean for password compliant to security requirements
     */
    setCompliance (bool) {
      this.pwdCompliant = bool
    },

    /**
     * function showToast: show a toast in root instance depending on type,
     *  is used for bootstrap variant and message
     *
     * Author cmc
     *
     * Last Updated: January 18, 2022
     * @param type {'error', 'success'}
     */
    showToast (type) {
      this.$root.$bvToast.toast(this.i18n[`password.${type}Msg`], {
        title: this.i18n[`password.${type}`],
        toaster: 'b-toaster-bottom-center',
        variant: type === 'success'? type : 'danger'
      })
    }
  }
}
</script>
<style scoped>

</style>

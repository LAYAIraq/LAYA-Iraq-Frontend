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
          @click.prevent="resetAndVerify"
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
      Changing successful! Redirecting to Login...
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
    PasswordInput
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
      pwdRepeat: '',
      toastMessage: ''
    }
  },

  computed: {
    ...mapGetters(['passwordSet'])
  },

  watch: {
    resetSuccess(val) {
      if (val) { // val is boolean
          this.$router.push('/login')
      }
    }
  },

  created () {
    if (Object.keys(this.$route.query).length === 0) {
      console.log('no params!')
    } else {
      console.log(this.$route.query)
    }
    this.removeAuthenticated()
  },

  methods: {

    setCompliance (bool) {
      this.pwdCompliant = bool
    },

    showToast (type) { // FIXME: doesn't work yet
      this.$bvToast.toast(this.toastMessage, {
        title: String.capitalize(type),
        toaster: 'b-toaster-bottom-center',
        variant: type
      })
    },

    removeAuthenticated () {
      const auth = this.$ls.get('auth')
      if (auth && auth.userId !== this.$route.query.uid) {
        // console.log('user in query is not the one that is logged on!')
        this.$ls.remove('auth')
        this.$store.commit('logout')
      }
    },

    resetAndVerify () {
      this.busy = true

      // http.get(`/accounts/confirm?uid=${this.$route.query.uid}&token=${this.$route.query.token}`)
      //   .then(() => { // it's really a verified token thus allowed to set password
          http.post('/accounts/set-pwd/', {
            userId: this.$route.query.uid,
            verificationToken: this.$route.query.token,
            password: this.passwordSet
          })
          .then(() => {
            this.toastMessage('Password successfully changed!')
            this.showToast('success')
            this.resetSuccess = true
            this.$store.commit('setPwd', '')
          })
          .catch((err) => {
            this.toastMessage = err
            this.showToast('error')
          })
        // })
        // .catch(err => {
        //   this.errorMessage = err
        //   this.showFailToast()
        // })
        .finally(() => {
          this.busy = false
        })
    }
  }

}
</script>

<style scoped>

</style>

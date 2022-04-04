<!--
Filename: login.vue
Use: Organize Login for Users
Creator: core
Date: unknown
Dependencies:
  axios,
  @/mixins/locale.vue
-->

<template>
  <div class="login-view ly-nav-margin">
    <div class="container">
      <div
        v-if="$route.params.verified"
        class="text-center"
      >
        {{ i18n['login.verified'] }}
      </div>
      <div class="row">
        <form class="d-flex flex-column align-items-center">
          <div class="h-2rem"></div>
          <img
            src="../assets/anmelden.svg"
            alt="Login"
            class="d-block m-auto w-50"
          >
          <h1 class="text-center">
            {{ i18n['login.title'] }}
          </h1>

          <div
            class="ly-input"
            :class="{error: errEmail}"
          >
            <input
              id="email-input"
              v-model.trim="email"
              :placeholder="i18n['emailPH']"
              type="text"
              autofocus
              autocomplete="on"
              :aria-label="i18n['emailPH']"
            >
          </div>

          <div
            class="ly-input"
            :class="{error: errPwd}"
          >
            <input
              id="pwd-input"
              v-model.trim="pwd"
              :placeholder="i18n['pwdPH']"
              type="password"
              autocomplete="on"
              :aria-label="i18n['pwdPH']"
            >
          </div>

          <div class="h-2rem"></div>
          <button
            id="login-button"
            type="submit"
            class="btn btn-lg btn-outline-dark"
            aria-describedby="login-error"
            @click.prevent="submit"
          >
            {{ i18n['login.title'] }}
            <i class="fas fa-sign-in-alt"></i>
          </button>

          <!-- busy note -->
          <h5
            v-if="busy"
            class="text-center"
          >
            {{ i18n['busy'] }}
            <i class="fas fa-spinner fa-spin"></i>
          </h5>
          <div aria-live="polite">
            <div
              v-if="submitFailed"
              id="login-error"
              :aria-hidden="!submitFailed? 'false' : 'true'"
              class="font-weight-bold text-center mt-3"
            >
              <i class="fas fa-exclamation-triangle"></i>
              {{ errMsg }}
              <br>
              <a
                id="forgotten-password"
                href="#"
                @click.prevent="$bvModal.show('reset-password-confirm')"
              >
                {{ i18n['login.passwordForgotten'] }}
              </a>
            </div>
          </div>

          <hr>
          <div class="text-center">
            {{ i18n['login.registerHint1'] }}
            <br>
            <router-link :to="{ name: 'register-view'}">
              <i class="fas fa-user-plus"></i>
              {{ i18n['login.registerHint2'] }}
            </router-link>
          </div>
        </form>
      </div>
    </div>
    <b-modal
      id="reset-password-confirm"
      :title="i18n['login.passwordReset']"
      header-bg-variant="warning"
      ok-variant="warning"
      :ok-title="i18n['login.passwordReset']"
      :cancel-title="i18n['cancel']"
      :aria-label="i18n['popupwarning']"
      centered
      @ok="resetPassword"
    >
      <p>
        {{ i18n['login.passwordResetHint'] }}
      </p>
    </b-modal>
  </div>
</template>

<script>
import { locale } from '@/mixins'

export default {
  name: 'LoginView',

  mixins: [
    locale
  ],

  data () {
    return {
      /* form */
      email: '',
      pwd: '',
      /* temp */
      busy: false,
      errMsg: '',
      submitFailed: false
    }
  },

  computed: {

    /**
     * errEmail: return true of no email input
     *
     * Author: core
     *
     * Last Updated: unknown
     */
    errEmail () {
      return this.email.length === 0
    },

    /**
     * errPwd: return true if no password input
     *
     * Author: core
     *
     * Last Updated: unknown
     */
    errPwd () {
      return this.pwd.length === 0
    },

    /**
     * errForm: return true if password or email not put in
     *
     * Author: core
     *
     * Last Updated: unknown
     */
    errForm () {
      return this.errEmail || this.errPwd
    }
  },

  created () {
    // relocate logged users
    if (this.$ls.get('auth', false)) this.$router.replace('/')
  },

  methods: {
    /**
     * function resetPassword: fire password reset request
     *
     * Author: cmc
     *
     * Last Updated: March 16, 2022
     */
    resetPassword () {
      this.$store.dispatch('resetUserPassword', this.email)
        .then(() => this.showToast('success'))
        .catch(() => this.showToast('error'))
    },

    /**
     * function showToast: show a toast in root instance depending on type,
     *  is used for bootstrap variant and message
     *
     * Author cmc
     *
     * Last Updated: April 4, 2022
     * @param type {'error', 'success'}
     */
    showToast (type) {
      this.$root.$bvToast.toast(
        type === 'success'
          ? this.i18n['login.passwordResetText']
          : this.i18n['login.passwordResetFailedText'], {
          title: type === 'success'
            ? this.i18n['login.passwordReset']
            : this.i18n['login.passwordResetFailed'],
          toaster: 'b-toaster-bottom-center',
          variant: type === 'success' ? type : 'danger'
        })
    },

    /**
     * Function submit: submit login, on success load profile,
     *  set login state, store token in local storage, reroute
     *
     * Author: core
     *
     * Last Updated: 12.01.2022
     */
    submit () {
      if (this.errForm || this.busy) {
        console.log('Not Submitting')
        return
      }

      console.log('Submitting...')
      this.busy = true
      const { $data, $ls, $router, i18n } = this

      this.$store.dispatch('sendCredentials', {
        email: $data.email,
        password: $data.pwd
      })
        .then(({ id, userId, created }) => {
          const expire = new Date(created)
          expire.setSeconds(expire.getSeconds() + 604800) // user stays logged-in for 7 days (604800seconds)
          console.log('Auth expires on', expire)
          $ls.set('auth', { id: id, userId: userId }, expire.getTime())
          /* move to view */
          $router.push('/courses')
        })
        .catch(err => {
          console.log(err)
          $data.submitFailed = true
          $data.errMsg = i18n['login.errMsg']
        })
        .finally(() => {
          $data.busy = false
        })
    }
  }
}
</script>

<style scoped>
*:focus {
  outline: 2px dashed deepskyblue;
  outline-offset: 5px;
}

form {
  width: 21rem;
  margin: auto;
}

form > * {
  width: 90%;
}

a {
  color: black;
}

#login-button {
  border: 2px solid black;
}

.h-2rem {
  height: 2rem;
}
</style>

<!--
  Filename: login.vue
  Use: Organize Login for Users
  Creator: core
  Since: v1.0.0
-->

<template>
  <main>
    <div class="login">
      <div class="container">
        <div
          v-if="$route.params.verified"
          class="text-center mt-3"
        >
          {{ y18n('login.verified') }}
        </div>
        <div class="row">
          <form class="d-flex flex-column align-items-center">
            <div class="h-2rem"></div>
            <img
              src="../../assets/images/anmelden.svg"
              alt=""
              class="d-block m-auto w-50"
            >
            <h1 class="text-center">
              {{ y18n('login.title') }}
            </h1>

            <div class="row">
              <div class="col-5">
                <div class="row">
                  <label>
                    <i class="fas fa-at"></i>
                    {{ y18n('emailPH') }}
                  </label>
                </div>
              </div>
              <div
                class="col-4"
                :class="{error: errEmail}"
              >
                <input
                  id="email-input"
                  v-model.trim="email"
                  :placeholder="y18n('emailPH')"
                  type="text"
                  autocomplete="on"
                  :aria-label="y18n('emailPH')"
                >
              </div>
            </div>

            <div class="row">
              <div class="col-5">
                <div class="row">
                  <label>
                    <i class="fas fa-key"></i>
                    {{ y18n('passwordPH') }}
                  </label>
                </div>
              </div>
              <div
                class="col-4"
                :class="{error: errPwd}"
              >
                <input
                  id="pwd-input"
                  v-model.trim="pwd"
                  :placeholder="y18n('passwordPH')"
                  type="password"
                  autocomplete="on"
                  :aria-label="y18n('passwordPH')"
                >
              </div>
            </div>

            <div class="h-2rem"></div>
            <button
              id="login-button"
              type="submit"
              class="btn btn-lg btn-outline-dark"
              @click.prevent="submit"
            >
              {{ y18n('login.title') }}
              <i
                class="fas fa-sign-in-alt"
                aria-hidden="true"
              ></i>
            </button>

            <!-- busy note -->
            <h5
              v-if="busy"
              class="text-center"
            >
              {{ y18n('busy') }}
              <i class="fas fa-spinner fa-spin"></i>
            </h5>
            <div aria-live="polite">
              <div
                v-if="submitFailed"
                id="login-error"
                :aria-label="submitFailed? 'false' : 'true'"
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
                  {{ y18n('login.passwordForgotten') }}
                </a>
              </div>
            </div>

            <hr>
            <div class="text-center">
              {{ y18n('login.registerHint1') }}
              <br>
              <router-link :to="{ name: 'register'}">
                <i
                  class="fas fa-user-plus"
                  aria-hidden="true"
                ></i>
                {{ y18n('login.registerHint2') }}
              </router-link>
            </div>
          </form>
        </div>
      </div>
      <b-modal
        id="reset-password-confirm"
        :title="y18n('login.passwordReset')"
        header-bg-variant="warning"
        ok-variant="warning"
        cancel-variant="primary"
        :ok-title="y18n('login.passwordReset')"
        :cancel-title="y18n('cancel')"
        :aria-label="y18n('popupwarning')"
        centered
        @ok="resetPassword"
      >
        <p>
          {{ y18n('login.passwordResetHint') }}
        </p>
      </b-modal>
    </div>
  </main>
</template>

<script>
import { locale } from '@/mixins'

export default {
  name: 'Login',

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
      this.$store.dispatch('passwordReset', this.email)
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
          ? this.y18n('login.passwordResetText')
          : this.y18n('login.passwordResetFailedText'), {
          title: type === 'success'
            ? this.y18n('login.passwordReset')
            : this.y18n('login.passwordResetFailed'),
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
      const { $data, $ls, $router } = this

      this.$store.dispatch('sendCredentials', {
        email: $data.email,
        password: $data.pwd
      })
        .then(({ id, userId }) => {
          $ls.set('auth', { id: id, userId: userId }, 604800000) // expiration 7 days
          /* move to view */
          $router.push('/courses')
        })
        .catch(err => {
          console.log(err)
          $data.submitFailed = true
          $data.errMsg = this.y18n('login.errMsg')
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

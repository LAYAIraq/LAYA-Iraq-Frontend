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
      <div class="row">
        <form class="d-flex flex-column align-items-center">
          <div style="height: 2rem"></div>
          <img src="../assets/anmelden.svg" alt="Login" class="d-block m-auto w-50">
          <h1 class="text-center">{{ i18n['login.title'] }}</h1>

          <div class="ly-input" :class="{error: errEmail}">
            <input
              id="email-input"
              v-model.trim="email"
              :placeholder="i18n['emailPH']"
              type="text"
              autofocus
              autocomplete="on"
            >
          </div>

          <div class="ly-input" :class="{error: errPwd}">
            <input v-model.trim="pwd" :placeholder="i18n['pwdPH']" type="password" autocomplete="on">
          </div>

          <div style="height: 2rem"></div>
          <button
            id="login-button"
            type="submit"
            @click.prevent="submit"
            class="btn btn-lg btn-outline-dark"
            aria-describedby="login-error"
          >
            {{ i18n['login.title'] }}
            <i class="fas fa-sign-in-alt"></i>
          </button>

          <!-- busy note -->
          <h5 v-if="busy" class="text-center">
            {{ i18n['busy'] }}
            <i class="fas fa-spinner fa-spin"></i>
          </h5>

          <div id="login-error"
               v-if="submitFailed"
               :aria-hidden="!submitFailed"
               class="font-weight-bold text-center mt-3">
            <i class="fas fa-exclamation-triangle"></i>
            {{ errMsg }}
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
  </div>
</template>

<script>
import http from 'axios'
import { locale } from '@/mixins'

export default {
  name: 'login-view',

  mixins: [
    locale
  ],

  data() {
    return {
      /* form */
      email: '',
      pwd: '',

      /* temp */
      busy: false,
      errMsg: '',
      submitFailed: false
    };
  },

  computed: {

    /**
     * errEmail: return true of no email input
     *
     * Author: core
     *
     * Last Updated: unknown
     */
    errEmail() {
      return this.email.length === 0
    },

    /**
     * errPwd: return true if no password input
     *
     * Author: core
     *
     * Last Updated: unknown
     */
    errPwd() {
      return this.pwd.length === 0
    },

    /**
     * errForm: return true if password or email not put in
     *
     * Author: core
     *
     * Last Updated: unknown
     */
    errForm() {
      return this.errEmail || this.errPwd
    }
  },

  mounted() {
    // focus email input field on mount
    document.querySelector('#email-input').focus()
  },

  methods: {

    /**
     * Function submit: submit login, on success load profile,
     *  set login state, store token in local storage, reroute
     *
     * Author: core
     *
     * Last Updated: unknown
     */
    submit() {
      if (this.errForm || this.busy) {
        console.log('Not Submitting')
        return
      }

      console.log('Submitting...')
      this.busy = true
      let ctx = this

      http.post('accounts/login', {
        email: ctx.email,
        password: ctx.pwd
      }).then(({ data }) => {
        /*
         * set login state */
        ctx.$store.commit('login', data)

        /* load profile */
        ctx.$store.dispatch('fetchProfile')
        ctx.$store.dispatch('fetchRole')

        /* store auth for reloads */
        const { id, userId, created, ttl } = data
        let expire = new Date(created)
        expire.setSeconds(expire.getSeconds() + ttl)
        console.log('Auth expires on', expire)
        ctx.$ls.set('auth', { id: id, userId: userId }, expire.getTime())

        /* move to view */
        ctx.$router.push('/courses')
      }).catch(err => {
        console.log(err)
        ctx.submitFailed = true
        ctx.errMsg = ctx.i18n['login.errMsg']
      }).then(() => {
        ctx.busy = false
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
</style>

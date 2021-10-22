<!--
Filename: register.vue
Use: Allow users to register
Creator: core
Date: unknown
Dependencies:
  axios,
  @/mixins/locale.vue
-->

<template>
  <div class="register-view ly-nav-margin">

    <div class="container">
      <div class="row">

        <form class="d-flex flex-column align-items-center">

          <div style="height: 2rem"></div>
          <img src="../assets/anmelden.svg" alt="Login" class="w-50">
          <h1 class="text-center">{{ i18n['register.title'] }}</h1>

          <!-- name -->
          <div class="form-group row" :class="{error: errName}">
            <div class="col-1 col-form-label">
              <i class="fas fa-signature"></i>
            </div>
            <div class="col">
              <input
                id="register-focus"
                v-model="name"
                :placeholder="i18n['namePH']"
                :aria-label="i18n['namePH']"
                type="text"
                :disabled="submitOk"
                @blur="isNameTaken"
                class="w-100"
                aria-describedby="name-err">
            </div>
          </div>

          <div class="form-group row" :class="{'d-none': !errName}">
            <div class="col text-center">
              <span
                id="name-err"
                class="text-center"
                v-show="errName"
                :aria-hidden="!nameTaken"
              >
                {{ nameTaken ? i18n['nameTaken'] : i18n['nameErr'] }}
              </span>
            </div>
          </div>

          <!-- email -->
          <div class="form-group row" :class="{error: errEmail}">
            <div class="col-1 col-form-label">
              <i class="fas fa-at"></i>
            </div>
            <div class="col">
              <input v-model="email" :placeholder="i18n['emailPH']" :aria-label="i18n['emailPH']" type="text"
              :disabled="submitOk" @blur="isEmailTaken" class="w-100"
              aria-describedby="email-err">
            </div>
          </div>

          <!-- email hint-->
          <div class="form-group row text-center" :class="{'d-none': !errEmail}">
            <div class="col text-center">
                <span
                  id="email-err"
                  v-show="errEmail"
                  :aria-hidden="!emailTaken"
                >
                  {{ emailTaken ? i18n['emailTaken'] : i18n['emailErr'] }}
                </span>
            </div>
          </div>

          <!-- password -->
          <div class="form-group row" :class="{error: errPwds}">
            <div class="col-1 col-form-label">

                <i class="fas fa-key"></i>

            </div>
            <div class="col">
              <input
                v-model="pwd1"
                :placeholder="i18n['pwdPH']"
                :aria-label="i18n['pwdPH']"
                type="password"
                :disabled="submitOk"
                class="w-100"
                aria-describedby="pwd-err"
              >
            </div>
          </div>
          <div class="form-group row" :class="{error: errPwds}">
            <div class="col-1 col-form-label">
                <i class="fas fa-redo-alt"></i>
            </div>
            <div class="col">
              <input v-model="pwd2" :placeholder="i18n['pwd2PH']" :aria-label="i18n['pwd2PH']" type="password"
              :disabled="submitOk" class="w-100" aria-describedby="pwd-err">
            </div>
          </div>
          <div
            id="pwd-err"
            class="text-center"
            :class="{'d-none': !errPwds}"
            :aria-hidden="!errPwds"
            v-show="errPwds">
            {{ i18n['register.pwdErr'] }}
          </div>
          <div class="form-group row">
            <div class="col-sm-9">
              <label for="pwdMeter" class="col-sm-3 col-form-label">{{ i18n['profile.pwdStrength'] }}</label>
              <password id="pwdMeter" v-model="pwd2" :strength-meter-only="true" @feedback="showFeedback"></password>
              <strong id="testPwdMeter" class="form-text text-center"> {{ warnings }} </strong>
            </div>
          </div>

          <!-- profile pic -->

          <!-- <div style="height: 2rem"></div>
          <div class="position-relative">
            <div class="position-absolute">{{ i18n['profilePic'] }}</div>

            <ly-input-img v-model="profileImg"
                          style="width: 7rem"
                          class="m-auto">
              <img src="../assets/hochladen.svg" alt="Profilbild wählen">
            </ly-input-img>
          </div> -->


          <!-- submit -->
          <!-- <div style="height: 4rem"></div> -->
          <h2 :class="{'d-none': busy || submitOk}">
            <button v-if="!errForm"
              @click.prevent="submit"
              type="submit"
              class="btn btn-lg btn-block btn-outline-dark"
              style="border: 2px solid black">
              {{ i18n['register.submit'] }}
              <i class="fas fa-user-plus"></i>
            </button>
          </h2>
          <!-- still form errors -->
          <h3 id="form-err" class="text-center" :class="{'d-none': !errForm}">
            {{ i18n['register.formErr'] }}
          </h3>
          <!-- busy note -->
          <h3 class="text-center" :class="{'d-none': !busy}">
            {{ i18n['busy'] }} <i class="fas fa-spinner fa-spin"></i>
          </h3>
          <!-- submit ok: goto login -->
          <h3 class="text-center" :class="{'d-none': !submitOk}">
            <router-link to="/login">
              <div>
                <u>{{ i18n['register.success'] }}</u>
              <img src="../assets/fertig.svg" alt="Erfolg" style="width: 3rem">
              </div>
            </router-link>
          </h3>
          <!-- submit not ok -->
          <h3 class="text-center">{{ errmsg }}</h3>

        </form>

      </div>
    </div>

  </div>
</template>

<script>
import http from 'axios'
import { locale, pwdStrength } from '@/mixins'
import Password from 'vue-password-strength-meter'

export default {
  name: 'register-view',

  components: {
    Password,
    // LayaUploadAvatar
  },

  mixins: [
    locale,
    pwdStrength
  ],

  data () {
    return {

      /* form model */
      name: '',
      email: '',
      pwd1: '',
      pwd2: '',
      profileImg: null,

      /* temp */
      errmsg: '',
      busy: false,
      submitOk: false,
      nameTaken: false,
      emailTaken: false
    }
  },

  computed: {

    /**
     * errName: form validation for name
     *
     * Author: core
     *
     * Last Updated: unknown
     */
    errName() {
      if(this.name === '') return false
      return /\W/.test(this.name) || /^$/.test(this.name) ||
        this.nameTaken
    },

    /**
     * errEmail: form validation for email
     *
     * Author: core
     *
     * Last Updated: unknown
     */
    errEmail() {
      if(this.email === '') return false
      return !(/^[^@\s]+[@][^@\s]+$/.test(this.email)) ||
        this.emailTaken
    },

    /**
     * errPwds: form validation for password input
     *
     * Author: core
     *
     * Last Updated: unknown
     */
    errPwds() {
      if(this.pwd1 === '') return false
      return (/^$/.test(this.pwd1) || /^$/.test(this.pwd2)) ||
        (this.pwd1 !== this.pwd2)
    },

    /**
     * noInput: return true if no input is set
     *
     * Author: cmc
     *
     * Last Updated: May 15, 2021
     */
    noInput() {
      return (this.name === '' &&
        this.email === '' &&
        this.pwd1 === '' &&
        this.pwd2 === '')
    },

    /**
     * errForm: form validation altogether
     *
     * Author: core
     *
     * Last Updated: unknown
     */
    errForm() {
      return this.errName || this.errEmail || this.errPwds || this.noInput
    }
  },

  mounted () {
    document.querySelector('#register-focus').focus()
  },

  methods: {

    /**
     * function focusImgInput: focus #image-input html element
     *
     * Author: core
     *
     * Last Updated: unknown
     */
    focusImgInput() {
      document.querySelector('#image-input').focus()
    },

    /**
     * Function isNameTaken: return if chosen name is already taken
     *
     * Author: core
     *
     * Last Updated: unknown
     */
    isNameTaken() {
      let ctx = this
      if (ctx.name.length === 0) {
        ctx.nameTaken = false
        return
      }
      http.get(`accounts/name/${ctx.name}`)
        .then( ({data}) => {
          ctx.nameTaken = data
        })
    },

    /**
     * Function isEmailTake: return if given email is already taken
     *
     * Author: core
     *
     * Last Updated: unknown
     */
    isEmailTaken() {
      let ctx = this
      if (ctx.email.length === 0) {
        ctx.emailTaken = false
        return
      }
      http.get(`accounts/email/${ctx.email}`)
        .then(({data}) => {
          ctx.emailTaken = data
        })
    },

    /**
     * Function submit: collect requests for changes, then shoot them
     *
     * Author: core
     *
     * Last Updated: unknown
     */
    submit() {
      if (this.errForm || this.nameTaken || this.emailTaken) {
        console.log('Not Submitting')
        return
      }

      console.log('Submitting...')
      this.busy = true
      let ctx = this

      const avatarFileName = ctx.profileImg
        ? `${ctx.name}.${ctx.profileImg.name.split('.').slice(-1).pop()}` : ''

      let requests = [
        http.post(`accounts/student`, {
          email: ctx.email,
          username: ctx.name,
          password: ctx.pwd1,
          avatar: avatarFileName,
          lang: ctx.$store.state.profile.lang
        })
      ]

      //
      // upload profile pic if set
      if (ctx.profileImg) {
        const data = new FormData()
        data.append('file', ctx.profileImg)
        requests.push(
          http.post(`storage/img/upload?name=${avatarFileName}`, data)
          .then(res => console.log(res))
          .catch(err => console.error(err))
        )
      }

      http.all(requests)
        .then(http.spread( () => {
          ctx.submitOk = true
        }))
        .catch( (err) => {
          console.log(err)
          ctx.errmsg = this.i18n['register.fail']
        })
        .finally( () => {
          ctx.busy = false
        })
    },
    showFeedback ({suggestions, warning}) {
      this.pwdStrength({suggestions, warning})

    }
  }
}
</script>

<style scoped>
*:focus {
  outline-offset: 5px;
  outline: 2px dashed deepskyblue;
}

form {
  width: 30rem;
  margin: auto;
}

form > * {
  width: 90%;
}

a {
  color: black;
}
</style>

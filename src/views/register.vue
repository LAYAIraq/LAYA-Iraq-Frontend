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
          <img
            src="../assets/anmelden.svg"
            alt="Login"
            class="w-50"
          >
          <h1 class="text-center">
            {{ i18n['register.title'] }}
          </h1>

          <!-- name -->
          <div class="form-group row">
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
                class="form-control"
                :class="errName? 'wrong-input' : ''"
                aria-describedby="name-err"
                @blur="isNameTaken"
              >
            </div>
          </div>

          <div
            v-if="errName"
            class="form-group row"
          >
            <div class="d-flex m-auto">
              <i
                class="fas fa-exclamation-triangle"
                :class="langIsAr? 'mr-3' : 'ml-3'"
              ></i>
              <div
                v-if="nameTaken"
                id="name-taken-err"
                class="text-center"
                :aria-hidden="!nameTaken"
              >
                <strong>
                {{ nameTaken }}
                </strong>
              </div>
              <div
                v-else-if="wrongNameCharacters.length === 0"
                id="name-empty-err"
                class="col text-center"
                :aria-hidden="nameTaken"
              >
                <strong>
                  {{ i18n['nameErrEmpty'] }}
                </strong>
              </div>
              <div
                v-else
                id="name-err"
                class="text-center"
                :aria-hidden="nameTaken"
              >
                <strong>
                  {{ i18n['nameErr']}} <br>
                  {{ i18n['forbiddenChars'] }}:
                </strong>
                <ul class="list-unstyled">
                  <li
                    class="d-inline-block"
                    :class="langIsAr? 'ml-3' : 'mr-3'"
                    v-for="char in wrongNameCharacters"
                  >
                      {{ char.replace(' ', '␣') }}
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <!-- email -->
          <div class="form-group row">
            <div class="col-1 col-form-label">
              <i class="fas fa-at"></i>
            </div>
            <div class="col">
              <input
                v-model="email"
                :placeholder="i18n['emailPH']"
                :aria-label="i18n['emailPH']"
                type="text"
                :disabled="submitOk"
                class="form-control"
                :class="errEmail? 'wrong-input' : ''"
                aria-describedby="email-err"
                @blur="isEmailTaken"
              >
            </div>
          </div>

          <!-- email hint-->
          <div
            class="form-group row text-center"
            :class="{'d-none': !errEmail}"
          >
            <div class="col text-center">
              <i class="fas fa-exclamation-triangle"></i>
              <span
                v-show="errEmail"
                id="email-err"
                :aria-hidden="!emailTaken"
              >
                <strong>
                  {{ emailTaken ? i18n['emailTaken'] : i18n['emailErr'] }}
                </strong>
              </span>
            </div>
          </div>

          <!--- pwd input component -->
          <LayaPasswordInput
            class="pwd-input"
            :label-icons-only="true"
            :label-width="1"
            @compliantLength="newPwdOk"
          ></LayaPasswordInput>

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
            <button
              :disabled="errForm"
              class="btn btn-lg btn-block btn-outline-dark"
              style="border: 2px solid black"
              @click.prevent="submit"
            >
              {{ i18n['register.submit'] }}
              <i class="fas fa-user-plus"></i>
            </button>
          </h2>

          <!-- still form errors -->
          <h3
            id="form-err"
            class="text-center"
            :class="{'d-none': !errForm}"
          >
            {{ i18n['register.formErr'] }}
          </h3>
          <!-- busy note -->
          <h3
            class="text-center"
            :class="{'d-none': !busy}"
          >
            {{ i18n['busy'] }} <i class="fas fa-spinner fa-spin"></i>
          </h3>
          <!-- submit ok: goto login -->
          <h3
            class="text-center"
            :class="{'d-none': !submitOk}"
          >
            <router-link to="/login">
              <div>
                <u>{{ i18n['register.success'] }}</u>
                <img
                  src="../assets/fertig.svg"
                  alt="Erfolg"
                  style="width: 3rem"
                >
              </div>
            </router-link>
          </h3>
          <!-- submit not ok -->
          <h3 class="text-center">
            {{ errmsg }}
          </h3>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import http from 'axios'
import { locale, pwdProps } from '@/mixins'
import LayaPasswordInput from '@/components/password-input.vue'

export default {
  name: 'RegisterView',

  components: {
    LayaPasswordInput // not lazily loaded b/c always visible
    // LayaUploadAvatar
  },

  mixins: [
    locale,
    pwdProps
  ],

  data () {
    return {

      /* form model */
      name: '',
      email: '',
      profileImg: null,

      /* helpers for input checking */
      errmsg: '',
      busy: false,
      submitOk: false,
      nameTaken: false,
      nameInputStarted: false,
      wrongNameCharacters: [],
      emailTaken: false
    }
  },

  computed: {

    /**
     * errName: form validation for name
     *
     * Author: core
     *
     * Last Updated: March 21, 2022 by cmc
     */
    errName () {
      // no error when no input yet
      if (!this.nameInputStarted) return false
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
    errEmail () {
      if (this.email === '') return false
      return !(/^[^@\s]+[@][^@\s]+$/.test(this.email)) ||
        this.emailTaken
    },

    /**
     * noInput: return true if no input is set
     *
     * Author: cmc
     *
     * Last Updated: May 15, 2021
     */
    noInput () {
      return (this.name === '' &&
        this.email === '' &&
        this.passwordRepeat === '' &&
        this.passwordSet === '')
    },

    /**
     * errForm: form validation altogether
     *
     * Author: core
     *
     * Last Updated: January 17, 2021
     */
    errForm () {
      return this.errName || this.errEmail || this.noInput || !this.passwordOk
    }
  },

  watch: {
    /**
     * watcher name: check for wrong characters in name, pushing them to
     *  wrongNameCharacters for display
     *
     * Author: cmc
     *
     * Last Updated: March 21, 2022
     * @param {string} val value of name
     */
    name (val) {
      this.nameInputStarted = true
      this.wrongNameCharacters = []
      if (this.errName) {
        for (const letter of this.name) {
          if (
            /\W/.test(letter) && // letter is non-word character
            !this.wrongNameCharacters.find(el => el === letter)
          ) { // push wrong character to array if not already present
            this.wrongNameCharacters.push(letter)
          }
        }
      }
    }
  },

  created () {
    // relocate logged users
    if (this.$ls.get('auth', false)) this.$router.replace('/')
  },

  methods: {

    /**
     * Function isNameTaken: return if chosen name is already taken
     *
     * Author: core
     *
     * Last Updated: unknown
     */
    isNameTaken () {
      const ctx = this
      if (ctx.name.length === 0) {
        ctx.nameTaken = false
        return
      }
      http.get(`accounts/name/${ctx.name}`)
        .then(({ data }) => {
          ctx.nameTaken = data
        })
    },

    /**
     * Function isEmailTaken: return if given email is already taken
     *
     * Author: core
     *
     * Last Updated: unknown
     */
    isEmailTaken () {
      const ctx = this
      if (ctx.email.length === 0) {
        ctx.emailTaken = false
        return
      }
      http.get(`accounts/email/${ctx.email}`)
        .then(({ data }) => {
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
    submit () {
      if (this.errForm || this.nameTaken || this.emailTaken) {
        console.log('Not Submitting')
        return
      }

      // console.log('Submitting...')
      this.busy = true
      const ctx = this

      // const avatarFileName = ctx.profileImg
      //   ? `${ctx.name}.${ctx.profileImg.name.split('.').slice(-1).pop()}` : ''

      // let requests = [
      http.post('accounts/student', {
        email: ctx.email,
        username: ctx.name,
        password: ctx.passwordSet,
        // avatar: avatarFileName,
        lang: ctx.$store.state.profile.lang
      })
        .then(() => {
          ctx.submitOk = true
        })
        .catch((err) => {
          console.error(err)
          ctx.errmsg = this.i18n['register.fail']
        })
        .finally(() => {
          ctx.busy = false
        })
      // ]

      //
      // upload profile pic if set
      // if (ctx.profileImg) {
      //   const data = new FormData()
      //   data.append('file', ctx.profileImg)
      //   requests.push(
      //     http.post(`storage/img/upload?name=${avatarFileName}`, data)
      //     .then(res => console.log(res))
      //     .catch(err => console.error(err))
      //   )
      // }

      // http.all(requests)
      //   .then(http.spread( () => {
      //     ctx.submitOk = true
      //   }))
      //   .catch( (err) => {
      //     console.log(err)
      //     ctx.errmsg = this.i18n['register.fail']
      //   })
      //   .finally( () => {
      //     ctx.busy = false
      //   })
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

.pwd-input {
  padding: 0 15px;
}

form > *, form > .pwd-input > * {
  width: 90%;
}

.wrong-input {
  border: 2px crimson solid;
}

a {
  color: black;
}
</style>

<!--
  Filename: register.vue
  Use: Allow users to register
  Creator: core
  Since: v1.0.0
-->

<template>
  <main>
    <div class="register">
      <div class="container">
        <div class="row">
          <form class="d-flex flex-column align-items-center">
            <div style="height: 2rem"></div>
            <img
              src="../../assets/images/anmelden.svg"
              alt=""
              class="w-50"
            >
            <h1 class="text-center">
              {{ y18n('register.title') }}
            </h1>

            <!-- name -->
            <div class="form-group row">
              <div class="col-5">
                <div class="row">
                  <label>
                    <i
                      class="fas fa-signature"
                      aria-hidden="true"
                    ></i>
                    {{ y18n('usernamePH') }}
                  </label>
                </div>
              </div>
              <div class="col">
                <input
                  id="name-input"
                  v-model="name"
                  :placeholder="y18n('usernamePH')"
                  :aria-label="y18n('usernamePH')"
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
                  :aria-label="!nameTaken"
                >
                  <strong>
                    {{ y18n('nameTaken') }}
                  </strong>
                </div>
                <div
                  v-else-if="wrongNameCharacters.length === 0"
                  id="name-empty-err"
                  class="col text-center"
                  :aria-label="nameTaken"
                >
                  <strong>
                    {{ y18n('nameErrEmpty') }}
                  </strong>
                </div>
                <div
                  v-else
                  id="name-err"
                  class="text-center"
                  :aria-label="nameTaken"
                >
                  <strong>
                    {{ y18n('nameErr') }} <br>
                    {{ y18n('forbiddenChars') }}:
                  </strong>
                  <ul class="list-unstyled">
                    <li
                      v-for="char in wrongNameCharacters"
                      :key="char"
                      class="d-inline-block"
                      :class="langIsAr? 'ml-3' : 'mr-3'"
                    >
                      {{ char.replace(' ', y18n('noWhiteSpace')) }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <!-- email -->
            <div class="form-group row">
              <div class="col-5">
                <div class="row">
                  <label>
                    <i
                      class="fas fa-at"
                      aria-hidden="true"
                    ></i>
                    {{ y18n('emailPH') }}
                  </label>
                </div>
              </div>
              <div class="col">
                <input
                  id="email-input"
                  v-model="email"
                  :placeholder="y18n('emailPH')"
                  :aria-label="y18n('emailPH')"
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
              <div
                v-if="errEmail"
                id="email-err"
                :aria-label="!emailTaken"
                class="col text-center"
              >
                <i class="fas fa-exclamation-triangle"></i>
                <strong>
                  {{ emailTaken ? y18n('emailTaken') : y18n('emailErr') }} <br>
                  {{ missingEmailCharacters.length > 0? y18n('emailErr.missingChars') : '' }}:
                </strong>
                <ul class="list-unstyled">
                  <li
                    v-for="char in missingEmailCharacters"
                    :key="char"
                    class="d-inline-block"
                    :class="langIsAr? 'ml-3' : 'mr-3'"
                  >
                    {{ char }}
                  </li>
                </ul>
              </div>
            </div>

            <div class="col-4 mt-1">
              <p>
                <label
                  for="or"
                >
                  {{ y18n('or') }}
                </label>
              </p>
            </div>

            <!-- phone -->
            <div class="form-group row">
              <div class="col-5">
                <div class="row">
                  <label>
                    <i
                      class="fas fa-phone"
                      aria-hidden="true"
                    ></i>
                    {{ y18n('phoneNumberPH') }}
                  </label>
                </div>
              </div>
              <div class="col">
                <input
                  id="phone-input"
                  v-model="phone"
                  :placeholder="y18n('phoneNumberPH')"
                  :aria-label="y18n('phoneNumberPH')"
                  type="text"
                  :disabled="submitOk"
                  class="form-control"
                  :class="errPhone? 'wrong-input' : ''"
                  aria-describedby="phone-err"
                  @blur="isPhoneTaken"
                >
              </div>
            </div>

            <!-- phone hint-->
            <div
              class="form-group row text-center"
              :class="{'d-none': !errPhone}"
            >
              <div
                v-if="errPhone"
                id="phone-err"
                :aria-hidden="!phoneTaken"
                class="col text-center"
              >
                <i class="fas fa-exclamation-triangle"></i>
                <strong>
                  {{ phoneTaken ? y18n('phoneTaken') : y18n('phoneErr') }} <br>
                </strong>
              </div>
            </div>

            <!--- pwd input component test -->
            <password-input
              class="pwd-input"
              :label-icons-only="true"
              :label-width="1"
              @compliantLength="newPwdOk"
            ></password-input>

            <!-- profile pic -->

            <!-- <div style="height: 2rem"></div>
            <div class="position-relative">
              <div class="position-absolute">{{ y18n('profilePic') }}</div>

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
                {{ y18n('register.submit') }}
                <i
                  class="fas fa-user-plus"
                  aria-hidden="true"
                ></i>
              </button>
            </h2>

            <!-- still form errors -->
            <h3
              id="form-err"
              class="text-center"
              :class="{'d-none': !errForm}"
            >
              {{ y18n('register.formErr') }}
            </h3>
            <!-- busy note -->
            <h3
              class="text-center"
              :class="{'d-none': !busy}"
            >
              {{ y18n('busy') }} <i class="fas fa-spinner fa-spin"></i>
            </h3>
            <!-- submit ok: goto login -->
            <h3
              class="text-center"
              :class="{'d-none': !submitOk}"
            >
              <router-link to="/login">
                <div>
                  <u>{{ y18n('register.success') }}</u>
                  <img
                    src="../../assets/images/fertig.svg"
                    :alt="y18n('uploadFile.success')"
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
  </main>
</template>

<script>
import { locale, password } from '@/mixins'
import PasswordInput from '@/components/helpers/password-input.vue'

export default {
  name: 'Register',

  components: {
    PasswordInput // not lazily loaded b/c always visible
    // LayaUploadAvatar
  },

  mixins: [
    locale,
    password
  ],

  data () {
    return {

      /* form model */
      name: '',
      email: '',
      phone: '',
      profileImg: null,

      /* helpers for input checking */
      errmsg: '',
      busy: false,
      submitOk: false,
      nameTaken: false,
      nameInputStarted: false,
      wrongNameCharacters: [],
      emailTaken: false,
      phoneTaken: false,
      missingEmailCharacters: []
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
      return !(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) ||
        this.emailTaken
    },

    /**
     * errPhone: form validation for phone
     *
     * Author: nv
     *
     * Since: v1.3.0
     */
    errPhone () {
      if (this.phone === '') return false
      return this.phoneTaken
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
        this.phone === '' &&
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
      return this.errName || this.errEmail || this.errPhone || this.noInput || !this.passwordOk
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
     */
    name () {
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
    },

    /**
     * watcher email: check if @ and . are present in email
     *
     * Author: cmc
     *
     * Last Updated: April 4, 2022
     */
    email () {
      this.missingEmailCharacters = []
      let missingAt = true
      let missingPeriod = true
      for (const char of this.email) {
        if (char === '@') {
          missingAt = false
        } else if (char === '.') {
          missingPeriod = false
        }
      }
      if (missingAt) {
        this.missingEmailCharacters.push('@')
      }
      if (missingPeriod) {
        this.missingEmailCharacters.push('.')
      }
    }
  },

  created () {
    // relocate logged users
    if (this.$ls.get('auth', false)) {
      this.$router.replace('/')
    }
  },

  methods: {

    /**
     * Function isNameTaken: return if chosen name is already taken
     *
     * Author: core
     *
     * Last Updated: April 12, 2022 by cmc
     */
    isNameTaken () {
      if (this.name.length === 0) {
        this.nameTaken = false
        return
      }
      this.$store.dispatch('checkNameTaken', this.name)
        .then(resp => { this.nameTaken = resp })
        .catch(() => { this.nameTaken = false })
    },

    /**
     * Function isEmailTaken: return if given email is already taken
     *
     * Author: core
     *
     * Last Updated: April 12, 2022 by cmc
     */
    isEmailTaken () {
      if (this.email.length === 0) {
        this.emailTaken = false
        return
      }
      this.$store.dispatch('checkEmailTaken', this.email)
        .then(() => { this.emailTaken = true })
        .catch(() => { this.emailTaken = false })
    },

    /**
     * Function isPhoneTaken: return if given phone is already taken
     *
     * Author: nv
     *Since: v1.3.0
     */
    isPhoneTaken () {
      if (this.phone.length === 0) {
        this.phoneTaken = false
        return
      }
      this.$store.dispatch('checkPhoneTaken', this.phone)
        .then(() => { this.phoneTaken = true })
        .catch(() => { this.phoneTaken = false })
    },

    /**
     * Function submit: collect requests for changes, then shoot them
     *
     * Author: core
     *
     * Last Updated: unknown
     */
    submit () {
      if (this.errForm || this.nameTaken || this.emailTaken || this.phoneTaken) {
        console.log('Not Submitting')
        return
      }

      // console.log('Submitting...')
      this.busy = true

      // const avatarFileName = this.profileImg
      //   ? `${this.name}.${this.profileImg.name.split('.').slice(-1).pop()}` : ''

      // let requests = [
      this.$store.dispatch('registerUser', {
        email: this.email,
        phone: this.phone,
        username: this.name,
        password: this.password,
        // avatar: avatarFileName,
        lang: this.profileLanguage
      })
        .then(() => {
          this.submitOk = true
        })
        .catch((err) => {
          console.error(err)
          this.errmsg = this.y18n('register.fail')
        })
        .finally(() => {
          this.busy = false
        })
      // ]

      //
      // upload profile pic if set
      // if (this.profileImg) {
      //   const data = new FormData()
      //   data.append('file', this.profileImg)
      //   requests.push(
      //     http.post(`storage/img/upload?name=${avatarFileName}`, data)
      //     .then(res => console.log(res))
      //     .catch(err => console.error(err))
      //   )
      // }

      // http.all(requests)
      //   .then(http.spread( () => {
      //     this.submitOk = true
      //   }))
      //   .catch( (err) => {
      //     console.log(err)
      //     this.errmsg = this.y18n('register.fail')
      //   })
      //   .finally( () => {
      //     this.busy = false
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

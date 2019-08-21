<template>
  <div class="register-view ly-nav-margin">

    <div class="container">
      <div class="row">

        <form class="d-flex flex-column align-items-center">

          <div style="height: 2rem"></div>
          <img src="../assets/anmelden.svg" alt="Login" class="w-50">
          <h1 class="text-center">{{ msg.title }}</h1>

          <!-- name -->
          <div class="ly-input" :class="{error: errName}">
            <input id="register-focus" v-model="name" :placeholder="msg.namePH"
            type="text" :disabled="submitOk" @blur="isNameTaken" class="w-100"
            aria-describedby="name-err">
          </div>
          <div class="text-center" :class="{'d-none': !errName}">
            <span id="name-err" class="text-center" v-show="nameTaken"
              :aria-hidden="!nameTaken">
              {{ nameTaken ? msg.nameTaken : msg.nameErr }}
            </span>
          </div>

          <!-- email -->
          <div class="ly-input" :class="{error: errEmail}">
            <input v-model="email" :placeholder="msg.emailPH" type="text"
            :disabled="submitOk" @blur="isEmailTaken" class="w-100"
            aria-describedby="email-err">
          </div>
          <div class="text-center" :class="{'d-none': !errEmail}">
            <span id="email-err" class="text-center" v-show="emailTaken"
              :aria-hidden="!emailTaken">
              {{ emailTaken ? msg.emailTaken : msg.emailErr }}
            </span>
          </div>

          <!-- password -->
          <div class="ly-input" :class="{error: errPwds}">
            <input v-model="pwd1" :placeholder="msg.pwd1PH" type="password"
            :disabled="submitOk" class="w-100" aria-describedby="pwd-err">
          </div>
          <div class="ly-input" :class="{error: errPwds}">
            <input v-model="pwd2" :placeholder="msg.pwd2PH" type="password"
            :disabled="submitOk" class="w-100" aria-describedby="pwd-err">
          </div>
          <div id="pwd-err" class="text-center" :class="{'d-none': !errPwds}"
            :aria-hidden="!errPwds">
            {{ msg.pwdErr }}
          </div>

          <!-- profile pic -->
          <div style="height: 2rem"></div>
          <div class="position-relative">
            <div class="position-absolute">{{ msg.profilePic }}</div>

            <ly-input-img v-model="profileImg"
                          style="width: 7rem"
                          class="m-auto">
              <img src="../assets/hochladen.svg" alt="Profilbild wählen">
            </ly-input-img>
          </div>

          <!-- submit -->
          <div style="height: 4rem"></div>
          <h4 :class="{'d-none': busy || submitOk}">
            <button v-if="!errForm"
                    @click.prevent="submit"
                    type="submit"
                    class="btn btn-lg btn-block btn-outline-dark"
                    style="border: 2px solid black">
              {{ msg.submit }} <i class="fas fa-arrow-right"></i>
            </button>
          </h4>
          <!-- still form errors -->
          <h5 id="form-err" class="text-center" :class="{'d-none': !errForm}">
            {{ msg.formErr }}
          </h5>
          <!-- busy note -->
          <h5 class="text-center" :class="{'d-none': !busy}">
            {{ msg.busy }} <i class="fas fa-spinner fa-spin"></i>
          </h5>
          <!-- submit ok: goto login -->
          <h5 class="text-center" :class="{'d-none': !submitOk}">
            <router-link to="/login">
              <div>
                <u>{{ msg.success }}</u>
              <img src="../assets/fertig.svg" alt="Erfolg" style="width: 3rem">
              </div>
            </router-link>
          </h5>
          <!-- submit not ok -->
          <h5 class="text-center">{{ errmsg }}</h5>

        </form>

      </div>
    </div>

  </div>
</template>

<script>
import lyInputImg from '@/components/input-img'

import http from 'axios'
import * as i18n from '@/i18n/register'

export default {
  name: 'register-view',
  mounted () {
    document.querySelector('#register-focus').focus()
  },
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

    /* messages */
    msg: function () {
      return i18n[this.$store.state.profile.lang]
    },

    /* form validation */
    errName: function () {
      return /\W/.test(this.name) || /^$/.test(this.name) ||
        this.nameTaken
    },
    errEmail: function () {
      return !(/^[^@\s]+[@][^@\s]+$/.test(this.email)) ||
        this.emailTaken
    },
    errPwds: function () {
      return (/^$/.test(this.pwd1) || /^$/.test(this.pwd2)) ||
        (this.pwd1 !== this.pwd2)
    },
    errForm: function () {
      return this.errName || this.errEmail || this.errPwds
    }
  },
  methods: {

    focusImgInput: function () {
      document.querySelector('#image-input').focus()
    },

    isNameTaken: function () {
      let ctx = this
      if (ctx.name.length === 0) {
        ctx.nameTaken = false
        return
      }
      http.get(`accounts/name/${ctx.name}`)
        .then(function ({data}) {
          ctx.nameTaken = data
        })
    },

    isEmailTaken: function () {
      let ctx = this
      if (ctx.email.length === 0) {
        ctx.emailTaken = false
        return
      }
      http.get(`accounts/email/${ctx.email}`)
        .then(function ({data}) {
          ctx.emailTaken = data
        })
    },

    submit: function () {
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
          lang: this.$store.state.profile.lang
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
        .then(http.spread(function () {
          ctx.submitOk = true
        })).catch(function (err) {
          console.log(err)
          ctx.errmsg = this.msg.fail
        }).then(function () {
          ctx.busy = false
        })
    }
  },
  components: {
    lyInputImg
  }
}
</script>

<style scoped>
*:focus {
  outline-offset: 5px;
  outline: 2px dashed deepskyblue;
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
</style>

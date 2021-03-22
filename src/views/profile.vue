<!--
Filename: profile.vue 
Use: User Profile Settings, such as password and avatar
Creator: core
Date: unknown
Dependencies: 
  axios,
  vuex,
  @/i18n/profile,
  @/backend-url.ts
-->

<template>
  <div>
    <div class="container-fluid">
      <div class="row">
        <!-- profile header -->
        <div class="bg-dark w-100 pt-5 pb-3">
          <!-- avatar -->
          <img
            v-if="avatar !== ''"
            :src="avatarURL"
            alt="Avatar"
            class="d-block rounded-circle mx-auto avatar"
          >
          <img
            v-else
            src="../assets/anmelden.svg"
            alt="Avatar"
            class="d-block rounded-circle mx-auto avatar"
          >

          <h1 class="text-center text-light">{{ profile.name }}</h1>
        </div>
      </div>
      <!-- row -->
    </div>
    <!-- container -->

    <div class="container">
      <div class="row">
        <form class="w-100" style="margin-top: 1rem">
          <h1>{{ i18n.title }}</h1>
          <hr>

          <!-- Name -->
          <div class="form-group row">
            <label for="username" class="col-sm-3 col-form-label">{{ i18n.namePH }}</label>
            <div class="col-sm-9">
              <input
                id="username"
                type="text"
                class="form-control"
                v-model="profile.name"
                readonly
                tabindex="-1"
              >
            </div>
          </div>

          <!-- Email -->
          <div class="form-group row">
            <label for="email" class="col-sm-3 col-form-label">{{ i18n.emailPH }}</label>
            <div class="col-sm-9">
              <input
                id="email"
                type="text"
                class="form-control"
                v-model="profile.email"
                readonly
                tabindex="-1"
              >
            </div>
          </div>

          <hr>
          <!-- Old Password -->
          <div class="form-group row">
            <label for="oldPwd" class="col-sm-3 col-form-label">{{ i18n.oldPwd }}</label>
            <div class="col-sm-9">
              <input
                id="oldPwd"
                type="password"
                class="form-control"
                v-model="oldPwd"
                :placeholder="i18n.oldPwd"
                autocomplete="on"
              >
            </div>
          </div>

          <!-- New Password -->
          <div class="form-group row">
            <label for="newPwd" class="col-sm-3 col-form-label">{{ i18n.newPwd }}</label>
            <div class="col-sm-9">
              <input
                id="newPwd"
                type="password"
                class="form-control"
                v-model="newPwd"
                :placeholder="i18n.newPwd"
                aria-describedby="pwdMsg"
              >
              <strong id="pwdMsg" class="form-text text-center">{{ pwdMsg }}</strong>
            </div>
          </div>
          <hr>

          <!-- Default Media Forms -->
          <div class="form-group row">
            <label class="col-sm-3 col-form-label">{{ i18n.defmedia.label }}</label>
            <div class="col-sm-9 d-inline-flex justify-content-between align-items-center">
              <!-- Text -->
              <div class="checkbox-inline">
                <label>
                  <input type="checkbox" v-model="prefs.media.text">
                  {{ i18n.defmedia.text }}
                </label>
              </div>

              <!-- Simple -->
              <div class="checkbox-inline">
                <label>
                  <input type="checkbox" v-model="prefs.media.simple">
                  {{ i18n.defmedia.simple }}
                </label>
              </div>

              <!-- Video -->
              <div class="checkbox-inline">
                <label>
                  <input type="checkbox" v-model="prefs.media.video">
                  {{ i18n.defmedia.video }}
                </label>
              </div>

              <!-- Audio -->
              <div class="checkbox-inline">
                <label>
                  <input type="checkbox" v-model="prefs.media.audio">
                  {{ i18n.defmedia.audio }}
                </label>
              </div>
            </div>
          </div>

          <!-- Save Button -->
          <div class="form-group">
            <button
              type="submit"
              @click="submit"
              :disabled="busy"
              class="btn btn-block btn-lg btn-outline-dark"
              style="border-width: 2px"
            >
              <i class="fas fa-check"></i>
              {{ i18n.submit }}
            </button>
          </div>
          <strong class="form-text text-center">{{ formMsg }}</strong>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import http from 'axios'
import * as i18n from '@/i18n/profile'
import api from '../backend-url.ts'
import { mapState } from 'vuex'

export default {
  name: 'profile-view',
  data() {
    return {
      avatar: null,
      oldPwd: '',
      newPwd: '',
      pwdMsg: '',
      formMsg: '',
      busy: false,

      prefs: {}
    }
  },
  computed: {
    ...mapState(['profile']),

    /**
     * i18n: Load translation files depending on user langugage
     * 
     * Author: cmc
     * 
     * Last updated: March 21, 2021
     * 
     */
    i18n() {
      return i18n[this.profile.lang]
    },

    /**
     * avatarURL: return URL of user avatar
     * 
     * Author: core
     * 
     * Last Updated: unknown
     */
    avatarURL() {
      return `${api()}/storage/img/download/${this.avatar}`
    }
  },
  created() {
    // make profile settings mutable 
    this.avatar = this.profile.avatar
    this.prefs = { ...this.profile.prefs }
  },
  methods: {
    
    /**
     * Function submit: get password change request and fire it
     * 
     * Author: core
     * 
     * Last Updated: unknown
     */
    submit() {
      this.busy = true
      const ctx = this
      ctx.formMsg = ''

      const requests = []

      /* change password request */
      if (ctx.oldPwd !== '' && ctx.newPwd !== '') {
        requests.push(
          http
            .post('accounts/change-password', {
              oldPassword: ctx.oldPwd,
              newPassword: ctx.newPwd
            })
            .catch(err => {
              console.error(err)
              ctx.pwdMsg = ctx.i18n.pwdFail
            })
        )
      }

      /* fire requests */
      http
        .all(requests)
        .then(
          http.spread(() => {
            ctx.formMsg = ctx.i18n.submitOk
          })
        )
        .catch(function(err) {
          console.log(err)
          // ctx.formMsg = ctx.i18n.submitFail
        })
        .then(() => {
          ctx.busy = false
          setTimeout(() => {
            ctx.formMsg = ''
          }, 2000)
        })

      /* update state */
      ctx.$store.commit('setPrefs', ctx.prefs)
    },

    /**
     * Function onProfileImg: do nothing
     * 
     * Author: core
     * 
     * Last Updated: unknown
     */
    onProfileImg(img) {
      //FIXME is never called
      if (!img) return
    }
  },
  components: {
  }
}
</script>

<style scoped>
.avatar {
  width: 7rem;
  height: 7rem;
  border: 2px solid #eee;
  background-color: #eee;
}

.checkbox-inline label {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  margin: 0;
}

.checkbox-inline input {
  margin-right: 5px;
}
</style>

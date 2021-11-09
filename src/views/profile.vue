<!--
Filename: profile.vue
Use: User Profile Settings, such as password and avatar
Creator: core
Date: unknown
Dependencies:
  axios,
  vuex,
  vue-password-strength-meter,
  @/mixins/locale.vue
  @/backend-url.ts,
  @/plugins/misc/laya-upload-avatar/avatar.vue
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
          <h1 :class="langIsAr? 'text-right' : 'text-left'">
            {{ i18n['profile.title'] }}
          </h1>
          <hr>

          <!-- Name -->
          <div class="form-group row">
            <label for="username"
                   class="col-sm-3 col-form-label">{{ i18n['namePH'] }}</label>
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
            <label for="email"
                   class="col-sm-3 col-form-label">{{ i18n['emailPH'] }}</label>
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
            <label for="oldPwd" class="col-sm-3 col-form-label">{{ i18n['profile.oldPwd'] }}</label>
            <div class="col-sm-9">
              <input
                id="oldPwd"
                type="password"
                class="form-control"
                v-model="oldPwd"
                :placeholder="i18n['profile.oldPwd']"
                autocomplete="on"
              >
            </div>
          </div>

          <!-- New Password -->
          <div class="form-group row">
            <label
              id="new-pwd-label"
              for="newPwd"
              class="col-sm-3 col-form-label"
            >
              {{ i18n['profile.newPwd'] }}
            </label>
            <div class="col-sm-9">
              <input
                id="newPwd"
                type="password"
                class="form-control"
                v-model="newPwd"
                :placeholder="i18n['profile.newPwd']"
                aria-describedby="new-pwd-label"
              >
            </div>
          </div>

          <!-- repeat password -->
          <div class="form-group row">
            <label
              id="repeat-label"
              for="repeatPwd"
              class="col-sm-3 col-form-label"
            >
              {{ i18n['pwd2PH'] }}
            </label>
            <div class="col-sm-9">
              <input
                id="repeatPwd"
                type="password"
                class="form-control"
                v-model="repeatPwd"
                :placeholder="i18n['pwd2PH']"
                aria-describedby="repeat-label"
              >
            </div>
          </div>
          <div class="form-group row">
            <!--suppress XmlInvalidId -->
            <label
              for="pwdMeter"
              class="col-sm-3 col-form-label"
            >
              {{ i18n['profile.pwdStrength'] }}
            </label>
            <div class="col-sm-9">
              <password
                id="pwdMeter"
                v-model="newPwd"
                :strength-meter-only="true"
                :secure-length="8"
                @feedback="showFeedback"
                @score="setPwdStrength"
              ></password>
              <strong class="form-text text-center">
                {{ wordedPwdStrength }}
              </strong>
            </div>
          </div>


          <div
            v-if="showSuggestions"
            class="form-group row"
          >
            <div
              class="col-sm-3"
            >
              {{ i18n['profile.pwdSuggestion'] }}
            </div>
            <div
              class="col-sm-9"
              id="pwd-suggestions"
            >
              <strong
                id="testPwdMeter"
                class="form-text text-center">
                {{ warnings }}
              </strong>

              <strong
                id="pwdDiffMsg"
                class="form-text text-center"
              >
                {{ pwdDiffMsg }}
              </strong>
              <strong
                id="pwdStoreMsg"
                class="form-text text-center"
              >
                {{ pwdMsg }}
              </strong>
            </div>
          </div>
          <hr>

          <!-- avatar upload TODO: FIX Cropper Problems

          <div class="form-group row">
            <div class="col-sm-3">
              Avatar
            </div>
            <div class="col-sm-3" >
              <img :src="avatarURL">
            </div>
            <div class="col-sm-6">
              <laya-upload-avatar :oldAvatar="avatarURL" :type="'avatar'"></laya-upload-avatar>
            </div>

          </div>


          <hr>
          -->


          <!-- Default Media Forms -->
          <div class="form-group row">
            <label class="col-sm-3 col-form-label">{{ i18n['profile.defmedia.label'] }}</label>
            <div class="col-sm-9 d-inline-flex justify-content-between align-items-center">
              <!-- Text -->
              <div class="checkbox-inline">
                <label>
                  <input type="checkbox" v-model="prefs.media.text">
                  {{ i18n['profile.defmedia.text'] }}
                </label>
              </div>

              <!-- Simple -->
              <div class="checkbox-inline">
                <label>
                  <input type="checkbox" v-model="prefs.media.simple">
                  {{ i18n['profile.defmedia.simple'] }}
                </label>
              </div>

              <!-- Video -->
              <div class="checkbox-inline">
                <label>
                  <input type="checkbox" v-model="prefs.media.video">
                  {{ i18n['profile.defmedia.video'] }}
                </label>
              </div>

              <!-- Audio -->
              <div class="checkbox-inline">
                <label>
                  <input type="checkbox" v-model="prefs.media.audio">
                  {{ i18n['profile.defmedia.audio'] }}
                </label>
              </div>
            </div>
          </div>

          <hr>
          <!-- Font Options -->
          <div class="form-group row">
            <label class="col-sm-3 col-form-label">
              {{ i18n['profile.fontOptions'] }}
            </label>
            <div
              class="col-sm-9 d-inline-flex justify-content-between align-items-center">
              <div class="input-inline">
                <label>
                  {{ i18n['profile.font'] }}
                  <b-form-select
                    v-model="prefs.font.chosen"
                  >
                    <b-form-select-option
                      v-for="(opt, i) in introFontOptions"
                      :key="i"
                      :value="opt.value"
                      :class="`laya-font-${opt.value}`"
                      >
                      <span :class="opt.value? `laya-font-${opt.value}`:''">
                        {{ opt.text }}
                      </span>
                    </b-form-select-option>
                  </b-form-select>
                </label>
              </div>
              <!-- Font Size -->
              <div>
                <label>
                  {{ i18n['profile.fontSize'] }}
                  <b-form-input
                    type="range"
                    v-model="chosenSize"
                    min="0"
                    :max="fontSizeOptions.length-1"
                  ></b-form-input>
                </label>
                <div class="d-flex justify-content-between w-100">
                  <div
                    v-for="(opt, i) in fontSizeOptions"
                    :key="`text-option-${i}`"
                  >
                    {{ opt }}
                  </div>
                </div>
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
              {{ i18n['save'] }}
            </button>
          </div>
          <strong class="form-text text-center">{{ formMsg }}</strong>
        </form>
      </div>
    </div>
    <b-toast variant="danger" id="submit-failed" :title="i18n['savingFailed']"
             class="author-toast" auto-hide-delay="1500" static>
      {{ i18n['profile.submitFail']}}
    </b-toast>
    <b-toast variant="success" id="submit-ok" :title="i18n['layaUploadFileList.success']"
             class="author-toast" auto-hide-delay="1500" static>
      {{ i18n['profile.submitOk']}}
    </b-toast>
  </div>
</template>

<script>
import http from 'axios'
import { locale, pwdStrength } from '@/mixins'
import api from '../backend-url.ts'
import Password from 'vue-password-strength-meter'
import { mapState } from 'vuex'
import fontOptions from '@/misc/font-options'
import fontSizeOptions from '@/misc/font-options'
import 'open-dyslexic/open-dyslexic-regular.css'
import '@/styles/fonts.css'
//import LayaUploadAvatar from '@/plugins/misc/laya-upload-avatar/avatar.vue'

export default {
  name: 'profile-view',

  components: {
    Password,
    // LayaUploadAvatar
  },

  mixins: [
    locale,
    pwdStrength
  ],

  data() {
    return {
      avatar: null,
      oldPwd: '',
      newPwd: '',
      repeatPwd: '',
      pwdMsg: '',
      formMsg: '',
      busy: false,
      passwordStrength: null,
      prefs: {},
      ...fontOptions,
      ...fontSizeOptions
    }
  },

  computed: {
    ...mapState(['profile']),

    /**
     * avatarURL: return URL of user avatar
     *
     * Author: core
     *
     * Last Updated: unknown
     */
    avatarURL() {
      return (!this.avatar || this.avatar === '') ?
        null : `${api}/storage/img/download/${this.avatar}`
    },

    /**
     * chosenSize: returns index of chosen size in fontSizeOptions,
     *  sets pref.font.size when changed
     *
     * Author: cmc
     *
     * Last Updated: September 22, 2021
     * @returns {number} index in fontSizeOptions array
     */
    chosenSize: {
      get() {
        return this.fontSizeOptions.indexOf(this.prefs.font.size)
      },
      set(newVal) {
        this.prefs.font.size = this.fontSizeOptions[newVal]
      }
    },

    /**
     * introFontOptions(): add placeholder in locale to fontOptions
     *
     * Author: cmc
     *
     * Last Updated: September 22, 2021
     */
    introFontOptions() {
      return [
        {value: null, text: this.i18n['profile.fontChoose']},
        ...this.fontOptions
      ]
    },

    /**
     * passwordsDiffer: returns true if passwords differ
     *
     * Author: cmc
     *
     * Last Updated: March 24, 2021
     */
    passwordsDiffer() {
      return this.newPwd !== this.repeatPwd
    },

    /**
     * pwdDiffMsg: returns a message if passwords differ
     *
     * Author: cmc
     *
     * Last Updated: March 24, 2021
     */
    pwdDiffMsg() {
      return this.passwordsDiffer? this.i18n['profile.pwdDiffer'] : ''
    },

    /**
     * showSuggestions: boolean to show suggestions row
     *
     * Author: cmc
     *
     * Last Updated: September 22, 2021
     * @returns {boolean} true if any of the suggestions aren't empty
     */
    showSuggestions() {
      return this.warnings !== '' || this.pwdDiffMsg !== '' || this.pwdMsg !== ''
    },

    /**
     * wordedPwdStrength(): word pwd strength for linguistic support
     *
     * Author: cmc
     *
     * Last Updated: September 22, 2021
     * @returns {string} password strength in locale
     */
    wordedPwdStrength() {
      return this.passwordStrength != null?
        this.i18n[`pwdStrength${this.passwordStrength}`]:
        ''
    }
  },

  beforeDestroy() {
    //save changes in profile
    this.$store.commit('setPrefs', this.prefs)
    this.$store.dispatch('saveProfile')
  },

  created () {
    // make profile settings mutable
    this.avatar = this.profile.avatar
    this.prefs = JSON.parse(JSON.stringify(this.profile.prefs))
    if (!this.prefs.media) { // avoid render error when no prefs set
      this.prefs.media = {}
    }
    if (!this.prefs.font) {
      this.prefs.font = {
        chosen: 'standard',
        size: 18
      }
    }
  },

  methods: {

    /**
     * function setPwdStrength: set passwordStrength data property
     *
     * Author: cmc
     *
     * Last Updated: September 22, 2021
     */
    setPwdStrength(num) {
      this.passwordStrength = num
    },

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
            ctx.pwdMsg = ctx.i18n['profile.pwdFail']
          })
        )
      }
      // console.log(requests)
      /* fire requests */
      http
      .all(requests)
      .then(
        http.spread(() => {
          ctx.formMsg = ctx.i18n['profile.submitOk']
        })
      )
      .catch(function(err) {
        console.log(err)
        ctx.$bvToast.show('submit-failed')
      })
      .then(() => {
        ctx.busy = false
        setTimeout(() => {
          ctx.formMsg = ''
        }, 2000)
        ctx.$forceUpdate()
        ctx.$bvToast.show('submit-ok')
      })

      /* update state */
      ctx.$store.commit('setPrefs', ctx.prefs)
    },

    /**
     * function showFeedback: load feedback for pwd strength
     *
     * Author: pj
     *
     * Last Updated: July 26, 2021
     * @param suggestions
     * @param warning
     */
    showFeedback({ suggestions, warning }) {
      this.pwdSuggestions({ suggestions, warning })
    }
  },
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

.author-toast {
  position: fixed;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 11002;
}
</style>

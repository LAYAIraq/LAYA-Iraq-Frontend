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

<!--suppress JSAnnotator -->
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

          <h2 class="text-center text-light">
            {{ profile.username }}
          </h2>
        </div>
      </div>
      <!-- row -->
    </div>
    <!-- container -->

    <div class="container">
      <div class="row">
        <form
          class="w-100"
          style="margin-top: 1rem"
        >
          <h1 :class="langIsAr? 'text-right' : 'text-left'">
            {{ y18n('profile.title') }}
          </h1>
          <hr>

          <!-- Name -->
          <div class="form-group row">
            <label
              for="username"
              class="col-sm-3 col-form-label"
            >{{ y18n('namePH') }}</label>
            <div class="col-sm-9">
              <input
                id="username"
                v-model="profile.username"
                type="text"
                class="form-control"
                readonly
                tabindex="-1"
              >
            </div>
          </div>

          <!-- Email -->
          <div class="form-group row">
            <label
              for="email"
              class="col-sm-3 col-form-label"
            >{{ y18n('emailPH') }}</label>
            <div class="col-sm-9">
              <input
                id="email"
                v-model="profile.email"
                type="text"
                class="form-control"
                readonly
                tabindex="-1"
              >
            </div>
          </div>

          <hr>
          <!-- Old Password -->
          <div class="form-group row">
            <label
              for="oldPwd"
              class="col-sm-3 col-form-label"
            >{{ y18n('profile.oldPwd') }}</label>
            <div class="col-sm-9">
              <input
                id="oldPwd"
                v-model="oldPwd"
                type="password"
                class="form-control"
                :placeholder="y18n('profile.oldPwd')"
                autocomplete="on"
              >
            </div>
          </div>

          <PasswordInput
            class="pwd-input"
            :label-icons-only="false"
            :label-width="3"
            @compliantLength="newPwdOk"
          ></PasswordInput>
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
            <label class="col-sm-3 col-form-label">{{ y18n('profile.defmedia.label') }}</label>
            <div class="col-sm-9 d-inline-flex justify-content-between align-items-center">
              <!-- Text -->
              <div class="checkbox-inline">
                <label>
                  <input
                    v-model="prefs.media.text"
                    type="checkbox"
                  >
                  {{ y18n('profile.defmedia.text') }}
                </label>
              </div>

              <!-- Simple -->
              <div class="checkbox-inline">
                <label>
                  <input
                    v-model="prefs.media.simple"
                    type="checkbox"
                  >
                  {{ y18n('profile.defmedia.simple') }}
                </label>
              </div>

              <!-- Video -->
              <div class="checkbox-inline">
                <label>
                  <input
                    v-model="prefs.media.video"
                    type="checkbox"
                  >
                  {{ y18n('profile.defmedia.video') }}
                </label>
              </div>

              <!-- Audio -->
              <div class="checkbox-inline">
                <label>
                  <input
                    v-model="prefs.media.audio"
                    type="checkbox"
                  >
                  {{ y18n('profile.defmedia.audio') }}
                </label>
              </div>
            </div>
          </div>

          <hr>
          <!-- Font Options -->
          <div class="form-group row">
            <label class="col-sm-3 col-form-label">
              {{ y18n('profile.fontOptions') }}
            </label>
            <div
              class="col-sm-9 d-inline-flex justify-content-between align-items-center"
            >
              <div class="input-inline">
                <label>
                  {{ y18n('profile.font') }}
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
                  {{ y18n('profile.fontSize') }}
                  <b-form-input
                    v-model="chosenSize"
                    type="range"
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
              id="save-profile"
              type="submit"
              :disabled="busy || !passwordInputOk"
              class="btn btn-block btn-lg btn-outline-dark"
              style="border-width: 2px"
              @click.prevent="submit"
            >
              <i class="fas fa-check"></i>
              {{ y18n('save') }}
            </button>
          </div>
          <strong class="form-text text-center">{{ formMsg }}</strong>
        </form>
      </div>
      <hr>
      <div
        v-if="!isAuthor"
        id="author-application"
        class="row"
      >
        <div class="col-3">
          Apply as author
          <i
            v-b-tooltip.auto
            class="fas fa-question-circle"
            title="You can apply as author for LAYA. Your application will be revisited by the editor board. Click here to fill out your application!"
          ></i>
        </div>
        <div class="col">
          <b-button
            id="application-button"
            block
            variant="secondary"
            @click="$bvModal.show('author-application-form')"
          >
            Fill out application
          </b-button>
        </div>
      </div>
    </div>
    <b-toast
      id="submit-failed"
      variant="danger"
      :title="y18n('savingFailed')"
      class="author-toast"
      auto-hide-delay="1500"
      static
    >
      {{ y18n('profile.submitFail') }}
    </b-toast>
    <b-toast
      id="submit-ok"
      variant="success"
      :title="y18n('layaUploadFileList.success')"
      class="author-toast"
      auto-hide-delay="1500"
      static
    >
      {{ y18n('profile.submitOk') }}
    </b-toast>
    <b-modal
      id="author-application-form"
      title="Apply as author"
      header-bg-variant="info"
      ok-variant="success"
      ok-title="Send application"
      :cancel-title="y18n('cancel')"
      centered
      static
      @ok="prepareApplication"
    >
      <div class="form-group p-2">
        <div class="form-group row">
          <label
            for="applicant-name"
            class="col-form-label"
          >
            Full Name
          </label>
          <input
            id="applicant-name"
            v-model="fullName"
            class="form-control"
            type="text"
          >
        </div>
        <div class="form-group row">
          <label
            for="applicant-institution"
            class="col-form-label"
          >
            Institution
          </label>
          <input
            id="applicant-institution"
            v-model="institution"
            class="form-control"
            type="text"
          >
        </div>
        <div class="form-group row">
          <label
            for="applicant-expertise"
            class="col-form-label"
          >
            Area of Expertise
          </label>
          <input
            id="applicant-expertise"
            v-model="areaOfExpertise"
            class="form-control"
            type="text"
          >
        </div>
        <div class="form-group row">
          <label
            for="applicant-text"
            class="col-form-label"
          >
            Application text
            <i
              v-b-tooltip.auto
              class="fas fa-question-circle"
              title="Enter your application here. Please mention your area of expertisea and degrees if applicable. Please expand on the courses you plan on creating for LAYA."
            ></i>
          </label>
          <textarea
            id="applicant-text"
            v-model="applicationText"
            class="form-control"
            rows="5"
          ></textarea>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { locale, pwdProps } from '@/mixins'
import api from '@/backend-url'
import PasswordInput from '@/components/password-input.vue'
import { mapGetters, mapActions } from 'vuex'
import fontOptions from '@/misc/font-options'
import fontSizeOptions from '@/misc/font-size-options'
// import '@/styles/fonts.css'
// import LayaUploadAvatar from '@/plugins/misc/laya-upload-avatar/avatar.vue'

export default {
  name: 'ProfileView',

  components: {
    PasswordInput // not lazily loaded b/c always visible
  },

  mixins: [
    locale,
    pwdProps
  ],

  data () {
    return {
      avatar: null,
      oldPwd: '',
      pwdMsg: '',
      formMsg: '',
      busy: false,
      prefs: {},
      institution: '',
      areaOfExpertise: '',
      fullName: '',
      applicationText: '',
      edited: null
    }
  },

  computed: {
    ...mapGetters([
      'isAuthor',
      'profile',
      'userApplication',
      'userId'
    ]),

    /**
     * avatarURL: return URL of user avatar
     *
     * Author: core
     *
     * Last Updated: unknown
     */
    avatarURL () {
      return (!this.avatar || this.avatar === '')
        ? null
        : `${api}/storage/img/download/${this.avatar}`
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
      get () {
        return this.fontSizeOptions.indexOf(this.prefs.font.size)
      },
      set (newVal) {
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
    introFontOptions () {
      return [
        { value: null, text: this.y18n('profile.fontChoose') },
        ...fontOptions
      ]
    },

    fontSizeOptions () {
      return fontSizeOptions
    },

    /**
     * function newPasswordInput: returns something when password input is set
     *
     * Author: cmc
     *
     * Last Updated: February 21, 2022
     * @returns {string}
     */
    newPasswordInput () {
      return this.passwordRepeat ||
        this.passwordSet
    },

    /**
     * passwordsInputOk: returns true if no new password set or
     *  new password is secure
     *
     * Author: cmc
     *
     * Last Updated: February 21, 2022
     */
    passwordInputOk () {
      return this.newPasswordInput
        ? this.passwordOk
        : true
    }
  },

  watch: {
    profile: {
      deep: true,
      handler () {
        this.prefs = JSON.parse(JSON.stringify(this.profile.prefs))
      }
    },
    userApplication (val) {
      this.applicationText = val.applicationText
      this.institution = val.institution
      this.areaOfExpertise = val.areaOfExpertise
      this.fullName = val.fullName
    }
  },

  beforeDestroy () {
    // save changes in profile
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
    if (!this.userApplication) {
      this.getApplicationUser(this.userId)
    }
  },

  methods: {
    ...mapActions([
      'getApplicationUser',
      'sendApplication',
      'updateApplication'
    ]),

    prepareApplication () {
      // const applicationData = {
      //
      // }
    },

    /**
     * Function submit: get password change request and fire it
     *
     * Author: core
     *
     * Last Updated: unknown
     */
    submit () {
      this.formMsg = ''

      /* change password request */
      if (this.newPasswordInput) {
        this.busy = true
        this.$store.dispatch('changePassword', this.oldPwd)
          .then(() => {
            this.$bvToast.show('submit-ok')
          })
          .catch(err => {
            console.error(err)
            this.pwdMsg = this.y18n('profile.pwdFail')
            this.$bvToast.show('submit-failed')
          })
          .finally(() => {
            this.busy = false
          })
      }

      /* update state and save profile preferences */
      this.$store.commit('setPrefs', this.prefs)
      this.$store.dispatch('saveProfile')
    }
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

.author-toast {
  position: fixed;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 11002;
}
</style>

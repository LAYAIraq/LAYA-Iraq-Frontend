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

            <h1 class="text-center text-light">
              {{ profile.username }}
            </h1>
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
            <h3 :class="langIsAr? 'text-right' : 'text-left'">
              {{ y18n('profile.title') }}
            </h3>
            <hr>

            <!-- Username -->
            <div class="form-group row">
              <label
                for="username"
                class="col-sm-3 col-form-label"
              >{{ y18n('usernamePH') }}</label>
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

            <!-- Full Name -->
            <div class="form-group row">
              <label
                for="fullname"
                class="col-sm-3 col-form-label"
              >{{ y18n('namePH') }}</label>
              <div class="col-sm-9">
                <input
                  id="fullname"
                  v-model="profile.fullName"
                  type="text"
                  class="form-control"
                  :placeholder="y18n('namePH')"
                  autocomplete="on"
                >
              </div>
            </div>

            <!-- Institution -->
            <div class="form-group row">
              <label
                for="institution"
                class="col-sm-3 col-form-label"
              >{{ y18n('institutionPH') }}</label>
              <div class="col-sm-9">
                <b-form-select
                  v-model="profile.institution"
                >
                  <b-form-select-option
                    v-for="(opt, i) in chooseInstitution"
                    :key="i"
                    :value="opt.value"
                  >
                    <span :class="opt.value">
                      {{ opt.text }}
                    </span>
                  </b-form-select-option>
                </b-form-select>
              </div>
            </div>

            <!-- Occupation -->
            <div class="form-group row">
              <label
                for="occupation"
                class="col-sm-3 col-form-label"
              >{{ y18n('occupationPH') }}</label>
              <div class="col-sm-9">
                <b-form-select
                  v-model="profile.occupation"
                >
                  <b-form-select-option
                    v-for="(opt, i) in chooseOccupation"
                    :key="i"
                    :value="opt.value"
                  >
                    <span :class="opt.value">
                      {{ opt.text }}
                    </span>
                  </b-form-select-option>
                </b-form-select>
              </div>
            </div>

            <hr>

            <div class="container">
              <div class="row">
                <form
                  class="w-100"
                  style="margin-top: 1rem"
                >
                  <h3 :class="langIsAr? 'text-right' : 'text-left'">
                    {{ y18n('profile.change') }}
                  </h3>
                  <hr>
                  <div class="row row-cols-3">
                    <!-- change username -->
                    <div class="col-3">
                      <b-button
                        id="username-button"
                        block
                        variant="secondary"
                        @click="$bvModal.show('change-username-form')"
                      >
                        {{ y18n('profile.changeUsername') }}
                      </b-button>
                      <b-modal
                        id="change-username-form"
                        :title="y18n('profile.changeUsername')"
                        header-bg-variant="info"
                        ok-variant="success"
                        :ok-title="y18n('save')"
                        :cancel-title="y18n('cancel')"
                        centered
                        static
                        @ok="changeUsername"
                      >
                        <!-- new username -->
                        <div class="form-group row">
                          <label
                            for="newUsername"
                            class="col-sm-3 col-form-label"
                          >{{ y18n('profile.newUsername') }}</label>
                          <div class="col-sm-9">
                            <input
                              id="newUsername"
                              v-model="newUsername"
                              type="username"
                              class="form-control"
                              :placeholder="y18n('profile.newUsername')"
                              autocomplete="on"
                            >
                          </div>
                        </div>
                      </b-modal>
                    </div>

                    <!-- change email -->
                    <div class="col-3">
                      <b-button
                        id="email-button"
                        block
                        variant="secondary"
                        @click="$bvModal.show('change-email-form')"
                      >
                        {{ y18n('profile.changeEmail') }}
                      </b-button>
                      <b-modal
                        id="change-email-form"
                        :title="y18n('profile.changeEmail')"
                        header-bg-variant="info"
                        ok-variant="success"
                        :ok-title="y18n('save')"
                        :cancel-title="y18n('cancel')"
                        centered
                        static
                        @ok="changeEmailAddress"
                      >
                        <!-- Old email -->
                        <div class="form-group row">
                          <label
                            for="oldEmail"
                            class="col-sm-3 col-form-label"
                          >{{ y18n('profile.oldEmail') }}</label>
                          <div class="col-sm-9">
                            <input
                              id="oldEmail"
                              v-model="oldEmail"
                              type="email"
                              class="form-control"
                              :placeholder="y18n('profile.oldEmail')"
                              autocomplete="on"
                            >
                          </div>
                        </div>
                        <!-- new email -->
                        <div class="form-group row">
                          <label
                            for="newEmail"
                            class="col-sm-3 col-form-label"
                          >{{ y18n('profile.newEmail') }}</label>
                          <div class="col-sm-9">
                            <input
                              id="newEmail"
                              v-model="newEmail"
                              type="email"
                              class="form-control"
                              :placeholder="y18n('profile.newEmail')"
                              autocomplete="on"
                            >
                          </div>
                        </div>
                        <!-- repeat email -->
                        <div class="form-group row">
                          <label
                            for="repeatEmail"
                            class="col-sm-3 col-form-label"
                          >{{ y18n('profile.repeatEmail') }}</label>
                          <div class="col-sm-9">
                            <input
                              id="repeatEmail"
                              v-model="repeatEmail"
                              type="email"
                              class="form-control"
                              :placeholder="y18n('profile.repeatEmail')"
                              autocomplete="on"
                            >
                          </div>
                        </div>
                      </b-modal>
                    </div>

                    <!-- change password -->
                    <div class="col-3">
                      <b-button
                        id="password-button"
                        block
                        variant="secondary"
                        @click="$bvModal.show('change-password-form')"
                      >
                        {{ y18n('profile.changePassword') }}
                      </b-button>
                      <b-modal
                        id="change-password-form"
                        :title="y18n('profile.changePassword')"
                        header-bg-variant="info"
                        ok-variant="success"
                        :ok-title="y18n('save')"
                        :cancel-title="y18n('cancel')"
                        centered
                        static
                        @ok="changePassword"
                      >
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
                        <!-- new password -->
                        <PasswordInput
                          class="pwd-input"
                          :label-icons-only="false"
                          :label-width="3"
                          @compliantLength="newPwdOk"
                        ></PasswordInput>
                      </b-modal>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </form>
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
      <accessibility-settings></accessibility-settings>
      <author-application></author-application>
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

    <b-toast
      id="profile-save-toast"
      :title="y18n('profile.submitOk')"
      static
      variant="success"
      auto-hide-delay="1500"
      class="profile-toast"
    >
      {{ y18n('successfulSave') }}
    </b-toast>
    <b-toast
      id="email-error"
      :title="y18n('profile.error')"
      static
      variant="danger"
      auto-hide-delay="1500"
      class="profile-toast"
    >
      {{ y18n('profile.emailError') }}
    </b-toast>
    <b-toast
      id="username-error"
      :title="y18n('profile.error')"
      static
      variant="danger"
      auto-hide-delay="1500"
      class="profile-toast"
    >
      {{ y18n('profile.usernameError') }}
    </b-toast>
  </div>
</template>

<script>
import { locale, pwdProps } from '@/mixins'
import api from '@/backend-url'
import PasswordInput from '@/components/password-input.vue'
import { mapActions, mapGetters } from 'vuex'
import institutions from '@/misc/institutions'
import occupations from '@/misc/occupations'
import AuthorApplication from '@/components/author-application'
import AccessibilitySettings from '@/components/accessibility-settings'
// import '@/styles/fonts.css'
// import LayaUploadAvatar from '@/plugins/misc/laya-upload-avatar/avatar.vue'

export default {
  name: 'ProfileView',

  components: {
    PasswordInput, // not lazily loaded b/c always visible
    AuthorApplication,
    AccessibilitySettings
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
      institution: '',
      occupation: '',
      fullName: '',
      oldEmail: '',
      repeatEmail: '',
      newEmail: '',
      nameTaken: '',
      email: '',
      newUsername: ''
    }
  },

  computed: {
    ...mapGetters([
      'profile',
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
     * chooseInstitution(): add institutions
     *
     * Author: nv
     *
     * Last Updated: Feburary 13, 2023
     */
    chooseInstitution () {
      return [
        { value: '', text: this.y18n('institutionPH') },
        ...institutions
      ]
    },

    /**
     * chooseOccupation(): add occupation
     *
     * Author: nv
     *
     * Last Updated: Feburary 13, 2023
     */
    chooseOccupation () {
      return [
        { value: '', text: this.y18n('occupationPH') },
        ...occupations
      ]
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
    }
  },

  beforeDestroy () {
    // save changes in profile
    this.setPrefs(this.prefs)
    this.saveProfile()
    this.submitApplication()
    this.$store.commit('clearApplicationList')
  },

  created () {
    this.setProfileForRender()
    window.addEventListener('beforeunload', () => {
      this.$destroy()
    })
  },

  methods: {
    ...mapActions([
      'saveProfile'
    ]),

    /**
     * function setProfileForRender: deep copy prefs for mutation, render
     *
     * Author: cmc
     *
     * Last Updated: May 6, 2022
     */
    setProfileForRender () {
      // make profile settings mutable and render
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

    checkEmail (email) {
      if (this.email === this.repeatEmail && this.checkFormat(this.email) === false && this.checkEmailTaken(email) === false && this.email !== '') {
        return true
      } else {
        return false
      }
    },

    checkFormat (email) {
      if (this.email === '') return false
      return !(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email))
    },

    checkEmailTaken (email) {
      this.$store.dispatch('checkEmailTaken', this.email)
        .then(() => { return true })
        .catch(() => { return false })
    },

    changeEmailAddress () {
      if (this.oldEmail === this.profile.email) {
        if (this.checkEmail(this.newEmail) === true) {
          this.$store.commit('setEmail', this.newEmail)
          this.$bvToast.show('submit-ok')
          this.$store.dispatch('saveProfile')
            .then(() => { this.$bvToast.show('profile-save-toast') })
        } else {
          this.$bvToast.show('email-error')
        }
      }
    },

    changeUsername () {
      if (this.newUsername !== '') {
        this.$store.dispatch('checkNameTaken', this.newUsername)
          .then(() => {
            this.$bvToast.show('username-error')
          })
          .catch(() => {
            this.$store.commit('setUsername', this.newUsername)
            this.$store.dispatch('saveProfile')
              .then(() => { this.$bvToast.show('profile-save-toast') })
              .catch(() => { this.$bvToast.show('submit-failed') })
          })
      } else {
        this.$bvToast.show('submit-failed')
      }
    },

    changePassword () {
      if (this.newPasswordInput) {
        this.busy = true
        this.$store.dispatch('changePassword', this.oldPwd)
          .then(() => {
            this.$bvToast.show('submit-ok')
            this.$store.dispatch('saveProfile')
              .then(() => { this.$bvToast.show('profile-save-toast') })
              .catch(err => {
                console.error(err)
                this.pwdMsg = this.y18n('profile.pwdFail')
                this.$bvToast.show('submit-failed')
              })
              .finally(() => {
                this.busy = false
              })
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
    },

    /**
     * Function submit: get password change request and fire it
     *
     * Author: core
     *
     * Last Updated: February 06, by nv
     */
    submit () {
      this.formMsg = ''

      this.$store.commit('setFullName', this.profile.fullName)
      this.$store.commit('setInstitution', this.profile.institution)
      this.$store.commit('setOccupation', this.profile.occupation)
      /* update state and save profile preferences */
      this.$store.commit('setPrefs', this.prefs)
      this.$store.dispatch('saveProfile')
        .then(() => { this.$bvToast.show('profile-save-toast') })
        .catch(err => {
          console.error(err)
          this.$bvToast.show('submit-failed')
        })
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

.profile-toast {
  position: fixed;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 11002;
}
</style>

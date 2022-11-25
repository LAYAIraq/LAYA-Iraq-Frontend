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
                v-model="fullName"
                type="text"
                class="form-control"
                :placeholder="y18n('namePH')"
                autocomplete="on"
              >
            </div>
          </div>

          <!-- Intitution -->
          <div class="form-group row">
            <label
              for="institution"
              class="col-sm-3 col-form-label"
            >{{ y18n('institutionPH') }}</label>
            <div class="col-sm-9">
              <b-form-select
                v-model="institution"
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
              for="statusgroup"
              class="col-sm-3 col-form-label"
            >{{ y18n('occupationPH') }}</label>
            <div class="col-sm-9">
              <b-form-select
                v-model="occupation"
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
                <div class="row">
                  <div class="column">
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
                      :title="y18n('profile.password')"
                      header-bg-variant="info"
                      ok-variant="success"
                      :ok-title="y18n('profile.password.save')"
                      :cancel-title="y18n('cancel')"
                      centered
                      static
                      @ok="submit"
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

                      <PasswordInput
                        class="pwd-input"
                        :label-icons-only="false"
                        :label-width="3"
                        @compliantLength="newPwdOk"
                      ></PasswordInput>
                    </b-modal>
                  </div>
                  <div class="column">
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
                      :title="y18n('profile.password')"
                      header-bg-variant="info"
                      ok-variant="success"
                      :ok-title="y18n('profile.password.save')"
                      :cancel-title="y18n('cancel')"
                      centered
                      static
                      @ok="submit"
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

                      <PasswordInput
                        class="pwd-input"
                        :label-icons-only="false"
                        :label-width="3"
                        @compliantLength="newPwdOk"
                      ></PasswordInput>
                    </b-modal>
                  </div>
                  <div class="column">
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
                      :title="y18n('profile.password')"
                      header-bg-variant="info"
                      ok-variant="success"
                      :ok-title="y18n('profile.password.save')"
                      :cancel-title="y18n('cancel')"
                      centered
                      static
                      @ok="submit"
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

          <div class="container">
            <div class="row">
              <form
                class="w-100"
                style="margin-top: 1rem"
              >
                <h3 :class="langIsAr? 'text-right' : 'text-left'">
                  {{ y18n('profile.accessibility') }}
                </h3>
                <hr>
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
          </div>
        </form>
      </div>

      <hr>
      <!-- author application -->
      <div
        v-if="!isAuthor"
        id="author-application"
        class="row"
      >
        <div class="col-3">
          {{ y18n('profile.application') }}
          <i
            v-b-tooltip.auto
            class="fas fa-question-circle"
            :title="y18n('profile.application.tooltip')"
          ></i>
        </div>
        <div
          v-if="applicationNew && applicationEdited === -1"
          class="col"
        >
          <b-button
            id="application-button"
            block
            variant="secondary"
            @click="$bvModal.show('author-application-form')"
          >
            {{ y18n('profile.application.fillOut') }}
          </b-button>
        </div>
        <div
          v-else-if="userApplication &&
            userApplication.decidedOn"
          class="col"
        >
          <span
            v-if="userApplication.status === 'withdrawn'"
            id="application-withdrawn"
          >
            {{ y18n('profile.application.withdrawn')
              .replace('{DATE}', Date(userApplication.decidedOn)
                .toLocaleString()) }}
          </span>
          <span
            v-else
            id="application-decided"
          >
            {{ y18n('profile.application.decided')
              .replace('{date}', Date(userApplication.decidedOn)
                .toLocaleString()
              ).replace('{status}', userApplication.status)
            }}
          </span>
          <span v-if="userApplication.status === 'accepted'">
            {{ y18n('profile.application.congrats') }}
          </span>
        </div>
        <div
          v-else
          class="col"
        >
          <b-button
            id="edit-application-button"
            block
            variant="secondary"
            @click="$bvModal.show('author-application-form')"
          >
            {{ y18n('profile.application.edit') }}
          </b-button>
          <b-button
            id="withdraw-application-button"
            block
            variant="warning"
            @click="$bvModal.show('application-withdraw-modal')"
          >
            {{ y18n('profile.application.withdraw') }}
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
      :title="y18n('profile.application')"
      header-bg-variant="info"
      ok-variant="success"
      :ok-title="y18n('profile.application.save')"
      :cancel-title="y18n('cancel')"
      centered
      static
      @ok="saveApplication"
    >
      <div class="form-group p-2">
        <div class="form-group row">
          <label
            for="applicant-name"
            class="col-form-label"
          >
            {{ y18n('profile.application.fullName') }}
          </label>
          <input
            id="applicant-name"
            v-model="formInput.fullName"
            class="form-control"
            type="text"
          >
        </div>
        <div class="form-group row">
          <label
            for="applicant-institution"
            class="col-form-label"
          >
            {{ y18n('profile.application.institution') }}
          </label>
          <input
            id="applicant-institution"
            v-model="formInput.institution"
            class="form-control"
            type="text"
          >
        </div>
        <div class="form-group row">
          <label
            for="applicant-expertise"
            class="col-form-label"
          >
            {{ y18n('profile.application.areaOfExpertise') }}
          </label>
          <input
            id="applicant-expertise"
            v-model="formInput.areaOfExpertise"
            class="form-control"
            type="text"
          >
        </div>
        <div class="form-group row">
          <label
            for="applicant-text"
            class="col-form-label"
          >
            {{ y18n('profile.application.text') }}
            <i
              v-b-tooltip.auto
              class="fas fa-question-circle"
              :title="y18n('profile.application.textTooltip')"
            ></i>
          </label>
          <textarea
            id="applicant-text"
            v-model="formInput.applicationText"
            class="form-control"
            rows="5"
          ></textarea>
        </div>
      </div>
    </b-modal>
    <b-modal
      id="application-withdraw-modal"
      :title="y18n('profile.application.withdraw')"
      header-bg-variant="warning"
      ok-variant="warning"
      :ok-title="y18n('profile.application.withdraw')"
      :cancel-title="y18n('cancel')"
      centered
      static
      @ok="withdrawApplication"
    >
      <p>
        {{ y18n('profile.application.withdrawConfirm') }}
      </p>
    </b-modal>
  </div>
</template>

<script>
import { locale, pwdProps } from '@/mixins'
import api from '@/backend-url'
import PasswordInput from '@/components/password-input.vue'
import { mapActions, mapGetters, mapMutations } from 'vuex'
import institutions from '@/misc/institutions'
import occupations from '@/misc/occupations'
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
      institution: '',
      occupation: '',
      prefs: {},
      fullName: '',
      formInput: {
        applicationText: '',
        areaOfExpertise: ''
      },
      applicationEdited: -1, // increments once when data is loaded from store
      applicationNew: false
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
     * chooseInstitution(): add institutions
     *
     * Author: nv
     *
     * Last Updated: November 07, 2022
     */
    chooseInstitution () {
      return institutions
    },

    /**
     * chooseOccupation(): add occupation
     *
     * Author: nv
     *
     * Last Updated: November 25, 2022
     */
    chooseOccupation () {
      return occupations
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
    formInput: { // watch for changed on form input
      handler () {
        this.applicationEdited++
      },
      deep: true
    },
    profile: {
      deep: true,
      handler () {
        this.prefs = JSON.parse(JSON.stringify(this.profile.prefs))
      }
    },
    userApplication (val) { // mirror changes in store for render (e.g. when new application is set)
      this.formInput.applicationText = val.applicationText
      this.formInput.institution = val.institution
      this.formInput.areaOfExpertise = val.areaOfExpertise
      this.formInput.fullName = val.fullName
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
    this.setUserApplication()
    window.addEventListener('beforeunload', () => {
      this.$destroy()
    })
  },

  methods: {
    ...mapActions([
      'getApplicationUser',
      'saveProfile',
      'sendApplication',
      'sendApplicationDecision',
      'updateApplication'
    ]),
    ...mapMutations([
      'addApplication',
      'decideOnApplication',
      'editApplication',
      'setPrefs'
    ]),

    /**
     * functionSaveApplication: save edits to application in store
     *
     * Author: cmc
     *
     * Last Updated: May 4, 2022
     */
    saveApplication () {
      const {
        applicationText,
        areaOfExpertise,
        fullName,
        institution
      } = this.formInput
      // noinspection JSCheckFunctionSignatures
      if (this.applicationNew) {
        this.addApplication({
          applicationText: applicationText,
          areaOfExpertise: areaOfExpertise,
          fullName: fullName,
          institution: institution,
          applicantId: this.userId
        })
      } else if (this.applicationEdited > 0) {
        this.editApplication({
          id: this.userApplication.id,
          applicationText: applicationText,
          areaOfExpertise: areaOfExpertise,
          fullName: fullName,
          institution: institution
        })
      }
      this.$bvToast.toast(this.y18n('profile.application.saved'), {
        title: this.y18n('profile.success'),
        toaster: 'b-toaster-bottom-center',
        variant: 'success'
      })
    },

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

    /**
     * function setUserApplication: set mutable application parts, fetch
     *  application if none present
     *
     *  Author: cmc
     *
     *  Last Updated: May 6, 2022
     */
    setUserApplication () {
      if (!this.userApplication) {
        this.getApplicationUser(this.userId)
          .then(resp => {
            if (!resp) { // application doesn't exist
              this.applicationNew = true
            }
          })
          .catch(err => console.error(err))
      } else { // userApplication already in store, set values for render
        this.formInput.applicationText = this.userApplication.applicationText
        this.formInput.institution = this.userApplication.institution
        this.formInput.areaOfExpertise = this.userApplication.areaOfExpertise
        this.formInput.fullName = this.userApplication.fullName
      }
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
    },

    /**
     * function submitApplication: depending on if application existed before,
     *  update existing or send new application, to be called onDestoy
     *
     *  Author: cmc
     *
     *  Last Updated: May 4, 2022
     */
    submitApplication () {
      if (this.applicationNew) {
        this.sendApplication(this.userApplication)
      } else {
        this.updateApplication(this.userApplication)
      }
    },

    /**
     * function withdrawApplication: withdraw application, save in store
     *
     * Author: cmc
     *
     * Last Updated: May 6, 2022
     */
    withdrawApplication () {
      this.decideOnApplication({ applicationId: this.userApplication.id, decision: 'withdrawn' })
      this.sendApplicationDecision()
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

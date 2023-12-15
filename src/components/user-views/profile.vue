<!--
Filename: profile.vue
Use: User Profile Settings, such as password and avatar
Creator: core
Since: v1.0.0
-->

<!--suppress JSAnnotator -->
<template>
  <main>
    <div>
      <div>
        <div class="container-fluid">
          <div class="row">
            <!-- profile header -->
            <div class="bg-dark w-100 pt-5 pb-3">
              <!-- avatar -->
              <div class="d-block mx-auto avatar rounded-circle">
                <img
                  v-if="avatarURL"
                  v-auth-image="avatarURL"
                  :class="langIsAr? 'rounded-circle avatar-display ar' : 'rounded-circle avatar-display'"
                >
                <i
                  v-else
                  class="fas fa-chalkboard-teacher display-3 pt-3 pl-2"
                ></i>
                <b-badge
                  v-b-tooltip.bottom
                  pill
                  variant="warning"
                  class="edit-badge"
                  :title="y18n('profile.editAvatar')"
                  @click="avatarChange"
                >
                  <i class="fas fa-edit"></i>
                </b-badge>
              </div>
              <!--
              <img
                v-if="avatar !== ''"
                :src="avatarURL"
                alt="Avatar"
                class="d-block rounded-circle mx-auto avatar"
              >
              <img
                v-else
                src="../../assets/images/anmelden.svg"
                alt="Avatar"
                class="d-block rounded-circle mx-auto avatar"
              >
  -->
              <h1 class="text-center text-light">
                {{ username }}
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
                    v-model="username"
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
                    v-model="email"
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
                    v-model="institution"
                  >
                    <b-form-select-option
                      v-for="opt in institutionChoose"
                      :key="opt"
                      :value="opt"
                    >
                      {{ y18n(`profile.institution.${opt}`) }}
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
                    v-model="occupation"
                  >
                    <b-form-select-option
                      v-for="opt in occupationChoose"
                      :key="opt"
                      :value="opt"
                    >
                      {{ y18n(`profile.occupation.${opt}`) }}
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
                      <div class="col">
                        <b-button
                          id="username-button"
                          block
                          variant="secondary"
                          @click="usernamePop = true; passwordPop = false; emailPop = false"
                        >
                          {{ y18n('profile.usernameChange') }}
                        </b-button>
                      </div>

                      <!-- change email -->
                      <div class="col">
                        <b-button
                          id="email-button"
                          block
                          variant="secondary"
                          @click="emailPop = true; passwordPop = false; usernamePop = false"
                        >
                          {{ y18n('profile.emailChange') }}
                        </b-button>
                      </div>

                      <!-- change password -->
                      <div class="col">
                        <b-button
                          id="password-button"
                          block
                          variant="secondary"
                          @click="passwordPop = true; emailPop = false; usernamePop = false"
                        >
                          {{ y18n('profile.passwordChange') }}
                        </b-button>
                      </div>
                    </div>

                    <form>
                      <div class="col mt-3">
                        <!-- username pop up -->
                        <div
                          v-if="usernamePop"
                          class="col"
                        >
                          <!-- new username -->
                          <div class="form-group row">
                            <label
                              for="newUsername"
                              class="col-sm-3 col-form-label"
                            >{{ y18n('profile.usernameNew') }}</label>
                            <div class="col-sm-9">
                              <p>
                                <input
                                  id="newUsername"
                                  v-model="usernameNew"
                                  type="text"
                                  class="form-control"
                                  :placeholder="y18n('profile.usernameNew')"
                                  autocomplete="on"
                                >
                              </p>
                              <p
                                v-if="usernameTaken"
                                id="username-taken"
                              >
                                {{ y18n('profile.usernameTaken') }}
                              </p>
                              <p
                                v-if="usernameNew === ''"
                                id="username-empty"
                              >
                                {{ y18n('profile.usernameEmpty') }}
                              </p>
                              <p
                                v-if="usernameNew === username"
                                id="username-same"
                              >
                                {{ y18n('profile.usernameSame') }}
                              </p>
                            </div>
                          </div>
                          <b-button
                            variant="primary"
                            @click="usernamePop = false"
                          >
                            {{ y18n('cancel') }}
                          </b-button>
                          <b-button
                            variant="success"
                            class="mx-3"
                            :disabled="usernameNew === username || usernameNew === ''"
                            @click="usernameChange"
                          >
                            {{ y18n('save') }}
                          </b-button>
                        </div>
                        <!-- email pop up -->
                        <div
                          v-if="emailPop"
                          class="col"
                        >
                          <!-- Old email -->
                          <div class="form-group row">
                            <label
                              for="oldEmail"
                              class="col-sm-3 col-form-label"
                            >{{ y18n('profile.emailOld') }}</label>
                            <div class="col-sm-9">
                              <input
                                id="oldEmail"
                                v-model="emailOld"
                                type="text"
                                class="form-control"
                                :placeholder="y18n('profile.emailOld')"
                                autocomplete="on"
                              >
                              <p
                                v-if="emailOld !== email"
                                id="email-old-incorrect"
                              >
                                {{ y18n('profile.emailOldIncorrect') }}
                              </p>
                              <p
                                v-if="emailOld === ''"
                                id="email-old-empty"
                              >
                                {{ y18n('profile.emailEmpty') }}
                              </p>
                            </div>
                          </div>
                          <!-- new email -->
                          <div class="form-group row">
                            <label
                              for="newEmail"
                              class="col-sm-3 col-form-label"
                            >{{ y18n('profile.emailNew') }}</label>
                            <div class="col-sm-9">
                              <input
                                id="newEmail"
                                v-model="emailNew"
                                type="text"
                                class="form-control"
                                :placeholder="y18n('profile.emailNew')"
                                autocomplete="on"
                              >
                              <p
                                v-if="emailNewTaken"
                                id="email-new-taken"
                              >
                                {{ y18n('profile.emailNewTaken') }}
                              </p>
                              <p
                                v-if="emailNewConform"
                                id="email-new-not-conform"
                              >
                                {{ y18n('profile.emailNewNotConform') }}
                              </p>
                              <p
                                v-if="emailNew === ''"
                                id="email-new-empty"
                              >
                                {{ y18n('profile.emailEmpty') }}
                              </p>
                            </div>
                          </div>
                          <!-- repeat email -->
                          <div class="form-group row">
                            <label
                              for="repeatEmail"
                              class="col-sm-3 col-form-label"
                            >{{ y18n('profile.emailRepeat') }}</label>
                            <div class="col-sm-9">
                              <input
                                id="repeatEmail"
                                v-model="emailRepeat"
                                type="text"
                                class="form-control"
                                :placeholder="y18n('profile.emailRepeat')"
                                autocomplete="on"
                              >
                              <p
                                v-if="emailRepeat !== emailNew"
                                id="email-compare-incorrect"
                              >
                                {{ y18n('profile.emailCompareIncorrect') }}
                              </p>
                            </div>
                          </div>
                          <b-button
                            variant="primary"
                            @click="emailPop = false"
                          >
                            {{ y18n('cancel') }}
                          </b-button>
                          <b-button
                            variant="success"
                            class="mx-3"
                            :disabled="emailRepeat !== emailNew || emailOld !== email"
                            @click="emailChange"
                          >
                            {{ y18n('save') }}
                          </b-button>
                        </div>
                        <!-- password pop up -->
                        <div
                          v-if="passwordPop"
                          class="col"
                        >
                          <!-- Old Password -->
                          <div class="form-group row">
                            <label
                              for="oldPwd"
                              class="col-sm-3 col-form-label"
                            >{{ y18n('profile.oldPassword') }}</label>
                            <div class="col-sm-9">
                              <input
                                id="passwordOld"
                                v-model="passwordOld"
                                type="password"
                                class="form-control"
                                :placeholder="y18n('profile.oldPassword')"
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
                          <b-button
                            variant="primary"
                            @click="passwordPop = false"
                          >
                            {{ y18n('cancel') }}
                          </b-button>
                          <b-button
                            variant="success"
                            class="mx-3"
                            @click="passwordChange"
                          >
                            {{ y18n('save') }}
                          </b-button>
                        </div>
                      </div>
                    </form>

                    <hr>
                  </form>
                </div>
              </div>
            </form>
          </div>
        </div>

        <accessibility-settings @prefsChanged="p => prefs = p">
        </accessibility-settings>

        <author-application> </author-application>

        <div class="container">
          <div class="col">
            <!-- Save Button -->
            <div class="form-group">
              <b-button
                id="save-profile"
                type="submit"
                :disabled="busy || !passwordInputOk"
                class="btn-block btn-lg btn-success"
                style="border-width: 2px"
                @click.prevent="submit"
              >
                <i class="fas fa-save"></i>
                {{ y18n('save') }}
              </b-button>
            </div>
          </div>
        </div>

        <!-- avatar modal -->
        <b-modal
          id="avatar-change-modal"
          :title="y18n('profile.avatar.change')"
          header-bg-variant="warning"
          ok-variant="success"
          cancel-variant="primary"
          centered
          static
          :ok-title="y18n('save')"
          :cancel-title="y18n('cancel')"
          @ok="submit"
        >
          <!-- avatar upload -->
          <div class="container">
            <div class="col">
              <div class="col">
                <upload-avatar
                  :old-avatar="avatarURL"
                  @uploaded="a => $store.commit('avatarSet', a)"
                ></upload-avatar>
              </div>
            </div>
          </div>
        </b-modal>
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
          :title="y18n('uploadFileList.success')"
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
      </div>
    </div>
  </main>
</template>

<script>
import { locale, password } from '@/mixins'
import { deepCopy } from '@/mixins/general/helpers'
import api from '@/backend-url'
import PasswordInput from '@/components/helpers/password-input.vue'
import { mapActions, mapGetters, mapMutations } from 'vuex'
import AuthorApplication from '@/components/user-views/author-application'
import AccessibilitySettings from '@/components/user-views/accessibility-settings'
import institutions from '@/options/institution.ts'
import occupations from '@/options/occupation.ts'
// import '@/styles/fonts.css'
import UploadAvatar from '@/components/helpers/upload-avatar'

export default {
  name: 'Profile',

  components: {
    AccessibilitySettings,
    AuthorApplication,
    UploadAvatar,
    PasswordInput // not lazily loaded b/c always visible
  },

  mixins: [
    locale,
    password
  ],

  data () {
    return {
      avatar: null,
      busy: false,
      emailNew: '',
      emailNewConform: null,
      emailNewTaken: null,
      emailOld: '',
      emailRepeat: '',
      passwordMessage: '',
      passwordOld: '',
      prefs: {},
      usernameNew: '',
      usernameTaken: null,
      passwordPop: false,
      emailPop: false,
      usernamePop: false
    }
  },

  computed: {
    ...mapGetters([
      'fullName',
      'institution',
      'occupation',
      'password',
      'passwordRepeat',
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
      return (!this.profile.avatar || this.profile.avatar === '')
        ? null
        : `${api}/storage/img/download/${this.profile.avatar}`
    },
    email: {
      get () {
        return this.profile.email
      },
      set (val) {
        this.$store.commit('emailSet', val)
      }
    },
    fullName: {
      get () {
        return this.profile.fullName
      },
      set (val) {
        this.$store.commit('fullNameSet', val)
      }
    },
    /**
     * institutionChoose(): add institutions
     *
     * Author: nv
     *
     * Last Updated: April 13, 2023
     */
    institutionChoose () {
      return [
        ...institutions
      ]
    },
    institution: {
      get () {
        return this.profile.institution
      },
      set (val) {
        this.$store.commit('institutionSet', val)
      }
    },
    /**
     * occupationChoose(): add occupation
     * Author: nv
     * Last Updated: April 13, 2023
     */
    occupationChoose () {
      return [
        ...occupations
      ]
    },
    occupation: {
      get () {
        return this.profile.occupation
      },
      set (val) {
        this.$store.commit('occupationSet', val)
      }
    },
    /**
     * function passwordInputNew: returns something when password input is set
     *
     * Author: cmc
     *
     * Last Updated: February 21, 2022
     * @returns {string}
     */
    passwordInputNew () {
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
      return this.passwordInputNew
        ? this.passwordOk
        : true
    },
    username: {
      get () {
        return this.profile.username
      },
      set (val) {
        this.$store.commit('usernameSet', val)
      }
    }
  },
  watch: {
    emailNew () { // reset email taken if email input changes
      if (this.emailTaken) {
        this.emailTaken = false
      }
      if (this.emailNewConform) {
        this.emailNewConform = false
      }
    },
    usernameNew () { // reset username taken if username input changes
      if (this.usernameTaken) {
        this.usernameTaken = false
      }
    }
  },
  beforeDestroy () {
    this.profileUpdate()
  },
  created () {
    this.setProfileForRender()
    // window.addEventListener('beforeunload', () => {
    //   this.$destroy()
    // })
  },
  methods: {
    ...mapActions([
      'checkEmailTaken',
      'checkNameTaken',
      'passwordUpdate',
      'profileUpdate'
    ]),
    ...mapMutations([
      'emailSet',
      'fullNameSet',
      'institutionSet',
      'occupationSet',
      'preferencesSet',
      'usernameSet'
    ]),
    /**
     * @function change avatar if requirements are fulfilled
     * @author nv
     * @since v1.3.0
     */
    avatarChange () {
      this.$bvModal.show('avatar-change-modal')
    },
    /**
     * @function change email if requirements are fulfilled
     * @author nv
     * @since v1.3.0
     */
    emailChange (e) {
      e.preventDefault()
      if (this.emailOld === this.email &&
        this.emailNew === this.emailRepeat) {
        if ((/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.emailNew))) {
          this.emailNewConform = false
          this.$store.dispatch('checkEmailTaken', this.emailNew)
            .then(() => {
              this.emailNewTaken = true
              this.$bvToast.show('submit-failed')
            })
            .catch(() => {
              this.$store.commit('emailSet', this.emailNew)
              this.submit()
              this.emailPop = false
            })
        } else {
          this.emailNewConform = true
        }
      }
    },
    /**
     * @function change password if requirements are fulfilled
     * @author cmc
     * @since v1.1.0
     */
    passwordChange () {
      if (this.passwordInputNew) {
        this.busy = true
        this.$store.dispatch('passwordUpdate', this.passwordOld)
          .then(() => {
            this.passwordOld = ''
            this.$store.commit('passwordSet', '')
            this.$store.commit('passwordRepeatSet', '')
            this.submit()
            this.passwordPop = false
          })
          .catch(err => {
            console.error(err)
            this.passwordMessage = this.y18n('profile.passwordFail')
            this.$bvToast.show('submit-failed')
          })
          .finally(() => {
            this.busy = false
          })
      }
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
      const tmp = deepCopy(this.profile)
      console.log(tmp)
      for (const key of Object.keys(tmp)) {
        if (!key.includes('pref')) {
          console.log('setting', key, 'to', tmp[key])
          this[key] = tmp[key]
        }
      }
    },
    /**
     * Function submit: get password change request and fire it
     * Author: core
     * Since: v1.0.0
     */
    submit () {
      this.formMsg = ''
      /* update state and save profile preferences */
      this.$store.commit('preferencesSet', this.prefs)
      this.$store.dispatch('profileUpdate')
        .then(() => {
          this.$bvToast.show('profile-save-toast')
        })
        .catch(err => {
          console.error(err)
          this.$bvToast.show('submit-failed')
        })
    },
    /**
     * @function check if username is taken
     * @author nv
     * @since v1.3.0
     */
    usernameChange (e) {
      e.preventDefault()
      this.$store.dispatch('checkNameTaken', this.usernameNew)
        .then(resp => {
          if (!resp) {
            this.$store.commit('usernameSet', this.usernameNew)
            this.submit()
            this.usernamePop = false
          } else {
            this.usernameTaken = true
            this.$bvToast.show('submit-failed')
          }
        })
        .catch(err => { console.log(err) })
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
  position: relative;
  box-sizing: content-box;
}
.avatar-display {
  width: 7rem;
  height: 7rem;
  position: absolute;
}

.ar {
  position: absolute;
  left: 0px;
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
.edit-badge {
  position: absolute;
  right: -10px;
  top: -10px;
  font-size: .9em;
  border-radius: 50%;
  padding: 3px;
  min-width: 25px;
  min-height: 25px;
  cursor: pointer;
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

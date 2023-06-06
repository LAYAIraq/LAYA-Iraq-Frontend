
<!--
  Filename: author-application.vue
  Use: Author application modal for profile
  Creator: nv
  Since: v1.3.0
-->
<template>
  <div>
    <div class="container">
      <!-- buttons -->
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
      <hr>
    </div>
    <!-- modals -->
    <b-modal
      id="application-withdraw-modal"
      :title="y18n('profile.application.withdraw')"
      header-bg-variant="warning"
      ok-variant="warning"
      :ok-title="y18n('profile.application.withdraw')"
      :cancel-title="y18n('cancel')"
      centered
      static
      @ok="applicationWithdraw"
    >
      <p>
        {{ y18n('profile.application.withdrawConfirm') }}
      </p>
    </b-modal>
    <b-modal
      id="author-application-form"
      :title="y18n('profile.application')"
      header-bg-variant="info"
      ok-variant="success"
      :ok-title="y18n('profile.application.save')"
      :cancel-title="y18n('cancel')"
      centered
      static
      @ok="applicationSave"
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
            v-model="fullName"
            class="form-control"
            type="text"
            readonly
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
            v-model="institution"
            class="form-control"
            type="text"
            readonly
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
  </div>
</template>

<script>
import { locale } from '@/mixins'
import { mapActions, mapGetters, mapMutations } from 'vuex'
export default {
  name: 'AuthorApplication',
  mixins:
    [locale],
  data () {
    return {
      applicationEdited: -1, // increments once when data is loaded from store
      applicationNew: false,
      formInput: {
        applicationText: '',
        areaOfExpertise: ''
      }
    }
  },
  computed: {
    ...mapGetters([
      'isAuthor',
      'profile',
      'userApplication'
    ]),
    fullName: {
      get () {
        return this.profile.fullName
      },
      set (val) {
        this.$store.commit('fullNameSet', val)
      }
    },
    institution: {
      get () {
        return this.y18n(`profile.institution.${this.profile.institution}`)
      },
      set (val) {
        this.$store.commit('institutionSet', val)
      }
    }
  },
  watch: {
    formInput: { // watch for changed on form input
      handler () {
        this.applicationEdited++
      },
      deep: true
    },
    userApplication (val) { // mirror changes in store for render (e.g. when new application is set)
      this.formInput.applicationText = val.applicationText
      this.formInput.areaOfExpertise = val.areaOfExpertise
    }
  },
  beforeDestroy () {
    this.applicationSubmit()
    this.$store.commit('applicationListClear')
  },
  created () {
    this.applicationUserSet()
  },
  methods: {
    ...mapActions([
      'userApplicationCreate',
      'userApplicationDecide',
      'userApplicationFetch',
      'userApplicationUpdate'
    ]),
    ...mapMutations([
      'applicationAdd',
      'applicationDecide',
      'applicationEdit',
      'applicationListClear'
    ]),
    /**
     * functionSaveApplication: save edits to application in store
     *
     * Author: cmc
     *
     * Last Updated: May 4, 2022
     */
    applicationSave () {
      const {
        applicationText,
        areaOfExpertise
      } = this.formInput
      // noinspection JSCheckFunctionSignatures
      if (this.applicationNew) {
        this.applicationAdd({
          applicationText: applicationText,
          areaOfExpertise: areaOfExpertise,
          fullName: this.profile.fullName,
          institution: this.profile.institution,
          applicantId: this.userId
        })
      } else if (this.applicationEdited > 0) {
        this.applicationEdit({
          id: this.userApplication.id,
          applicationText: applicationText,
          areaOfExpertise: areaOfExpertise,
          fullName: this.profile.fullName,
          institution: this.profile.institution
        })
      }
      this.$bvToast.toast(this.y18n('profile.application.saved'), {
        title: this.y18n('profile.success'),
        toaster: 'b-toaster-bottom-center',
        variant: 'success'
      })
    },
    /**
     * function applicationSubmit: depending on if application existed before,
     *  update existing or send new application, to be called onDestoy
     *
     *  Author: cmc
     *
     *  Last Updated: May 4, 2022
     */
    applicationSubmit () {
      if (this.applicationNew) {
        this.userApplicationCreate(this.userApplication)
      } else {
        this.userApplicationUpdate(this.userApplication)
      } else {
        console.warn('unexpected case!')
      }
    },
    /**
     * function applicationUserSet: set mutable application parts, fetch
     *  application if none present
     *
     *  Author: cmc
     *
     *  Last Updated: May 6, 2022
     */
    applicationUserSet () {
      if (!this.userApplication) {
        this.userApplicationFetch(this.userId)
          .then(resp => {
            console.log(resp)
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
     * function applicationWithdraw: withdraw application, save in store
     *
     * Author: cmc
     *
     * Last Updated: May 6, 2022
     */
    applicationWithdraw () {
      this.applicationDecide({ applicationId: this.userApplication.id, decision: 'withdrawn' })
      this.userApplicationDecide()
    }
  }
}
</script>

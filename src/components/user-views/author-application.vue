
<!--
  Filename: author-application.vue
  Use: Author application modal for profile
  Creator: nv
  Since: v1.3.0
-->
<template>
  <div>
    <div class="container">
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

      <hr>
    </div>
    <!-- modals -->
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
            v-model="textField.fullName"
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
            v-model="textField.institution"
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
import { locale } from '@/mixins'
import { mapActions, mapGetters, mapMutations } from 'vuex'
export default {
  name: 'AuthorApplication',
  mixins:
    [locale],
  data () {
    return {
      formInput: {
        applicationText: '',
        areaOfExpertise: ''
      },
      applicationEdited: -1, // increments once when data is loaded from store
      applicationNew: false,
      textField: {
        institution: '',
        fullName: ''
      }
    }
  },
  computed: {
    ...mapGetters([
      'isAuthor',
      'userApplication',
      'profile',
      'userId'
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
    // save changes in profile
    this.submitApplication()
    this.$store.commit('clearApplicationList')
  },

  created () {
    this.textField.institution = this.institution
    this.textField.fullName = this.fullName
    this.setUserApplication()
    window.addEventListener('beforeunload', () => {
      this.$destroy()
    })
  },

  methods: {
    ...mapActions([
      'getApplicationUser',
      'sendApplication',
      'sendApplicationDecision',
      'updateApplication'
    ]),
    ...mapMutations([
      'addApplication',
      'decideOnApplication',
      'editApplication'
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
        areaOfExpertise
      } = this.formInput
      // noinspection JSCheckFunctionSignatures
      if (this.applicationNew) {
        this.addApplication({
          applicationText: applicationText,
          areaOfExpertise: areaOfExpertise,
          fullName: this.textField.fullName,
          institution: this.textField.institution,
          applicantId: this.userId
        })
      } else if (this.applicationEdited > 0) {
        this.editApplication({
          id: this.userApplication.id,
          applicationText: applicationText,
          areaOfExpertise: areaOfExpertise,
          fullName: this.textField.fullName,
          institution: this.textField.institution
        })
      }
      this.$bvToast.toast(this.y18n('profile.application.saved'), {
        title: this.y18n('profile.success'),
        toaster: 'b-toaster-bottom-center',
        variant: 'success'
      })
    },

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
        this.textField.institution = this.userApplication.institution
        this.formInput.areaOfExpertise = this.userApplication.areaOfExpertise
        this.textField.fullName = this.userApplication.fullName
      }
    }

  }
}
</script>

<template>
  <div class="container">
    <div class="row">
      <h2>Pending Applications</h2>
    </div>
    <div id="applications-table">
      <!-- table header -->
      <div class="row mt-5">
        <div class="col">
          <strong>
            Applicant's name
          </strong>
        </div>
        <div class="col">
          <strong>
            Applicant's institution
          </strong>
        </div>
        <div class="col">
        </div>
        <div class="col">
          <strong>
            Voting status
          </strong>
        </div>
      </div>
      <hr>
      <!-- table content -->
      <div
        v-for="(application, i) in applicationList"
        :key="`application-${i}`"
        class="row mb-3 application-entry"
      >
        <div class="col applicant-name">
          {{ application.fullName }}
        </div>
        <div class="col applicant-institution">
          {{ application.institution }}
        </div>
        <div class="col">
          <b-button
            variant="secondary"
            @click="prepareViewModal(i)"
          >
            View Application
          </b-button>
        </div>
        <div class="col">
          <span class="vote-count">{{ application.votes || 0 }}</span> / {{
            acceptThreshold }}
        </div>
      </div>
    </div>
    <hr>
    <div class="row mt-5">
      <h2>Your recommendations</h2>
    </div>
    <!-- table header -->
    <div class="row mt-5">
      <div class="col">
        <strong>
          Applicant's name
        </strong>
      </div>
      <div class="col">
        <strong>
          Voting status
        </strong>
      </div>
    </div>
    <div class="row">
      <div class="col">
        Doktor Ahmad
      </div>
      <div class="col">
        Pending
      </div>
    </div>
    <div class="row">
      <div class="col">
        Doktor Layla
      </div>
      <div class="col">
        Approved
      </div>
    </div>
    <b-modal
      id="view-application"
      title="View Author Application"
      header-bg-variant="primary"
      centered
      static
      @ok="voteOnApplication"
      @cancel="revokeVote"
    >
      <div class="form-group p-2">
        <div class="form-group row">
          <span
            class="col-form-label"
          >
            Applicant's Name
          </span>
          <span
            id="modal-name"
            class="ml-auto"
          >
            {{ fullName }}
          </span>
        </div>
        <div class="form-group row">
          <span
            class="col-form-label"
          >
            Institution
          </span>
          <span
            id="modal-institution"
            class="ml-auto"
          >
            {{ institution }}
          </span>
        </div>
        <div class="form-group row">
          <span
            class="col-form-label"
          >
            Area of Expertise
          </span>
          <span
            id="modal-expertise"
            class="ml-auto"
          >
            {{ areaOfExpertise }}
          </span>
        </div>
        <div class="form-group row">
          <span
            class="col-form-label"
          >
            Application text
          </span>
          <span
            id="modal-text"
          >
            {{ applicationText }}
          </span>
        </div>
      </div>
      <template #modal-footer="{ ok, cancel, hide }">
        <b-button
          variant="success"
          :disabled="approved"
          @click="ok"
        >
          Approve Application
        </b-button>
        <b-button
          variant="danger"
          :disabled="!approved"
          @click="cancel"
        >
          Revoke Vote
        </b-button>
        <b-button @click="hide">
          {{ y18n('cancel') }}
        </b-button>
      </template>
    </b-modal>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import { locale } from '@/mixins'

export default {
  name: 'EditorPanel',

  mixins: [locale],

  data () {
    return {
      applicationText: '',
      areaOfExpertise: '',
      currentApplicationIdx: null,
      fullName: '',
      institution: ''
    }
  },

  computed: {
    ...mapGetters([
      'applicationList',
      'editorVotes',
      'isEditor',
      'numberOfEditors',
      'userId'
    ]),

    acceptThreshold  () {
      return Math.ceil((this.numberOfEditors * 0.25))
    },

    approved () {
      return this.existingVote
        ? this.existingVote.vote
        : false
    },

    currentApplication () {
      return this.applicationList[this.currentApplicationIdx]
    },

    existingVote () {
      if (!this.currentApplication) {
        return null
      }
      return this.editorVotes.find(elem =>
        elem.applicationId === this.currentApplication.id
      )
    }
  },

  created () {
    if (!this.isEditor) {
      this.$router.replace('/')
    }
    this.getApplications()
    this.$store.dispatch('getNumberOfEditors')
  },

  methods: {
    ...mapActions(['getApplications']),
    ...mapMutations(['addEditorVote', 'changeVote']),

    prepareViewModal (index) {
      this.currentApplicationIdx = index
      this.applicationText = this.currentApplication.applicationText
      this.areaOfExpertise = this.currentApplication.areaOfExpertise
      this.fullName = this.currentApplication.fullName
      this.institution = this.currentApplication.institution
      this.$bvModal.show('view-application')
    },

    revokeVote () {
      this.changeVote({
        application: this.currentApplication,
        editorId: this.userId,
        vote: false
      })
    },

    voteOnApplication () {
      this.addEditorVote({
        applicationId: this.currentApplication.id,
        editorId: this.userId,
        vote: true
      })
    }
  }
}
</script>

<style scoped>

</style>

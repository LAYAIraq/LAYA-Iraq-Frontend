<!--
  Filename: editor-panel.vue
  Use: Editor panel view
  Author: cmc
  Since: 1.2.0
-->
<template>
  <main>
    <div class="container">
      <div class="row">
        <h2>{{ y18n('editorPanel.pending') }}</h2>
      </div>
      <div id="applications-table">
        <!-- table header -->
        <div class="row mt-5">
          <div class="col">
            <strong>
              {{ y18n('editorPanel.name') }}
            </strong>
          </div>
          <div class="col">
            <strong>
              {{ y18n('editorPanel.institution') }}
            </strong>
          </div>
          <div class="col">
          </div>
          <div class="col">
            <strong>
              {{ y18n('editorPanel.status') }}
            </strong>
          </div>
          <div class="col">
            <strong>
              {{ y18n('editorPanel.decision') }}
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
              variant="primary"
              @click="prepareViewModal(i)"
            >
              {{ y18n('editorPanel.view') }}
            </b-button>
          </div>
          <div class="col application-status">
            <span v-if="!application.votes || application.votes < acceptThreshold">
              <span class="vote-count">{{ application.votes || 0 }}</span>
              / {{ acceptThreshold }}
            </span>
            <span v-else>
              <b-button
                variant="success"
                disabled
              >
                {{ y18n('editorPanel.approved') }}
              </b-button>
            </span>
          </div>
          <div class="col editor-decision">
            <span v-if="showDecision(application.id) === true">
              <b-button
                variant="success"
                disabled
              >
                {{ y18n('editorPanel.approved') }}
              </b-button>
            </span>
            <!-- third option should vetoing be possible -->
            <!--          <span v-else-if="showDecision(application.id) === false">-->
            <!--            <b-button-->
            <!--              variant="danger"-->
            <!--              disabled-->
            <!--            >-->
            <!--              Rejected-->
            <!--            </b-button>-->
            <!--          </span>-->
            <span v-else>
              <b-button
                variant="warning"
                disabled
              >
                {{ y18n('editorPanel.awaiting') }}
              </b-button>
            </span>
          </div>
        </div>
      </div>
      <!-- recommendations omitted for v1.3 -->
      <!--    <hr>-->
      <!--    <div class="row mt-5">-->
      <!--      <h2>Your recommendations</h2>-->
      <!--    </div>-->
      <!--    &lt;!&ndash; table header &ndash;&gt;-->
      <!--    <div class="row mt-5">-->
      <!--      <div class="col">-->
      <!--        <strong>-->
      <!--          Applicant's name-->
      <!--        </strong>-->
      <!--      </div>-->
      <!--      <div class="col">-->
      <!--        <strong>-->
      <!--          Voting status-->
      <!--        </strong>-->
      <!--      </div>-->
      <!--    </div>-->
      <!--    <div class="row">-->
      <!--      <div class="col">-->
      <!--        Doktor Ahmad-->
      <!--      </div>-->
      <!--      <div class="col">-->
      <!--        Pending-->
      <!--      </div>-->
      <!--    </div>-->
      <!--    <div class="row">-->
      <!--      <div class="col">-->
      <!--        Doktor Layla-->
      <!--      </div>-->
      <!--      <div class="col">-->
      <!--        Approved-->
      <!--      </div>-->
      <!--    </div>-->
      <b-modal
        id="view-application"
        :title="y18n('editorPanel.view')"
        header-bg-variant="warning"
        ok-variant="success"
        cancel-variant="primary"
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
              {{ y18n('editorPanel.name') }}
            </span>
            <span
              id="modal-name"
              :class="langIsAr? 'mr-auto': 'ml-auto'"
            >
              {{ fullName }}
            </span>
          </div>
          <div class="form-group row">
            <span
              class="col-form-label"
            >
              {{ y18n('profile.application.institution') }}
            </span>
            <span
              id="modal-institution"
              :class="langIsAr? 'mr-auto': 'ml-auto'"
            >
              {{ institution }}
            </span>
          </div>
          <div class="form-group row">
            <span
              class="col-form-label"
            >
              {{ y18n('profile.application.areaOfExpertise') }}
            </span>
            <span
              id="modal-expertise"
              :class="langIsAr? 'mr-auto': 'ml-auto'"
            >
              {{ areaOfExpertise }}
            </span>
          </div>
          <div class="form-group row">
            <div
              class="col-form-label w-100"
              :class="langIsAr? 'text-right' : 'text-left'"
            >
              {{ y18n('profile.application.text') }}
            </div>
            <div
              id="modal-text"
              class="row m-1"
            >
              {{ applicationText }}
            </div>
          </div>
        </div>
        <template #modal-footer="{ ok, cancel, hide }">
          <b-button
            id="approve-button"
            variant="success"
            :disabled="approved"
            @click="ok"
          >
            {{ y18n('editorPanel.approve') }}
          </b-button>
          <b-button
            id="revoke-button"
            variant="danger"
            :disabled="!approved"
            @click="cancel"
          >
            {{ y18n('editorPanel.revoke') }}
          </b-button>
          <b-button
            variant="primary"
            @click="hide"
          >
            {{ y18n('cancel') }}
          </b-button>
        </template>
      </b-modal>
    </div>
  </main>
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
      decisions: {}, // caching editor decisions
      fullName: '',
      institution: ''
    }
  },

  computed: {
    ...mapGetters([
      'applicationList',
      'editorVotes',
      'isEditor',
      'isAdmin',
      'isSuperAdmin',
      // 'editorNumber', // currently not used
      'userId'
    ]),

    /**
     * acceptTreshold: returns number of necessary votes to be accepted
     *  currently fixed value, can be computed if wanted
     *
     *  Author: cmc
     *
     *  Last Updated: May 14, 2022
     * @returns {number} of people to approve an application
     */
    acceptThreshold  () {
      return 3
      // complex computation commented out for now
      // return Math.ceil((this.editorNumber * 0.25))
    },

    /**
     * approved: returns if user has approved the currecnt application
     *
     *  Author: cmc
     *
     *  Last Updated: May 14, 2022
     * @returns {boolean} if accepted
     */
    approved () {
      return this.existingVote
        ? this.existingVote.vote
        : false
    },

    /**
     * currentApplication: returns copy of application for decision modal
     *
     *  Author: cmc
     *
     *  Last Updated: May 14, 2022
     * @returns {object} current application
     */
    currentApplication () {
      return this.applicationList[this.currentApplicationIdx]
    },

    /**
     * existingVote: returns user's decision on current application
     *
     *  Author: cmc
     *
     *  Last Updated: May 14, 2022
     * @returns {object} current vote
     */
    existingVote () {
      if (!this.currentApplication) {
        return null
      }
      return this.editorVotes.find(elem =>
        (elem.applicationId === this.currentApplication.id) &&
        (elem.editorId === this.userId)
      )
    }
  },

  created () {
    if (!this.isEditor && !this.isAdmin && !this.isSuperAdmin) {
      this.$router.replace('/') // reroute non-editors
    }
    this.applicationsFetch() // get applications
    // this.$store.dispatch('editorNumberFetch') // currently not needed
    this.decisions = this.$ls.get('decisions', {}) // get decisions from local store
  },

  beforeDestroy () {
    this.editorVoteUpdateAll() // persist votes in backend
    this.$ls.set('decisions', this.decisions, 60 * 60 * 1000) // write decisions to local store
  },

  methods: {
    ...mapActions(['applicationsFetch', 'editorVoteUpdateAll']),
    ...mapMutations(['editorVoteAdd', 'editorVoteChange']),

    /**
     * function prepareViewModal: deep copy values from store for render
     *
     *  Author: cmc
     *
     *  Last Updated: May 14, 2022
     * @param index of application in list
     */
    prepareViewModal (index) {
      this.currentApplicationIdx = index
      this.applicationText = this.currentApplication.applicationText
      this.areaOfExpertise = this.currentApplication.areaOfExpertise
      this.fullName = this.currentApplication.fullName
      this.institution = this.currentApplication.institution
      this.$bvModal.show('view-application')
    },

    /**
     * function revokeVote: change vote from yes to no
     *
     *  Author: cmc
     *
     *  Last Updated: May 14, 2022
     */
    revokeVote () {
      // change vote in cache
      this.decisions[this.currentApplication.id] = false
      // change vote in store
      this.editorVoteChange({
        application: this.currentApplication,
        editorId: this.userId,
        vote: false
      })
    },

    /**
     * function showDecision: show decision of user for current application
     *
     *  Author: cmc
     *
     *  Last Updated: May 14, 2022
     * @param id of application
     * @returns {boolean|null} decision of user
     */
    showDecision (id) {
      const { decisions, userId } = this
      if (typeof (decisions[id]) === 'undefined') {
        const editorVote = this.editorVotes.find(el => el.applicationId === id && el.editorId === userId)
        decisions[id] = editorVote ? editorVote.vote : null
      }
      return decisions[id]
    },

    /**
     * function voteOnApplication: vote on application
     *
     *
     *  Author: cmc
     *
     *  Last Updated: May 14, 2022
     */
    voteOnApplication () {
      const voteData = {
        editorId: this.userId,
        vote: true
      }
      // change vote in cache
      this.decisions[this.currentApplication.id] = true
      // change vote in store
      if (!this.existingVote) {
        this.editorVoteAdd({
          ...voteData,
          applicationId: this.currentApplication.id,
          changed: true
        })
      } else {
        this.editorVoteChange({
          ...voteData,
          application: this.currentApplication
        })
      }
    }
  }
}
</script>

<style scoped>

</style>

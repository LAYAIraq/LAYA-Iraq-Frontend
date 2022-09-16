<!--
Filename: course-feedback.vue
Use: download received feedback
Author: nv
Date: September 08, 2022
Dependencies:
  vuex,
  @/mixins/locale.vue
-->

<template>
  <div class="row mt-5">
    <div class="col">
      <b-button
        size="sm"
        variant="success"
        :class="langIsAr? 'float-left' : 'float-right'"
        @click="$bvModal.show('download-feedback')"
      >
        <i class="fas fa-info-circle"></i> {{ y18n('feedback.downloadFeedback') }}
      </b-button>
    </div>
    <div class="col text-dark">
      {{ y18n('feedback.feedbackTip') }}
    </div>
    <b-modal
      id="download-feedback"
      :title="y18n('feedback.modal.title')"
      header-bg-variant="warning"
      ok-variant="warning"
      :ok-title="y18n('feedback.modal.ok')"
      :cancel-title="y18n('cancel')"
      centered
      :aria-label="y18n('popupwarning')"
      @ok="printPDF"
    >
    </b-modal>
  </div>
</template>

<script>

import { mapActions, mapGetters } from 'vuex'
import { locale } from '@/mixins'
import { jsPDF } from 'jspdf'

export default {
  name: 'CourseFeedback',

  mixins: [
    locale
  ],

  data () {
  },

  computed: {
    ...mapActions([
      'fetchEnrollment'
    ]),
    ...mapGetters([
      'enrollmentFeedback',
      'courseId',
      'courseName'
    ])
  },

  methods: {
    /**
     * Function printPDF: prints feedback in a PDF tp download
     * Author: nv
     * Last Updated: September 14, 2022
     */
    printPDF () {
      if (typeof this.enrollmentFeedback !== 'undefined') {
        console.log(this.courseName)
        const id = this.courseId
        /* eslint-disable */
        const doc = new jsPDF()
        /* eslint-enable */
        doc.text('This is the Feedback for course ' + id, 10, 10)

        // display of choice answers
        const choice = JSON.stringify(this.enrollmentFeedback.map(function (item) {
          return item['choice']
        }))
        doc.text('Choice answers: ', 10, 25)
        doc.text(choice, 10, 35)

        // display of free text answers
        const freetext = this.enrollmentFeedback.map(function (item) {
          return item['freetext']
        })
        doc.text('Freetext answers: ', 10, 50)
        doc.text(freetext, 10, 60)

        // display of rating answers
        const rating = JSON.stringify(this.enrollmentFeedback.map(function (item) {
          return item['rating']
        }))
        doc.text('Ratings: ', 10, 75)
        doc.text(rating, 10, 85)

        doc.save('Feedback-' + id + '.pdf')
      } else {
        console.log('No Feedback for this course available.')
      }
    }
  }
}
</script>

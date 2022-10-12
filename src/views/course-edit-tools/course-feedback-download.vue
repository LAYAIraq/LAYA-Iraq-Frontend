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
      static
      centered
      :aria-label="y18n('popupwarning')"
      @ok="printPDF"
    >
      <p>
        {{ y18n('feedback.modal.text') }}
      </p>
    </b-modal>
  </div>
</template>

<script>

import { mapActions, mapGetters } from 'vuex'
import { storeHandler, locale } from '@/mixins'
import { jsPDF } from 'jspdf'

export default {
  name: 'CourseFeedbackDownload',

  mixins: [
    storeHandler,
    locale
  ],

  data () {
  },

  computed: {
    ...mapActions([
      'fetchEnrollmentData'
    ]),
    ...mapGetters([
      'enrollmentFeedback',
      'course',
      'courseId'
    ])
  },

  methods: {
    /**
     * Function getFeedback: gets feedback from store
     * Author: nv
     * Last Updated: October 12, 2022 by nv
     */
    getFeedback (feedback) {
      const promise = this.$store.dispatch('fetchEnrollmentData', this.courseId)
      for (const i in promise.subs) {
        feedback = promise.subs[i].feedback
      }
      return feedback
    },

    /**
     * Function printPDF: prints feedback in a PDF tp download
     * Author: nv
     * Last Updated: October 11, 2022 by nv
     */
    async printPDF () {
      if (typeof this.enrollmentFeedback !== 'undefined') {
        /* eslint-disable */
        const doc = new jsPDF('p','pt')
        /* eslint-enable */
        const feedback = this.getFeedback()

        const name = this.course.name
        const x = 30
        const y = 30
        const lineheight = doc.getTextDimensions('Sample Text').h + 5
        const blockheight = 0

        const parameters = [doc, feedback, x, y, lineheight, blockheight]

        parameters['doc'].text(this.y18n('feedback.document.title') + name, parameters['x'], parameters['y'])
        parameters['y'] += parameters['lineheight'] + 20

        this.printChoices(parameters)
        this.printFreetext(parameters)
        this.printRating(parameters)

        const date = parameters['doc'].getCreationDate('jsDate')
        parameters['doc'].save(date + ' - ' + this.y18n('feedback.document.file') + ' - ' + name + '.pdf')
      } else {
        console.log(this.y18n('feedback.document.unavailable'))
      }
    },

    /**
     * Function printChoices: prints choices answers into PDF
     * Author: nv
     * Last Updated: October 11, 2022 by nv
     */
    printChoices (parameters) {
      const choice = JSON.stringify(parameters['feedback'].map(item => {
        return item['choice']
      }))

      parameters['doc'].text(this.y18n('feedback.document.choices'), parameters['x'], parameters['y'])
      parameters['y'] += parameters['lineheight']
      const splitchoice = parameters['doc'].splitTextToSize(choice, 180)
      parameters['doc'].text(splitchoice, 30, parameters['y'])
      parameters['blockheight'] = splitchoice.length * parameters['lineheight'] + 5
      parameters['y'] += parameters['blockheight']

      return parameters
    },

    /**
     * Function printFreetext: prints freetext answers into PDF
     * Author: nv
     * Last Updated: October 11, 2022 by nv
     */
    printFreetext (parameters) {
      const freetext = JSON.stringify(parameters['feedback'].map(item => {
        return item['freetext']
      }))

      parameters['doc'].text(this.y18n('feedback.document.freetext'), parameters['x'], parameters['y'])
      parameters['y'] += parameters['lineheight']
      const splitfreetext = parameters['doc'].splitTextToSize(freetext, 180)
      parameters['doc'].text(splitfreetext, 30, parameters['y'])
      parameters['blockheight'] = splitfreetext.length * parameters['lineheight'] + 5
      parameters['y'] += parameters['blockheight']

      return parameters
    },

    /**
     * Function printRating: prints rating answers into PDF
     * Author: nv
     * Last Updated: October 11, 2022 by nv
     */
    printRating (parameters) {
      const rating = JSON.stringify(parameters['feedback'].map(item => {
        return item['rating']
      }))

      parameters['doc'].text(this.y18n('feedback.document.rating'), parameters['x'], parameters['y'])
      parameters['y'] += parameters['lineheight']
      const splitrating = parameters['doc'].splitTextToSize(rating, 180)
      parameters['doc'].text(splitrating, 30, parameters['y'])
      parameters['blockheight'] = splitrating.length * parameters['lineheight'] + 5
      parameters['y'] += parameters['blockheight']

      return parameters
    }
  }
}
</script>

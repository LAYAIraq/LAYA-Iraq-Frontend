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
      'fetchFeedbackDownload'
    ]),
    ...mapGetters([
      'enrollmentFeedback',
      'course'
    ])
  },

  methods: {
    /**
     * Function getFeedback: gets feedback from store
     * Author: nv
     * Last Updated: October 11, 2022 by nv
     */
    getFeedback (feedback) {
      const promise = this.$store.dispatch('fetchFeedbackDownload', name)
      for (let i = 0; i < promise.subs.length; i++) {
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
        let y = 30
        const lineheight = doc.getTextDimensions('Sample Text').h + 5
        const blockheight = 0

        const parameters = [doc, feedback, x, lineheight, blockheight]

        doc.text(this.y18n('feedback.document.title') + name, x, y)
        y += lineheight + 20

        this.printChoices(parameters, y)
        this.printFreetext(parameters, y)
        this.printRating(parameters, y)

        const date = doc.getCreationDate('jsDate')
        doc.save(date + ' - ' + this.y18n('feedback.document.file') + ' - ' + name + '.pdf')
      } else {
        console.log(this.y18n('feedback.document.unavailable'))
      }
    },
    /**
     * Function printChoices: prints choices answers into PDF
     * Author: nv
     * Last Updated: October 11, 2022 by nv
     */
    printChoices (parameters, y) {
      const choice = JSON.stringify(parameters['feedback'].map(function (item) {
        return item['choice']
      }))
      const doc = parameters['doc']
      const x = parameters['x']
      const lineheight = parameters['lineheight']
      let blockheight = parameters['blockheight']

      doc.text(this.y18n('feedback.document.choices'), x, y)
      y += lineheight
      const splitchoice = doc.splitTextToSize(choice, 180)
      doc.text(splitchoice, 30, y)
      blockheight = splitchoice.length * lineheight + 5
      y += blockheight

      return doc
    },
    /**
     * Function printFreetext: prints freetext answers into PDF
     * Author: nv
     * Last Updated: October 11, 2022 by nv
     */
    printFreetext (parameters, y) {
      const freetext = JSON.stringify(parameters['feedback'].map(function (item) {
        return item['freetext']
      }))
      const doc = parameters['doc']
      const x = parameters['x']
      const lineheight = parameters['lineheight']
      let blockheight = parameters['blockheight']

      doc.text(this.y18n('feedback.document.freetext'), x, y)
      y += lineheight
      const splitfreetext = doc.splitTextToSize(freetext, 180)
      doc.text(splitfreetext, 30, y)
      blockheight = splitfreetext.length * lineheight + 5
      y += blockheight

      return doc
    },
    /**
     * Function printRating: prints rating answers into PDF
     * Author: nv
     * Last Updated: October 11, 2022 by nv
     */
    printRating (parameters, y) {
      const rating = JSON.stringify(parameters['feedback'].map(function (item) {
        return item['rating']
      }))
      const doc = parameters['doc']
      const x = parameters['x']
      const lineheight = parameters['lineheight']
      let blockheight = parameters['blockheight']

      doc.text(this.y18n('feedback.document.rating'), x, y)
      y += lineheight
      const splitrating = doc.splitTextToSize(rating, 180)
      doc.text(splitrating, 30, y)
      blockheight = splitrating.length * lineheight + 5
      y += blockheight

      return doc
    }
  }
}
</script>

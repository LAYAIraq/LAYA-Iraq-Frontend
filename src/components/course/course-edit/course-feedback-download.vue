<!--
Filename: course-feedback-download.vue
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
        class="w-50"
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
      header-bg-variant="success"
      ok-variant="success"
      cancel-variant="primary"
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
    return {
      feedback: null
    }
  },

  computed: {
    ...mapActions([
      'enrollmentsCourseFetch'
    ]),
    ...mapGetters([
      'enrollmentFeedback',
      'course',
      'courseId'
    ])
  },

  created () {
    this.feedback = this.getFeedback()
  },

  methods: {
    /**
     * Function getFeedback: gets feedback from store
     * Author: nv
     * Last Updated: December 10, 2022 by cmc
     */
    getFeedback () {
      const feedback = {}
      this.$store.dispatch('enrollmentsCourseFetch', { courseId: this.courseId })
        .then((resp) => {
          for (const enrol of resp) {
            // create arrays of feedback per feedback block
            Object.keys(enrol.feedback).forEach((key) => {
              if (!feedback[key]) { // create key if not there yet
                feedback[key] = []
              }
              feedback[key].push(enrol.feedback[key])
            })
          }
        })
        .catch(err => {
          console.log(err)
        })
      return feedback
    },

    /**
     * Function printPDF: prints feedback in a PDF to download
     * Author: nv
     * Last Updated: December  10, 2022 by cmc
     */
    printPDF () {
      if (Object.keys(this.feedback).length > 0) {
        /* eslint-disable-next-line */
        const doc = new jsPDF('p','mm')
        const name = this.course.name
        const x = 15
        const y = 15
        const lineheight = doc.getTextDimensions('Sample Text').h + 5
        const blockheight = 0

        const parameters = { doc, x, y, lineheight, blockheight }
        doc.setFontSize(20)
        parameters.doc.text(this.y18n('feedback.document.title') + '"' + name + '"', parameters.x, parameters.y)
        parameters.y += parameters.lineheight + 20

        for (const key of Object.keys(this.feedback)) {
          this.printBlock(key, parameters)
          this.printChoices(key, parameters)
          this.printFreetext(key, parameters)
          this.printRating(key, parameters)
        }

        const date = parameters.doc.getCreationDate('jsDate')
        parameters.doc.save(date + ' - ' + this.y18n('feedback.document.file') + ' - ' + name + '.pdf')
      } else {
        console.log(this.y18n('feedback.document.unavailable'))
      }
    },

    /**
     * Function printBlock: prints a headline for a block of feedback
     * Author: cmc
     * Last Updated: December 10, 2022 by cmc
     */
    printBlock (key, parameters) {
      parameters.doc.setFontSize(14)
      parameters.doc.text(this.y18n('feedback.document.block') + ' ' + key, parameters.x, parameters.y)
      parameters.y += parameters.lineheight + 10
    },

    /**
     * Function printChoices: prints choices answers into PDF
     * Author: nv
     * Last Updated: December 10, 2022 by cmc
     */
    printChoices (key, parameters) {
      parameters.doc.setFontSize(12)
      parameters.doc.text(this.y18n('feedback.document.choices'), parameters.x, parameters.y)
      for (const feedback of this.feedback[key]) { // loop through feedback, print choices for each
        parameters.y += parameters.lineheight
        let choices = ''
        feedback.choice.forEach((choice) => { // put choice array in string
          choices += choice + ', '
        })
        const splitchoice = parameters.doc.splitTextToSize(choices.slice(0, -2), 180) // don't print last ', ' in choices
        parameters.doc.text(splitchoice, 15, parameters.y)
        parameters.blockheight = splitchoice.length * parameters.lineheight + 5
        parameters.y += parameters.blockheight
      }
    },

    /**
     * Function printFreetext: prints freetext answers into PDF
     * Author: nv
     * Last Updated: December 10, 2022 by cmc
     */
    printFreetext (key, parameters) {
      parameters.doc.text(this.y18n('feedback.document.freetext'), parameters.x, parameters.y)
      for (const feedback of this.feedback[key]) { // loop through feedback, print freetext for each
        parameters.y += parameters.lineheight
        const splitfreetext = parameters.doc.splitTextToSize(feedback.freetext, 180)
        console.log(splitfreetext)
        parameters.doc.text(splitfreetext, 15, parameters.y)
        parameters.blockheight = Math.ceil(splitfreetext.length / 2) * parameters.lineheight
        parameters.y += parameters.blockheight
      }
    },

    /**
     * Function printRating: prints rating answers into PDF
     * Author: nv
     * Last Updated: December 10, 2022 by cmc
     */
    printRating (key, parameters) {
      parameters.doc.text(this.y18n('feedback.document.rating'), parameters.x, parameters.y)
      for (const feedback of this.feedback[key]) { // loop through feedback, print rating for each
        parameters.y += parameters.lineheight
        const splitrating = parameters.doc.splitTextToSize(feedback.rating, 180)
        parameters.doc.text(splitrating, 15, parameters.y)
        parameters.blockheight = splitrating.length * parameters.lineheight + 5
        parameters.y += parameters.blockheight
      }
    }
  }
}
</script>

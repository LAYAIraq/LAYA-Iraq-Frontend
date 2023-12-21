<!--
Filename: certificate-view.vue
Use: View certificate content block
Author: nv
Since v1.3.0
-->

<template>
  <div
    class="certificate-view"
    :class="courseLangIsAr? 'text-right' : 'text-left'"
  >
    <div
      :id="title.id"
      :class="courseLangIsAr? 'text-right' : 'text-left'"
    >
      <div
        :class="courseLangIsAr? 'text-right' : 'text-left'"
      >
        <h1 class="pb-3">
          {{ courseSimple? title.simple: title.text }}
        </h1>
      </div>
    </div>

    <div class="row ml-1">
      <label id="thanks">
        {{ y18n('certificate.thanks') }}
      </label>
      <div class="col">
        <b-button
          size="sm"
          variant="success"
          :class="courseLangIsAr? 'float-right' : 'float-left'"
          @click="certificateBuild"
        >
          <i class="fas fa-info-circle"></i> {{ y18n('certificate.name') }}
        </b-button>
      </div>
    </div>

    <div class="row mt-3">
      <navigation-buttons
        :cid="id"
      ></navigation-buttons>
    </div>
  </div>
</template>

<script>

import { locale, pluginView } from '@/mixins'
import { mapGetters } from 'vuex'
import { jsPDF } from 'jspdf'
import NavigationButtons from '@/components/helpers/navigation-buttons'

const imgOg = require('@/assets/images/logo-iraq-m.png')

export default {
  name: 'CertificateView',

  components: { NavigationButtons },

  mixins: [
    locale,
    pluginView
  ],

  data () {
    return {
      ...this.viewData,
      additionalInformation: ''
    }
  },

  computed: {
    ...mapGetters([
      'courseFlags',
      'courseSimple',
      'course',
      'profile'
    ])
  },

  methods: {
    /**
     * Function certificateBuild: builds the certificate for the students
     * Author: nv
     * Since: v1.3.0
     */
    certificateBuild () {
      /* eslint-disable-next-line */
      const doc = new jsPDF('p', 'mm')

      const courseName = this.course.name
      const studentName = this.profile.fullName

      this.printHeader(doc)
      this.printStudentDetails(doc, studentName)
      this.printCourseDetails(doc, courseName)
      if (this.additionalInformation !== '') {
        this.printAdditionalInformation(doc)
      }
      this.printFooter(doc)

      doc.save('certificate-' + courseName + '-' + studentName + '.pdf')
    },
    /**
     * Function printAdditionalInformation: adds additional information like test scores - not in use right now
     * Author: nv
     * Since: v1.3.0
     */
    printAdditionalInformation (doc) {
      doc.setFontSize(12)
      this.additionalInformation = ''
      doc.text(this.y18n('certificate.additionalInformation') + ':', 25, 240)
      doc.text(this.additionalInformation, 25, 250)
    },
    /**
     * Function printCourseDetails: adds information like course name and author and abstract
     * Author: nv
     * Since: v1.3.0
     */
    printCourseDetails (doc, courseName) {
      const abstract = doc.splitTextToSize(this.course.abstract, 170)
      const author = this.course.authorName

      doc.text(this.y18n('certificate.text'), 25, 145)
      doc.setFont('helvetica', 'bold')
      doc.text(courseName, 105, 160, 'center')
      doc.setFont('helvetica', 'normal')
      doc.text('(' + this.y18n('author') + ': ' + author + ')', 105, 170, 'center')
      if (this.additionalInformation !== '') {
        doc.setFontSize(12)
      }
      doc.text(this.y18n('abstract') + ':', 25, 180)
      doc.text(abstract, 25, 190)
    },
    /**
     * Function printFooter: adds date and signed by
     * Author: nv
     * Since: v1.3.0
     */
    printFooter (doc) {
      const date = new Date()
      const author = this.course.authorName

      // doc.addImage( signature, 25, 270, 10, 50)
      doc.text(this.y18n('certificate.digitallySigned') + ', ' + author, 25, 280)
      doc.text(date.toString(), 25, 290)
    },
    /**
     * Function printHeader: adds logo and headline
     * Author: nv
     * Since: v1.3.0
     */
    printHeader (doc) {
      doc.addImage(imgOg, 'PNG', 77, 20, 55, 55)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(25)
      doc.text(this.y18n('certificate.name'), 105, 90, 'center')
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(14)
    },
    /**
     * Function printStudentDetails: adds student name and university
     * Author: nv
     * Since: v1.3.0
     */
    printStudentDetails (doc, studentName) {
      const studentInstitution = this.profile.institution

      doc.setFont('helvetica', 'italic')
      doc.text(studentName, 105, 120, 'center')
      doc.text(' (' + studentInstitution + ')', 105, 130, 'center')
      doc.setFont('helvetica', 'normal')
    }
  }
}
</script>

<style scoped>

</style>

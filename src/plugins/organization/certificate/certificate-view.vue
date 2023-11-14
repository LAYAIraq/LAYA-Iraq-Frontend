<!--
Filename: certificate-view.vue
Use: View certificate content block
Author: core
Since v1.0.0
-->

<template>
  <fieldset
    class="certificate-view"
  >
    <div>
      <div
        class="row flaggable "
      >
        <div class="col">
          <h2>
            {{ y18n("certificate.name") }}
          </h2>
        </div>
      </div>
      <div>
        <!-- add pdf viewer -->

        <b-button
          size="sm"
          variant="success"
          :class="courseLangIsAr? 'float-left' : 'float-right'"
          @click="certificateBuild"
        >
          <i class="fas fa-info-circle"></i> {{ y18n('certificate.name') }}
        </b-button>
      </div>
    </div>
  </fieldset>
</template>

<script>

import { locale, pluginView } from '@/mixins'
import { mapGetters } from 'vuex'
import { jsPDF } from 'jspdf'

export default {
  name: 'CertificateView',

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
    convertBase64 (ogImg) {
      const img = document.getElementById(ogImg)
      const canvas = document.createElement('canvas')

      canvas.height = img.height
      canvas.width = img.width

      const context = canvas.getContext('2d')
      context.drawImage(img, 0, 0)

      const dataURL = canvas.toDataURL('image/png', 1.0)
      return dataURL
    },
    printAdditionalInformation (doc) {
      doc.setFontSize(12)
      // this.additionalInformation =
      doc.text(this.y18n('certificate.additionalInformation') + ':', 25, 240)
      // doc.text(ths.additionalInformation, 25, 250)
    },
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
    printFooter (doc) {
      const date = new Date()
      const author = this.course.authorName

      // doc.addImage( signature, 25, 270, 10, 50)
      doc.text(this.y18n('certificate.digitallySigned') + ', ' + author, 25, 280)
      doc.text(date.toString(), 25, 290)
    },
    printHeader (doc) {
      // const img = this.convertBase64('../../assets/images/logo.svg')
      // const img = '../../assets/images/logo-iraq.png'
      // img.toBlob((blob) => {
      //  const url = URL.createObjectURL(blob)
      // doc.addImage(url, 'PNG', 70, 25, 60, 60)
      // }, 'image/png')
      const img = new Image()
      img.src = '../src/assets/images/laya-logo-iraq.png'

      console.log(img.src)

      img.onload = () => {
        doc.addImage(img, 'PNG', 70, 25, 60, 60)
      }

      // doc.addImage(img, 'PNG', 70, 25, 60, 60)

      doc.setFont('helvetica', 'bold')
      doc.setFontSize(25)
      doc.text(this.y18n('certificate.name'), 105, 90, 'center')
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(14)
    },
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

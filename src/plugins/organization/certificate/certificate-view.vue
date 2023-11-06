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
          :class="langIsAr? 'float-left' : 'float-right'"
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
      ...this.viewData
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
      const author = this.course.authorName
      const abstract = doc.splitTextToSize(this.course.abstract, 170)
      const studentName = this.profile.fullName
      const studentInstitution = this.profile.institution
      // const date = this.Date.now().toString()
      // const logo = '../../assets/images/logo-iraq-xs.png'

      // doc.addImage( logo, png, 70 , 25, 60, 60)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(25)
      doc.text(this.y18n('certificate.name'), 80, 90)
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(14)

      // student information
      doc.setFont('helvetica', 'italic')
      doc.text(studentName, 25, 120)
      doc.text(' (' + studentInstitution + ')', doc.getTextWidth(studentName) + 27, 120)
      doc.setFont('helvetica', 'normal')

      // course information
      doc.text(courseName, 25, 160)
      doc.text('(' + this.y18n('author') + ': ' + author + ')', doc.getTextWidth(courseName) + 27, 160)
      doc.text(this.y18n('abstract') + ':', 25, 170)
      doc.text(abstract, 25, 180)

      // date and signed
      doc.text(this.y18n('digitallySigned'), 25, 280)
      // doc.text(date, 25, 280)

      doc.save('certificate-' + courseName + '-' + studentName + '.pdf')
    }
  }
}
</script>

<style scoped>

</style>

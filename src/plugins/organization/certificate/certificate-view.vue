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
      </div>
    </div>
  </fieldset>
</template>

<script>

import { locale, pluginView } from '@/mixins'
import { mapGetters } from 'vuex'
// import { jsPDF } from 'jspdf'

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
      'courseSimple'
    ])
  },
  actions: {
    /**
     * Function certificateBuild: builds the certificate for the students
     * Author: nv
     * Since: v1.3.0
     */
    certificateBuild () {
      /* const doc = new jsPDF('p', 'mm')
      const courseName = this.course.name
      const author = this.course.authorName
      const abstract = this.course.abstract
      const studentName = this.profile.fullName
      const studentInstitution = this.profile.institution
      const logo = '../../assets/images/logo-iraq-xs.png' */
    }
  }
}
</script>

<style scoped>

</style>

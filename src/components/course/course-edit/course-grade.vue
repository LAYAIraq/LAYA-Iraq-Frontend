<!--
Filename: course-nav-edit.vue
Use: Redirect to editing the course navigation
Author: cmc
Date: October 27, 2020
Dependencies:
  vuex,
  @/mixins/locale.vue
-->

<template>
  <div v-if="Object.keys(courseContent).length > 0" class="row mb-2">
    <div class="col">
      <b-button block variant="primary" append :to="{ path: 'grade' }">
        <p>Kursinhalte bewerten</p>
      </b-button>
    </div>

    <div class="col text-dark">
      <p>Kursinhalte bewerten</p>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { locale } from '@/mixins'

export default {
  name: 'CourseNavEditButton',

  mixins: [
    locale
  ],

  computed: {
    ...mapGetters(['courseContent', 'courseChaptersCoherent'])
  }
}
</script>

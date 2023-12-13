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
  <div
    v-if="Object.keys(courseContent).length > 0"
    class="row mb-2"
  >
    <div class="col">
      <b-button
        block
        variant="warning"
        append
        :to="{path: 'edit-nav'}"
      >
        <i class="fas fa-project-diagram"></i> {{ y18n('courseNavEdit.editNav') }}
      </b-button>
    </div>

    <div class="col text-dark">
      <span
        v-if="!courseChaptersCoherent"
        class="bg-warning mr-1 rounded"
        style="padding: 2px 5px"
        :title="y18n('courseNavEdit.editNavIncompleteTooltip')"
      >
        <i class="fas fa-exclamation-triangle"></i> {{ y18n('courseNavEdit.editNavIncomplete') }}
      </span>
      {{ y18n('courseNavEdit.editNavTip').replace('{steps}', Object.keys(courseContent).length ) }}
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

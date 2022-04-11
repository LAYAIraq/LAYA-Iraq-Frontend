<!--
Filename: course-edit-nav.vue
Use: Redirect to editing the course navigation
Author: cmc
Date: October 27, 2020
Dependencies:
  vuex,
  @/mixins/locale.vue
-->

<template>
  <div
    v-if="content.length > 0"
    class="row mb-2"
  >
    <div class="col">
      <b-button
        block
        variant="primary"
        append
        :to="{path: 'editNav'}"
      >
        <i class="fas fa-project-diagram"></i> {{ y18n('nav.editNav') }}
      </b-button>
    </div>

    <div class="col text-dark">
      <span
        v-if="courseNavIncomplete()"
        class="bg-warning mr-1 rounded"
        style="padding: 2px 5px"
      >
        <i class="fas fa-exclamation-triangle"></i> {{ y18n('nav.editNavIncomplete') }}
      </span>
      {{ y18n('nav.editNavTip').replace('{steps}', content.length ) }}
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { locale } from '@/mixins'

export default {
  name: 'CourseEditNav',

  mixins: [
    locale
  ],

  computed: {
    ...mapGetters(['content'])
  },

  methods: {
    /**
     * Function courseNavIncomplete: check if all contents have nextStep set
     *
     * Author: cmc
     *
     * Last Updated: October 27, 2020
     */
    courseNavIncomplete () {
      return this.content.reduce((all, c) => (!c.nextStep || all), false)
    }
  }
}
</script>

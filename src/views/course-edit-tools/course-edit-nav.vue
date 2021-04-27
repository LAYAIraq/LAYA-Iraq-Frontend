<!--
Filename: course-edit-nav.vue 
Use: Redirect to editing the course navigation
Author: cmc
Date: October 27, 2020
Dependencies: 
  vuex,
  @/i18n/course-edit/nav/
-->

<template>
    <div class="row mb-2" v-if="content.length > 0">
      <div class="col">
        <b-button block variant="primary" append :to="{path: 'editNav'}">
        <i class="fas fa-project-diagram"></i> {{ i18n.editNav }}
        </b-button>
      </div>

      <div class="col text-dark">
          <span v-if="courseNavIncomplete()"
              class="bg-warning mr-1 rounded"
              style="padding: 2px 5px">
            <i class="fas fa-exclamation-triangle"></i> {{ i18n.editNavIncomplete }}
          </span>
          {{ i18n.editNavTip.replace('{steps}', content.length ) }}
      </div>

    </div>

</template>

<script>
import { mapGetters } from 'vuex'
import * as i18n from '@/i18n/course-edit/nav/'

export default {
  name: 'course-edit-nav',
  computed: {
    ...mapGetters(['profileLang', 'content']),

    /**
     * i18n: Load translation files depending on user language
     * 
     * Author: cmc
     * 
     * Last updated: March 20, 2021
     * 
     */
    i18n() {
      return i18n[this.profileLang]
    }
  },
  methods: {
    /**
     * Function courseNavIncomplete: check if all contents have nextStep set
     * 
     * Author: cmc
     * 
     * Last Updated: October 27, 2020
     */
    courseNavIncomplete() {
      return this.content.reduce((all, c) => (!c.nextStep || all), false)
    }
  }
}
</script>

<style scoped>

</style>
<!--
Filename: course-edit.vue
Use: wrap all course edit tools
Creator: cmc
Date: October 27, 2020
Dependencies:
  vuex,
  @/mixins/locale.vue,
  ./course-edit-tools
-->
<template>
  <!-- author view -->
  <div class="ly-bg-author py-4">
    <course-edit-header
    :name="name" :step="step">
    </course-edit-header>

    <!-- mounts course-edit-wrapper & edit-course-nav -->
    <router-view @saved="$bvToast.show('author-toast')"></router-view>

    <div
      class="container"
      :class="langIsAr ? 'text-right' : ''"
      v-if="$route.name === 'course-detail-view'"
    >

      <course-edit-content :name="name" :step="step"></course-edit-content>

      <course-edit-type :name="name" :step="step" @changedType="storeCourse"></course-edit-type>

      <course-new-block :name="name" :step="step"> </course-new-block>

      <course-edit-nav></course-edit-nav>

      <course-rename @renamed="$bvToast.show('author-toast')"></course-rename>

      <course-copy @success="$bvToast.show('author-toast')"></course-copy>

      <course-delete-block :name="name" :step="step"></course-delete-block>

      <course-delete :name="name"></course-delete>

      <!--<course-stats></course-stats>-->

      <course-preferences @settingsChanged="storeCourse"></course-preferences>

    </div>

    <b-toast
      id="author-toast"
      :title="i18n['authorTools']"
      static
      variant="success"
      auto-hide-delay="1500"
      class="author-toast"
    >
      {{ i18n['successfulSave'] }}
    </b-toast>

  </div>
</template>

<script>
import { locale } from '@/mixins'
import { mapGetters } from 'vuex'
import {
  courseCopy,
  courseDelete,
  courseDeleteBlock,
  courseEditContent,
  courseEditHeader,
  courseEditNav,
  courseEditType,
  courseNewBlock,
  coursePreferences,
  courseRename,
  // courseStats
  } from './course-edit-tools/'


export default {
  name: 'course-edit',
  components: { // not lazily loaded b/c visible first
    courseCopy,
    courseDelete,
    courseDeleteBlock,
    courseEditContent,
    courseEditHeader,
    courseEditNav,
    courseEditType,
    courseNewBlock,
    coursePreferences,
    courseRename,
    // courseStats
  },
  mixins: [
    locale
  ],
  props: {
    name: String,
    step: String
  },
  computed: {
    // ...mapState(['edit']),
    ...mapGetters(['content', 'course']),
  },
  methods: {

    /**
     * Function storeCourse: store course in database
     *
     * Author: cmc
     *
     * Last Updated: January 11, 2021
     *  */
    storeCourse() {
      let ctx = this
      this.$store.dispatch('storeCourse')
      .then(() => ctx.$bvToast.show('author-toast'))
      .catch( (err) => console.error(err))
  }

  }
}
</script>

<style scoped>
.author-toast {
  position: fixed;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 11002;
}
</style>

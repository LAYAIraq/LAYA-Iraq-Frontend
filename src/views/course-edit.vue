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
      :name="name"
      :course-path="coursePath"
      @save="changesToSave = true"
    >
    </course-edit-header>

    <!-- mounts course-edit-wrapper & edit-course-nav -->
    <router-view
      :save-changes="changesToSave"
      @saved="storeCourse"
    ></router-view>

    <div
      v-if="$route.name === 'course-detail-view'"
      class="container"
      :class="langIsAr ? 'text-right' : ''"
    >
      <course-edit-content
        :name="name"
        :course-path="coursePath"
      ></course-edit-content>

      <course-edit-type
        :name="name"
        :course-path="coursePath"
        @changedType="storeCourse"
      ></course-edit-type>

      <course-new-block
        :name="name"
        :course-path="coursePath"
      >
      </course-new-block>

      <course-edit-nav></course-edit-nav>

      <course-rename @renamed="storeCourse"></course-rename>

      <course-copy @success="storeCourse"></course-copy>

      <course-change-category @changedCategory="storeCourse"></course-change-category>

      <course-delete-block
        :name="name"
        :course-path="coursePath"
      ></course-delete-block>

      <course-delete :name="name"></course-delete>

      <!--<course-stats></course-stats>-->

      <course-preferences @settingsChanged="storeCourse"></course-preferences>
    </div>

    <b-toast
      id="author-toast"
      :title="y18n('authorTools')"
      static
      variant="success"
      auto-hide-delay="1500"
      class="author-toast"
    >
      {{ y18n('successfulSave') }}
    </b-toast>
  </div>
</template>

<script>
import { locale, routeProps } from '@/mixins'
import {
  courseChangeCategory,
  courseCopy,
  courseDelete,
  courseDeleteBlock,
  courseEditContent,
  courseEditHeader,
  courseEditNav,
  courseEditType,
  courseNewBlock,
  coursePreferences,
  courseRename
  // courseStats
} from './course-edit-tools/'

export default {
  name: 'CourseEdit',
  components: { // not lazily loaded b/c visible first
    courseChangeCategory,
    courseCopy,
    courseDelete,
    courseDeleteBlock,
    courseEditContent,
    courseEditHeader,
    courseEditNav,
    courseEditType,
    courseNewBlock,
    coursePreferences,
    courseRename
    // courseStats
  },
  mixins: [
    locale,
    routeProps
  ],

  data () {
    return {
      changesToSave: false
    }
  },

  methods: {

    /**
     * Function storeCourse: store course in database
     *
     * Author: cmc
     *
     * Last Updated: January 11, 2021
     *  */
    storeCourse () {
      this.$store.dispatch('storeCourse')
        .then(() => this.$bvToast.show('author-toast'))
        .catch((err) => console.error(err))
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

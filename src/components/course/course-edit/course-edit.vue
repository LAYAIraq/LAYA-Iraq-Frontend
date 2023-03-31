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
  <div class="bg-author py-4">
    <course-edit-header
      :name="name"
      :course-path="coursePath"
      @save="changesToSave = true"
    >
    </course-edit-header>

    <!-- mounts course-edit-wrapper & edit-course-nav -->
    <router-view
      :save-changes="changesToSave"
      :show-toast="() => $bvToast.show('author-toast')"
      @saved="storeCourse"
    ></router-view>

    <course-edit-tools
      :name="name"
      :course-path="coursePath"
      @save="changesToSave = true"
    ></course-edit-tools>

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
  CourseCategoryChange,
  CourseCopy,
  CourseDelete,
  CourseBlockDelete,
  CourseBlockEdit,
  CourseEditHeader,
  CourseNavEdit,
  CourseTypeEdit,
  CourseBlockNew,
  CoursePreferences,
  CourseRename,
  CourseFeedbackDownload
  // courseStats
} from './'
import CourseEditTools from '@/components/course/course-edit/course-edit-tools.vue'

export default {
  name: 'CourseEdit',
  components: {
    CourseEditTools, // not lazily loaded b/c visible first
    CourseCategoryChange,
    CourseCopy,
    CourseDelete,
    CourseBlockDelete,
    CourseBlockEdit,
    CourseEditHeader,
    CourseNavEdit,
    CourseTypeEdit,
    CourseBlockNew,
    CoursePreferences,
    CourseRename,
    CourseFeedbackDownload
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

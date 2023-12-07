<!--
  Filename: course.vue
  Use: Show Course Content
  Creator: core
  Since: v1.0.0
-->

<template>
  <div
    v-if="!storeBusy"
    class="course"
  >
    <!-- content -->
    <div
      v-if="contentToDisplay && viewPermit"
      class="container content"
    >
      <div class="row">
        <div class="col">
          <CourseHeader
            :content-title="contentToDisplay.title"
            :course-name="course.name"
            :course-path="coursePath"
          ></CourseHeader>
          <component
            :is="contentToDisplay.name"
            :key="contentToDisplay.title.text"
            :view-data="contentToDisplay"
          >
          </component>
        </div>
      </div>
    </div>
    <div v-else>
      <!--            <h2 v-if="!contentToDisplay" class="mt-5 text-center text-muted">-->
      {{ y18n('courseDetail.content') }}
      <!--            </h2>-->
      <!--            <h2 v-else class="mt-5 text-center text-muted">-->
      <!--              {{ y18n('courseDetail.noPermit') }}-->
      <!--            </h2>-->
    </div>
    <CourseEdit
      v-if="isCourseAuthor"
      :name="name"
      :course-path="coursePath"
    ></CourseEdit>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import utils from '@/mixins/general/helpers.ts'
import { locale, routes, storeHandler } from '@/mixins'
import CourseHeader from '@/components/course/course-header.vue'

export default {
  name: 'Course',

  components: {
    lyScrollToTop: () => import('@/components/helpers/scroll-to-top.vue'),
    CourseEdit: () => import('@/components/course/course-edit/course-edit.vue'),
    CourseHeader
  },

  mixins: [
    locale,
    routes,
    storeHandler
  ],

  beforeRouteUpdate (to, from, next) {
    if (
      to.name === 'course' &&
      (from.name !== 'course-content' &&
        from.name !== 'course-nav')
    ) {
      document.getElementById('course-header').scrollIntoView()
    }
    next()
  },

  computed: {
    ...mapGetters([
      'content',
      'course',
      'courseChapters',
      'courseChapterNames',
      'courseContent',
      'courseContentFollowMap',
      'courseFlags',
      'courseRoutes',
      'courseStart',
      'courseSlug',
      'enrollment',
      'isAdmin',
      'isAuthor',
      'storeBusy',
      'userEnrolled',
      'userId'
    ]),

    /**
     * isCourseAuthor: return true if logged user is admin or author of the course
     *
     * Author: cmc
     *
     * Last Updated: August 5, 2022
     * @returns {boolean} true if logged user is admin or author of the course
     */
    isCourseAuthor () {
      return (this.isAuthor && this.course.authorId === this.userId) || this.isAdmin
    },

    /**
     * viewPermit: returns true if user is allowed to see selected course
     *
     * Author: core
     *
     * Last Updated: October 27, 2020
     */
    viewPermit () {
      if (this.contentToDisplay) {
        return this.course.properties.enrollment
          ? (!!(this.isAuthor || this.userEnrolled))
          : true
      }
      return false
    }
  },

  watch: {
    /**
     * watcher content: watch content for changes, updated when they occur
     *
     * Author: cmc
     *
     * Last Updated: October 22, 2021
     */
    // content: {
    //   deep: true,
    //   handler () {
    //     // console.log('updating...')
    //     this.$nextTick(() => this.$forceUpdate)
    //   }
    // },
    coursePathFull (val) { // FIXME
      if (!val) {
        this.routeNormalize()
      }
    },

    /**
     * watcher courseFlags: update when courseFlags change
     *
     * Author: cmc
     *
     * Last Updated: January 20, 2022
     */
    courseFlags () {
      // console.log(val)
      this.$store.dispatch('courseFlagsCheck')
    }
  },

  created () {
    this.enrollmentFetch()
    this.routeNormalize()
    // this.flagsFetch()
    // this.fetchCourseStats()
  },

  mounted () {
    // if (!this.contentToDisplay && !this.$router.params.type) {
    //   this.$forceUpdate()
    // }
    this.getCourse()
  },

  beforeDestroy () {
    /* if (this.enrollment.length > 0) this.enrollmentUpdate()
    this.courseFlagCreate() */
  },

  methods: {
    ...utils,

    /**
     * Function getCourse: get course from backend, set title
     *
     * Author: core
     *
     * Last Updated: October 21, 2021
     */
    getCourse () {
      if ( // TODO: view for loading course, reset when courseFetch resolves
        !this.course.name || // course is undefined in store
        this.courseSlug !== this.name || // course in store doesn't match the route params
        Object.keys(this.course).length === 0 // course in store has no properties
      ) {
        this.courseFetch(this.name)
      }
      window.scrollTo(0, 0)
    }
  }
}
</script>

<style scoped>
*:focus {
  outline: 2px dashed deepskyblue;
}

.author-tools-active {
  border-bottom: 2px solid black;
  color: black !important;
}

.author-toast {
  position: fixed;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 11002;
}

.subscribe-btn {
  border: 2px solid black;
}

.container-fluid {
  margin-bottom: 4rem;
}

.container.content {
  margin-bottom: 4rem;
}

</style>

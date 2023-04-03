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
    <CourseHeader
      :content-title="contentToDisplay.title"
      :course-name="course.name"
      :course-path="coursePath"
    ></CourseHeader>

    <!-- content -->
    <div class="container content">
      <div class="row">
        <div class="col">
          <component
            :is="contentToDisplay.name"
            v-if="contentToDisplay && viewPermit"
            :key="contentToDisplay.title.text"
            :view-data="contentToDisplay"
            :on-finish="followContent"
          >
          </component>

          <div v-else>
            <!--            <h2 v-if="!contentToDisplay" class="mt-5 text-center text-muted">-->
            {{ y18n('courseDetail.content') }}
            <!--            </h2>-->
            <!--            <h2 v-else class="mt-5 text-center text-muted">-->
            <!--              {{ y18n('courseDetail.noPermit') }}-->
            <!--            </h2>-->
          </div>
        </div>
      </div>
    </div>

    <CourseEdit
      v-if="isCourseAuthor && content"
      :name="name"
      :course-path="coursePath"
    ></CourseEdit>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import utils from '@/mixins/general/helpers.ts'
import { locale, routeProps, storeHandler } from '@/mixins'
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
    routeProps,
    storeHandler
  ],

  computed: {
    ...mapGetters([
      'content',
      'course',
      'courseChapterNames',
      'courseContent',
      'courseContentIdRouteMap',
      'courseContentIndexIdMap',
      'courseContentRouteIdMap',
      'courseFlags',
      'courseNav',
      'courseRoutes',
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
     *  onFinishDummy: returns empty function on every [] invocation
     *
     * Author: core
     *
     * Last Updated: unknown
     * */
    onFinishDummy () {
      return new Proxy({}, {
        get () {
          return () => {}
        }
      })
    },

    /**
     * contentToDisplay: return current content object
     *
     * Author: cmc
     *
     * Last Updated: November 14, 2022 by cmc
     */
    contentToDisplay () {
      if (!this.coursePath) { // course path is not set --> first content in course
        return this.courseContent[this.courseNav.start]
      } else { // course path is set --> content with slug
        return this.courseContent[this.courseContentRouteIdMap[this.coursePath]] // path is no number -> route
      }
    },

    followContent () {
      return this.followingContent(this.contentToDisplay)
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

    /**
     * watcher courseFlags: update when courseFlags change
     *
     * Author: cmc
     *
     * Last Updated: January 20, 2022
     */
    courseFlags () {
      // console.log(val)
      this.$store.dispatch('checkCourseFlags')
    }
  },

  created () {
    this.getCourse()
    this.fetchEnrollment()
    // this.fetchFlags()
    // this.fetchCourseStats()
  },

  mounted () {
    // if (!this.contentToDisplay && !this.$router.params.type) {
    //   this.$forceUpdate()
    // }
  },

  updated () {
    console.log(this.pathId)
    console.log(this.courseContentIdRouteMap)
    console.log(this.coursePath)
  },

  beforeDestroy () {
    /* if (this.enrollment.length > 0) this.updateEnrollment()
    this.saveFlags() */
  },

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
      if (
        !this.course.name || // course is undefined in store
        this.courseSlug !== this.name || // course in store doesn't match the route params
        Object.keys(this.course).length === 0 // course in store has no properties
      ) {
        console.log('Fetching Course...')
        this.fetchCourse(this.name)
      }
      window.scrollTo(0, 0)
    },

    /**
     * Function followContent: returns follow set for content block
     *
     * Author: core
     *
     * Last Updated: November 14, 2022 by cmc
     *
     * @param contentBlock content block object
     */
    followingContent (contentBlock) {
      if (!this.contentToDisplay) return () => {}
      const follow = this.courseNav.structure
        .find((block) => block.id === contentBlock.id).follow // follow array in course nav structure
      if (!follow) return () => {} // no follow set
      // el is the content block to follow, return router push function
      // if el is number, use courseContentIndexIdMap to get id
      const routePushLookup = (el) => {
        return () => this.$router.push({
          params: {
            name: this.name,
            coursePath: typeof el === 'number' // if element is a number, it's an index
              ? this.courseContentIdRouteMap[this.courseContentIndexIdMap[el]] // get id from index, then route from id
              : `${el}`
          }
        })
      }

      return typeof follow === 'object'
        ? follow.map(el => // create a router.push call for each element in follow array
          routePushLookup(el)
        )
        : [routePushLookup(follow)] // has to be array
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

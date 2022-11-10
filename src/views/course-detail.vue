<!--
Filename: course-detail.vue
Use: Show Course Content
Creator: core
Date: unknown
Dependencies:
  vuex,
  @/mixins/locale.vue,
  @/misc/utils.js,
  @/components/scroll-to-top.vue
  @/views/course-edit.vue
-->

<template>
  <div
    v-if="!storeBusy"
    class="course-detail-view"
  >
    <!-- course header -->
    <div class="container-fluid bg-dark">
      <div class="row">
        <div class="col">
          <h1 class="text-center text-light py-5">
            <b>{{ name }}</b>
          </h1>
        </div>
      </div>
    </div>

    <!-- content -->
    <div class="container content">
      <div class="row">
        <div class="col">
          <div id="main-content-anchor"></div>

          <component
            :is="contentToDisplay.name"
            v-if="contentToDisplay && viewPermit"
            :key="contentToDisplay.title.text"
            :preview-data="contentToDisplay"
            :on-finish="followContent(contentToDisplay.follow)"
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

    <courseEdit
      v-if="isCourseAuthor && content"
      :name="name"
      :step="step"
    ></courseEdit>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import utils from '@/misc/utils.js'
import { locale, routeProps, storeHandler } from '@/mixins'

export default {
  name: 'CourseDetailView',

  components: {
    lyScrollToTop: () => import('@/components/scroll-to-top'),
    courseEdit: () => import('@/views/course-edit')
  },

  mixins: [
    locale,
    routeProps,
    storeHandler
  ],

  beforeRouteUpdate (to, from, next) {
    document.getElementById('main-content-anchor').scrollIntoView()
    next()
    // new commit
  },

  data () {
    return {
      // enrollment: {},
      rename: '',
      copy: '',
      changetype: null
      // courseStats: {}
    }
  },

  computed: {
    ...mapGetters([
      'isAdmin',
      'isAuthor',
      'content',
      'course',
      'courseContent',
      'courseFlags',
      'courseNav',
      'courseRoutes',
      'courseContentRouteIdMap',
      'courseContentIdRouteMap',
      'courseContentSlugIdMap',
      'enrollment',
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
     * Last Updated: March 24, 2021
     */
    contentToDisplay () {
      // return this.content ? this.content[this.step - 1] : false
      if (!this.coursePath) { // no slash in slug, load first content
        return this.courseNav.start === 0 ? this.courseContent[this.courseNav.structure[0].id] : null
      } else {
        return this.courseNav.start === 0 ? this.courseContent[this.courseNav.structure[0].id] : null
      }
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
    content: {
      deep: true,
      handler () {
        // console.log('updating...')
        this.$nextTick(() => this.$forceUpdate)
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
      this.$store.dispatch('checkCourseFlags')
    }
  },

  created () {
    this.getCourse()
    this.fetchEnrollment()
    // this.fetchFlags()
    // this.fetchCourseStats()
  },

  beforeDestroy () {
    /* if (this.enrollment.length > 0) this.updateEnrollment()
    this.saveFlags() */
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
      const ctx = this

      window.scrollTo(0, 0)
      document.title = `Laya - ${ctx.name}`
      if (
        !this.course || // course is undefined in store
        this.course.name !== this.$route.params.name || // course in store doesn't match the route params
        Object.keys(this.course).length === 0 // course in store has no properties
      ) {
        console.log('Fetching Course...')
        this.fetchCourse()
      }
    },

    /**
     * Function nextStep: map 'follow' string to components
     *
     * Author: core
     *
     * Last Updated: October 27, 2020
     *
     * @param follow next content to display (can be number, string, or array of each)
     */
    followContent (follow) { // string e.g. '1,2'
      if (!follow) return []

      const { name, $router } = this
      if (typeof follow === 'number' || typeof follow === 'string') { // single follow
        $router.push({ name: 'course-detail-view', params: { name, courseRoute: this.getContentRoute(follow) } })
      }
      return follow.forEach(step => {
        return () => {
          // if(this.enrollment.length >0) this.enrollment.progress = Number(step)
          $router.push({ name: 'course-detail-view', params: { name, step } })
        }
      })
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

#main-content-anchor {
  height: 7rem;
}
</style>

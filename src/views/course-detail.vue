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
  <div v-if="!note.busy" class="course-detail-view">

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

          <!-- v-if="viewPermit()" removed, readd when enrollment is reactivated -->
          <component
            v-if="contentToDisplay"
            :key="name+'-'+step"
            :is="contentToDisplay.name"
            :onFinish="nextStep(contentToDisplay.nextStep)">
          </component>

          <div v-else>
<!--            <h2 v-if="!contentToDisplay" class="mt-5 text-center text-muted">-->
              {{ i18n['courseDetail.content'] }}
<!--            </h2>-->
<!--            <h2 v-else class="mt-5 text-center text-muted">-->
<!--              {{ i18n['courseDetail.noPermit'] }}-->
<!--            </h2>-->
          </div>
        </div>
      </div>
    </div>

    <courseEdit
      v-if="isAuthor && content"
      :name="name" :step="step"
      @saved="$forceUpdate"
    ></courseEdit>

  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

import utils from '@/misc/utils.js'
import lyScrollToTop from '@/components/scroll-to-top.vue'
import courseEdit from '@/views/course-edit.vue'
import { locale, storeHandler } from '@/mixins'

export default {
  name: 'course-detail-view',

  components: {
    lyScrollToTop,
    courseEdit
  },

  mixins: [
    locale,
    storeHandler
  ],

  props: {
    name: String,
    step: String
  },

  data() {
    return {
      // COMMENTED OUT B/C ENROLLMENT DISABLED (cmc 2021-11-09)
      // enrollment: {},
      rename: '',
      copy: '',
      changetype: null,
      // courseStats: {}
    }
  },

  computed: {
    ...mapState(['auth', 'note', 'edit', 'flags']),
    ...mapGetters(['isAuthor', 'content', 'course', 'courseFlags']),


    /**
     *  onFinishDummy: returns empty function on every [] invocation
     *
     * Author: core
     *
     * Last Updated: unknown
     * */
    onFinishDummy() {
      return new Proxy({}, {
        get() {
          return ()=>{}
        }
      })
    },

    // COMMENTED OUT B/C ENROLLMENT DISABLED (cmc 2021-11-09)
    // /**
    //  * userEnrolled: returns enrollment status
    //  *
    //  * Author: cmc
    //  *
    //  * Last Updated: October 27, 2020
    //  */
    // userEnrolled() {
    //   return this.$store.state.edit.userEnrolled
    // },

    /**
     * contentToDisplay: return current content object
     *
     * Author: cmc
     *
     * Last Updated: March 24, 2021
     */
    contentToDisplay() {
      return this.content? this.content[this.step-1] : false
    },

    // COMMENTED OUT B/C ENROLLMENT DISABLED (cmc 2021-11-09)
    // /**
    //  * viewPermit: returns true if user is allowed to see selected course
    //  *
    //  * Author: core
    //  *
    //  * Last Updated: October 27, 2020
    //  */
    // viewPermit() {
    //   if( this.contentToDisplay ) {
    //     return this.course.properties.enrollment ?
    //       (!!(this.isAuthor || this.userEnrolled)) : true
    //   }
    //   return false
    // },

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
      handler() {
        // console.log('updating...')
        this.$nextTick(() => this.$forceUpdate)
      }
    },

    /**
     * watcher courseFlags: update when courseFlags change
     *
     * Author: cmc
     *
     * Last Updated: October 22, 2021
     */
    courseFlags: {
      handler() {
        this.$forceUpdate()
      },
      deep: true
    }
  },

  beforeRouteUpdate(to,from,next) {
    document.getElementById('main-content-anchor').scrollIntoView()
    next()
    //new commit
  },

  created() {
    this.getCourse()
    // this.fetchEnrollment()
    // this.fetchFlags()
    // this.fetchCourseStats()
  },

  beforeDestroy() {
    // COMMENTED OUT B/C ENROLLMENT DISABLED (cmc 2021-11-09)
    // if(this.enrollment.length > 0) this.updateEnrollment()
    // this.saveFlags()
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
    getCourse() {
      const ctx = this;

      window.scrollTo(0,0)
      document.title = `Laya - ${ctx.name}`
      if (!this.course ||
        this.course.name !== this.$route.params.name ||
        Object.keys(this.course).length === 0)
      {
        console.log('Fetching Course...')
        this.fetchCourse()
      }
    },

    /**
     * Function nextStep: map 'steps' string to components
     *
     * Author: core
     *
     * Last Updated: October 27, 2020
     *
     * @param {string} steps next steps
     */
    nextStep(steps) { // string e.g. '1,2'
      if(!steps) return []

      const {name, $router} = this
      return steps.split(',').map(step => {
        return () =>{
          // if(this.enrollment.length >0) this.enrollment.progress = Number(step)
          $router.push({name: 'course-detail-view', params: {name, step}})
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

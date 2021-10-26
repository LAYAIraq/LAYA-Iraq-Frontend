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

          <div id="main-content-anchor" style="height: 7rem"></div>

          <component v-if="viewPermit"
                     :key="name+'-'+step"
                     :is="contentToDisplay.name"          
                     :onFinish="nextStep(contentToDisplay.nextStep)">
          </component> 
          
          <!--<div v-else>-->
          <div v-else>
            <h2 v-if="!contentToDisplay" class="mt-5 text-center text-muted">
              {{ i18n['courseDetail.content'] }}
            </h2>
            <h2 v-else class="mt-5 text-center text-muted">
              {{ i18n['courseDetail.noPermit'] }}
            </h2>
          </div>
        </div>
      </div>
    </div>

    <courseEdit v-if="isAuthor" :name="name" :step="step" @saved="$forceUpdate"></courseEdit>

  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

import utils from '@/misc/utils.js'
import lyScrollToTop from '@/components/scroll-to-top.vue'
import courseEdit from '@/views/course-edit.vue'
import { locale } from '@/mixins'

export default {
  name: 'course-detail-view',
  mixins: [
    locale
  ],
  props: {
    name: String,
    step: String
  },
  data() {
    return {
      enrollment: {},
      rename: '',
      copy: '',
      changetype: null,
      courseStats: {},
      helpfulkey: 0
    }
  },
  beforeRouteUpdate(to,from,next) {
    document.getElementById('main-content-anchor').scrollIntoView()
    next()
    //new commit
  },
  created() {
    this.fetchCourse()
    // this.fetchEnrollment()
    // this.fetchFlags()
    // this.fetchCourseStats()
  },
  beforeDestroy(){
    if(this.enrollment.length > 0) this.updateEnrollment()
    this.saveFlags()
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

    /**
     * userEnrolled: returns enrollment status
     * 
     * Author: cmc
     * 
     * Last Updated: October 27, 2020
     */
    userEnrolled() {
      return this.$store.state.edit.userEnrolled
    },

    /**
     * contentToDisplay: return current content object
     * 
     * Author: cmc
     * 
     * Last Updated: March 24, 2021
     */
    contentToDisplay() {
      return this.content[this.step-1]
    },

    /**
     * viewPermit: returns true if user is allowed to see selected course
     * 
     * Author: core
     * 
     * Last Updated: October 27, 2020
     */
    viewPermit() {
      if( this.contentToDisplay ) {
        return this.course.properties.enrollment ?
          (!!(this.isAuthor || this.userEnrolled)) : true
      }
      return false
    },

  },
 
  methods: {
    ...utils,

    /**
     * Function fetchCourse: get course from backend, set title
     * 
     * Author: core
     * 
     * Last Updated: October 27, 2020
     */
    fetchCourse() {
      const ctx = this;

      window.scrollTo(0,0)
      document.title = `Laya - ${ctx.name}`
      console.log('Fetching Course...')
      let fc = ctx.$store.dispatch('fetchCourse', ctx.name)
      fc.then( resp => { 
        console.log(resp)
        ctx.$forceUpdate()
        this.fetchEnrollment()
        this.fetchFlags()
        })
        .catch( err => {
         ctx.$router.push('/courses')
         console.error(err)
      })
    },

    /**
     * Function fetchEnrollment: load enrollment status of user 
     * 
     * Author: cmc
     * 
     * Last Updated: October 27, 2020
     */
    fetchEnrollment() {
      if(this.course.properties.enrollment) {
        this.$store.dispatch('fetchEnrollment', this.course.courseId)
      }
    },

    /**
     * Function fetchFlags: Fetch flags for course from vuex
     * Author: cmc
     * Last Updated: July 7, 2021
     */
    fetchFlags() {
      this.$store.dispatch('getCourseFlags', this.course.courseId)
    },

    /**
     * function saveFlags: persist flag state in database
     * Author: cmc
     * Last Updated: July 7, 2021
     */
    saveFlags() {
      this.$store.dispatch('updateFlags')
    },

    /**
     * Function updateEnrollment: update enrollment in store
     * 
     * Author: cmc
     * 
     * Last Updated: October 27, 2020
     */
    updateEnrollment() {
      this.$store.dispatch('updateEnrollment')
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
          if(this.enrollment.length >0) this.enrollment.progress = Number(step)
          $router.push({name: 'course-detail-view', params: {name, step}})
        }
      })
    },

  },
  components: {
    lyScrollToTop,
    courseEdit
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

<template>
  <div v-if="!note.busy" class="course-detail-view">
    <ly-scroll-to-top></ly-scroll-to-top>
    <!-- content delete modal -->
    <b-modal id="author-delContent-confirm"
             :title="i18n.bModal.delContent.title"
             header-bg-variant="danger"
             ok-variant="danger"
             :ok-title="i18n.bModal.delContent.ok"
             :cancel-title="i18n.bModal.cancel"
             @ok="delContent"
             centered>
      <p>{{ i18n.bModal.delContent.text }}</p>
    </b-modal>

    <!-- course delete modal -->
    <b-modal id="author-delCourse-confirm"
             :title="i18n.bModal.delCourse.title"
             header-bg-variant="danger"
             ok-variant="danger"
             :ok-title="i18n.bModal.delCourse.ok"
             :cancel-title="i18n.bModal.cancel"
             @ok="delCourse"
             centered>
      <p v-html="i18n.bModal.delCourse.text"></p>
    </b-modal>

    <!-- course rename modal -->
    <b-modal id="author-renameCourse-confirm"
             :title="i18n.bModal.renameCourse.title"
             header-bg-variant="warning"
             ok-variant="warning"
             :ok-title="i18n.bModal.renameCourse.ok"
             :cancel-title="i18n.bModal.cancel"
             @ok="renameCourse"
             centered>
      <p>
        {{ i18n.bModal.renameCourse.text }}<input
          type="text"
          v-model="rename"
          class="form-control"
          :placeholder="i18n.bModal.renameCourse.placeholder">
      </p>
    </b-modal>

    <!-- course copy modal -->
    <b-modal id="author-copyCourse-confirm"
             :title="i18n.bModal.copyCourse.title"
             header-bg-variant="warning"
             ok-variant="warning"
             :ok-title="i18n.bModal.copyCourse.ok"
             :cancel-title="i18n.bModal.cancel"
             @ok="copyCourse"
             centered>
      <p>
        {{ i18n.bModal.copyCourse.text }}<input
          type="text"
          v-model="copy"
          class="form-control"
          :placeholder="i18n.bModal.copyCourse.placeholder">
      </p>
    </b-modal>

    

    <!-- course statistics modal -->
    <b-modal ok-only id="author-courseStats"
          :title="i18n.bModal.courseStats.title"
          centered>
      <p>  {{ i18n.bModal.courseStats.users }}: {{ courseStats.count }}</p>
      <p>  {{ i18n.bModal.courseStats.time }}: {{ courseStats.averageTime }} </p>
      <p>  {{ i18n.bModal.courseStats.flags }}: 0</p>
      <p>  {{ i18n.bModal.courseStats.stoppedAt }}: {{courseStats.lostUsersAt}}</p>
      <p>  {{ i18n.bModal.courseStats.totalLosses }}: {{ courseStats.usersLost}} </p>
      <p>  {{ i18n.bModal.courseStats.feedback }}: {{ courseStats.feedbackAverage }} </p>
     
    </b-modal>


    <!-- success toast-->
    <b-toast id="author-toast"
             :title="i18n.bToast.title"
             static
             variant="success"
             auto-hide-delay="1500"
             class="author-toast">
      {{ i18n.bToast.text }}
    </b-toast>

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

          <component v-if="viewPermit()"
                     :key="name+'-'+step"
                     :is="content().name"
                     v-bind="content().input"               
                     :onFinish="nextStep(content().nextStep)">
          </component>
          <!--<div v-else>-->
          <div v-else>
            <h2 v-if="!content()" class="mt-5 text-center text-muted">
              {{ i18n.content }}
            </h2>
            <h2 v-else class="mt-5 text-center text-muted">
              {{ i18n.noPermit }}
            </h2>
          </div>
        </div>
      </div>
    </div>

    <div style="height: 4rem"></div>

    <courseEdit v-if="isAuthor" :name="name" :step="step"></courseEdit>

  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex"

import {
  BDropdown,
  BDropdownItem,
  BDropdownHeader,
  BDropdownDivider,
  BToast, 
  //BvToast,
  BModal, 
  //BvModal
} from "bootstrap-vue"

import http from "axios";
import * as i18n from "@/i18n/course-detail";
import utils from "@/misc/utils.js";
import lyScrollToTop from "@/components/scroll-to-top.vue"
import courseEdit from "@/views/course-edit.vue"

export default {
  name: "course-detail-view",
  props: {
    name: String,
    step: String
  },
  data() {
    return {
      course: {},
      userEnrolled: false,
      enrollment: {},
      rename: "",
      copy: "",
      changetype: null,
      courseStats: {}
    }
  },
  beforeRouteUpdate(to,from,next) {
    document.getElementById("main-content-anchor").scrollIntoView()
    next()
  },
  created() {
    this.fetchCourse()
    this.fetchEnrollment()
    // this.fetchCourseStats()
  },
  beforeDestroy(){
    if(this.enrollment) this.updateEnrollment()
  },
  computed: {
    ...mapState(["auth", "note", "edit"]),
    ...mapGetters(["isAuthor", "profileLang", "hasContent"]),

    /* returns empty function on every [] invocation */
    onFinishDummy() {
      return new Proxy({}, {
        get(target, name) {
          return ()=>{}
        }
      })
    },

    i18n () {
      return i18n[this.profileLang]
    },

  },
  methods: {
    ...utils,

    fetchCourse() {
      const ctx = this;

      window.scrollTo(0,0)
      document.title = `Laya - ${ctx.name}`

      this.$store.dispatch("fetchCourse", ctx.name)
    },

    fetchEnrollment() {
      // // console.log("Getting Enrollment status...")
      // const self = this
      // let uid = self.auth.userId
      // let cid = self.name
      // // console.log(cid)
      // // const params = http.paramsSerializer({filter:{where: {studentId: uid, courseId: self.course.name}}})
      // // console.log(params)
      // http.get("enrollments/findOne", {params: {filter:{where: {studentId: uid, courseId: cid}}}})
      //     .then(({data}) => {
      //       // console.log("Enrollment exists!")
      //       // console.log(data)
      //       self.enrollment = data
      //       self.userEnrolled = true
      //     })
      //     .catch(err => {
      //       console.log('No enrollment found!')
      //       // console.error(err)
      //     })
      this.$store.dispatch("fetchEnrollment", this.name)
      
    },

    async fetchCourseStats() {
      const ctx = this
      var listEnr = []

      //get data from enrollments
      await http.get('enrollments/getAllByCourseId', {params: {courseId: this.name}})
        .then(({data}) => {
          console.log(data.subs)
          listEnr = data.subs
        })
        .catch(err => {
          console.error(err)
        })

      var stats = (Object)
      stats = {...stats, count: listEnr.length} //all enrolled users 

      //get avg time to completion
      var timeSpent = 0
      var finished = 0
      var notFinished = 0
      var lostAt = []
      var now = Date.now()
      var avgFeedback = []

      for (const enrol of listEnr) {
        console.log(enrol)
        if (enrol.finished) {
          let userTime = Date.parse(enrol.lastActivity) - Date.parse(enrol.created)
          console.log(`User time: ${userTime} `)
          timespent += userTime
          finished ++
        }
        else { //count as lost if user didn't take action for more than a week
          console.log(`User ${enrol.studentId} didn't finish!`)
          notFinished++
          let lastAct = Date.parse(enrol.lastActivity)
          lastAct >= 604800000? lostAt.push(enrol.progress) : null
        }

        if (enrol.feedback) { // get average of feedback if applicable
          for(let token of enrol.feedback) {
            let highScore = token.options.answers.length
            let avgScore = Number((token.choice.reduce((a,b) => (a+b)) / token.choice.length).toFixed(1))
            console.log(`Score: ${avgScore} of ${highScore} `)
            avgFeedback.push(avgScore)
          }
        }
      }

      console.log(`time spent: ${timeSpent} by ${finished} users who finished`)
      var avgTime = (finished != 0)? this.verbalizeTime(timeSpent/finished): this.verbalizeTime(0)
      
      console.log(`${notFinished} users didn't finish`)
      var lossCnt = Array(ctx.course.content.length).fill(0)
      console.log(lostAt)
      for (let p of lostAt) { //count where not finished users stopped
        lossCnt[p]++
      }
      var bigLoss = lossCnt.indexOf(Math.max(...lossCnt)) + 1 // Index of Content that lost most users
      console.log(`We lost most users at Content #${bigLoss}`)

      var lostUsers = notFinished - lostAt.length //only count users that didn't do anythin for over a week
      console.log(`We lost ${lostUsers} in total`)

      var fbAvg = avgFeedback? (avgFeedback.reduce((a,b) => (a+b)) / avgFeedback.length).toFixed(1) : null //calculate average of averages 

      stats = {...stats, averageTime: avgTime, lostUsersAt: bigLoss, usersLost: lostUsers, feedbackAverage: fbAvg}
      
      

      //TODO: get data for flags

      console.log(stats)
      this.courseStats = stats

    },

    updateEnrollment() {
      this.$store.dispatch("updateEnrollment")
    },

    compView(name) {
      const la = this.$laya.la[name]
      return la ? la.components.view : this.$laya.lb[name].components.view
    },

    content() {
      return this.hasContent[this.step-1]
    },

    viewPermit() {
      if( this.content() ) {
        return (this.isAuthor || this.userEnrolled)? true : false;
      }
      return false
    },

    /* feedback() {
      if(this.course.content[this.step-1].name === "laya-course-feedback") {
        const fb = {
          feedback: this.enrollment.feedback,
          fno: Number(this.step)
        }
        return fb
      }
      return null
    },
 */
    saveFeedback(feedback) {
      var cfb = this.enrollment.feedback
      for (var i in cfb) {
        if(cfb[i].step == this.step) {
          this.updateFeedback(feedback, i)
          return
        }
      }
      this.enrollment.feedback.push(feedback)
      this.storeFeedback()
    },

    updateFeedback(updatedFeedback, index) {
      this.enrollment.feedback[index] = {
        ...this.enrollment.feedback[index], ...updatedFeedback
      }
      console.log("Feedback for step "+ updatedFeedback.step + " updated!")
      this.storeFeedback()
    },

    updateStep(changedStep) {
      this.course.content[this.step-1] = {
        ...this.course.content[this.step-1], ...changedStep
      }
      this.storeCourse()
      this.$forceUpdate()
    },

    updateContent(changedContent) {
      this.course.content = [...changedContent]
      this.storeCourse()
      this.$forceUpdate()
    },

    delContent() {
      this.course.content.splice(this.step-1, 1) 
      this.storeCourse()
    },

    delCourse() {
      http.delete(`courses/${this.name}`)
        .then(function() {
          this.$router.push("/courses")
        })
        .catch(err => console.error("Failed to delete course:", err))
    },

    copyCourse() {
      if(!this.copy) return
      console.log("new copy", this.copy)
      http.head(`courses/${this.copy}`)
        .catch(function() {
          // course name does not exist
          let copied_course = {...this.course}
          copied_course.name = this.copy
          http.post(`courses`, copied_course)
            .catch(err => console.error("Failed course copy:", err))
            .finally(() => this.$bvToast.show("author-toast"))
        })
        .then(function() {
          // course name already exists
        })
    },

    renameCourse() {
      if(!this.rename) return
      console.log("new name", this.rename)
      http.delete(`courses/${this.name}`)
        .then(function() {
          let renamed_course = {...this.course}
          renamed_course.name = this.rename
          http.post(`courses`, renamed_course)
            .catch(err => console.error("Failed course rename:", err))
            .finally(() => {
              this.$bvToast.show("author-toast")
              this.$router.push("/courses")
            })
        })
        .catch(function() {
        })
    },

    changeContentType() {
      if(!this.changetype) return
      console.log("Change type")
      this.updateStep({name: this.changetype, input: null})
    },

    storeCourse() {
      http.patch(`courses/${this.name}`, {content: this.course.content})
        .catch(err => console.error("Failed storing course content:", err))
        .finally(function() {
          this.$bvToast.show("author-toast")
        })
    },

    storeFeedback() {
      const self = this
      http.patch(`enrollments/${self.enrollment.id}`, {feedback: self.enrollment.feedback})
        .catch(err => console.error("Failed storing course feedback:", err))
        .finally(function() {
          //this.$bvToast.show("author-toast")
        })
    },

    nextStep(steps) { // string e.g. "1,2"
      if(!steps) return []

      const {name, $router} = this
      return steps.split(",").map(step => {
        return () =>{
          this.enrollment.progress = Number(step)
          $router.push({name: "course-detail-view", params: {name, step}})
        }
      })
    },

    nextId() {
      return this.hasContent.length+1
    },

    getLocale(comp) {
      let lang = this.$store.state.profile.lang
      if(comp.i18n.hasOwnProperty(lang)) return comp.i18n[lang]
      else return comp.i18n.de
    }

  },
  components: {
    BDropdown,
    BDropdownItem,
    BDropdownHeader,
    BDropdownDivider,
    BToast, 
    //BvToast,
    BModal, 
    //BvModal,
    lyScrollToTop,
    courseEdit
  }
};
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
</style>

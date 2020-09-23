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

    <!-- content change type modal -->
    <b-modal id="author-changeContentType-confirm"
             :title="i18n.bModal.changeType.title"
             header-bg-variant="warning"
             ok-variant="warning"
             :ok-title="i18n.bModal.changeType.ok"
             :cancel-title="i18n.bModal.cancel"
             @ok="changeContentType"
             centered>
      <p>
        {{ i18n.bModal.changeType.text }}<b-form-select
           v-model="changetype"
           :options="plugins">
        </b-form-select>
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
                     :name="name"
                     :init="feedback()"
                     :onSave="saveFeedback"
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

    <!-- author view -->
    <div class="ly-bg-author py-4" v-if="isAuthor">

      <div class="container mb-4">
        <div class="row">
          <div class="col">
            <b-button
              variant="outline-secondary"
              size="sm"
              active-class="active"
              :to="{name: 'course-detail-view', params: {name, step}}"
              exact>
              <i class="fas fa-chevron-left"></i> {{ i18n.toolsNav.overview }}
            </b-button>

              <!-- jump to content number -->
              <span class="content-nav float-right" style="font-size: 120%">
                <b-dropdown id="cid-dd"
                            :text="i18n.toolsNav.jumpTo"
                            size="sm"
                            variant="secondary"
                            no-flip
                            right>
                  <b-dropdown-item v-for="(c,id) in course.content" :key="id"
                                   :to="{name: 'course-detail-view',
                                   params: {name, step: id+1+''}}">
                    {{ i18n.toolsNav.listContent }} <b>{{ id+1 }}</b>
                  </b-dropdown-item>
                </b-dropdown>
              </span>

          </div>
        </div>
      </div>

      <router-view
        :content="content()"
        :onupdate="updateStep"
        :course="course"
        :onnavupdate="updateContent">
      </router-view>

      <div class="container" v-if="isAuthor && $route.name == 'course-detail-view'">

        <!-- edit content -->
        <div class="row mb-2" v-if="content()">
          <div class="col">
            <b-button variant="primary" block append
                      :to="{path: 'edit', params: {type: content.name}}">
              <i class="fas fa-edit"></i> {{ i18n.authTools.editContent }}
            </b-button>
          </div>

          <div class="col text-dark">
            {{ i18n.authTools.editContentTip.replace("{step}", this.step) }}
          </div>
        </div>

        <!-- change content type -->
        <div class="row mb-2" v-if="content()">
          <div class="col">
            <b-button variant="warning" block
                      @click="$bvModal.show('author-changeContentType-confirm')">
              <i class="fas fa-edit"></i> {{ i18n.authTools.changeType }}
            </b-button>
          </div>

          <div class="col text-dark" v-html="i18n.authTools.changeTypeTip">
          </div>
        </div>

        <!-- new content -->
        <div class="row mb-2">
          <div class="col">

            <b-dropdown id="new-content-dd"
                        variant="primary"
                        class="w-100"
                        dropright>
              <template slot="button-content">
                <i class="fas fa-plus"></i> {{ i18n.authTools.newContent }}
              </template>

              <b-dropdown-header>{{ i18n.authTools.newContentBlock }}</b-dropdown-header>
              <b-dropdown-item v-for="block in $laya.lb"
                               :key="block.id"
                               :to="'/courses/'+name+'/'+nextId()+'/new/'+block.id">
                {{ getLocale(block) }}
              </b-dropdown-item>

              <b-dropdown-divider></b-dropdown-divider>

              <b-dropdown-header>{{ i18n.authTools.newContentAssmnt }}</b-dropdown-header>
              <b-dropdown-item v-for="ass in $laya.la"
                               :key="ass.id"
                               :to="'/courses/'+name+'/'+nextId()+'/new/'+ass.id">
                {{ getLocale(ass) }}
              </b-dropdown-item>
            </b-dropdown>

          </div>

          <div class="col text-dark">
            {{ i18n.authTools.newContentTip }}
            <b>{{nextId()}}</b>.
          </div>
        </div>

        <!-- Edit Course Navigation -->
        <div class="row mb-2" v-if="course.content.length > 0">
          <div class="col">
            <b-button block variant="primary" append :to="{path: 'editNav'}">
              <i class="fas fa-project-diagram"></i> {{ i18n.authTools.editNav }}
            </b-button>
          </div>

          <div class="col text-dark">
            <span v-if="courseNavIncomplete()"
                  class="bg-warning mr-1 rounded"
                  style="padding: 2px 5px">
              <i class="fas fa-exclamation-triangle"></i> {{ i18n.authTools.editNavIncomplete }}
            </span>
            {{ i18n.authTools.editNavTip.replace("{steps}", course.content.length ) }}
          </div>
        </div>

        <!-- rename course -->
        <div class="row mt-3">
          <div class="col">
            <b-button size="sm"
                      variant="warning"
                      class="float-right"
                      @click="$bvModal.show('author-renameCourse-confirm')">
              <i class="fas fa-exclamation-circle"></i> {{ i18n.authTools.renameCourse }}
            </b-button>
          </div>

          <div class="col text-dark">
            {{ i18n.authTools.renameCourseTip }}
          </div>
        </div>

        <!-- Copy Course -->
        <div class="row mt-3">
          <div class="col">
            <b-button size="sm"
                      variant="warning"
                      class="float-right"
                      @click="$bvModal.show('author-copyCourse-confirm')">
              <i class="fas fa-exclamation-circle"></i> {{ i18n.authTools.copyCourse }}
            </b-button>
          </div>

          <div class="col text-dark">
            {{ i18n.authTools.copyCourseTip }}
          </div>
        </div>

        <!-- Delete content -->
        <div class="row mt-5" v-if="content()">
          <div class="col">
            <b-button size="sm"
                      variant="danger"
                      class="float-right"
                      @click="$bvModal.show('author-delContent-confirm')">
              <i class="fas fa-exclamation-circle"></i> {{ i18n.authTools.deleteContent }}
            </b-button>
          </div>

          <div class="col text-dark">
            {{ i18n.authTools.deleteContentTip }}
          </div>
        </div>

        <!-- delete course-->
        <div class="row mt-3">
          <div class="col">
            <b-button size="sm"
                      variant="danger"
                      class="float-right"
                      @click="$bvModal.show('author-delCourse-confirm')">
              <i class="fas fa-exclamation-circle"></i> {{ i18n.authTools.deleteCourse }}
            </b-button>
          </div>

          <div class="col text-dark" v-html="i18n.authTools.deleteCourseTip">
            
          </div>
        </div>

        <!-- View Course Statistics -->
        <div class="row mt-5">
          <div class="col">
            <b-button block variant="success" @click="$bvModal.show('author-courseStats')">
              <i class="fas fa-info-circle"></i> {{ i18n.authTools.seeStats }}
            </b-button>
          </div>

          <div class="col text-dark">
            {{ i18n.authTools.statsTip }}
          </div>
        </div>

      </div>
    </div>

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
import VueI18n from "vue-i18n"

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
    this.fetchCourseStats()
  },
  beforeDestroy(){
    if(this.enrollment) this.updateEnrollment()
  },
  computed: {
    ...mapState(["auth", "note"]),
    ...mapGetters(["isAuthor"]),

    /* returns empty function on every [] invocation */
    onFinishDummy() {
      return new Proxy({}, {
        get(target, name) {
          return ()=>{}
        }
      })
    },

    plugins() {
      const la = this.$laya.la
      const lb = this.$laya.lb
      let lalb = [{value: null, text: this.i18n.changeTypeText, disabled: true}]
      let lang = this.$store.state.profile.lang
      for(const id in lb) {
        if (lb[id].i18n.hasOwnProperty(lang))
          lalb.push({value: id, text: lb[id].i18n[lang]})
        else lalb.push({value: id, text: lb[id].i18n.de})
      }
      for(const id in la)
        if (la[id].i18n.hasOwnProperty(lang))
          lalb.push({value: id, text: la[id].i18n[lang]})
        else lalb.push({value: id, text: la[id].i18n.de})
      return lalb
    },

    i18n () {
      return i18n[this.$store.state.profile.lang]
    },

  },
  methods: {
    ...utils,

    fetchCourse() {
      const ctx = this;

      window.scrollTo(0,0)
      document.title = `Laya - ${ctx.name}`

      ctx.$store.commit("setBusy", true);
      /*
      * fetch course */
      http.get(`courses/${ctx.name}`)
        .then(({ data }) => {
          ctx.course = data;
        })
        .catch(err => {
          /*
          * redirect off invalid course */
          console.error(err);
          this.$router.push("/courses");
        })
        .then(() => ctx.$store.commit("setBusy", false));
    },

    fetchEnrollment() {
      // console.log("Getting Enrollment status...")
      const self = this
      let uid = self.auth.userId
      let cid = self.name
      // console.log(cid)
      // const params = http.paramsSerializer({filter:{where: {studentId: uid, courseId: self.course.name}}})
      // console.log(params)
      http.get("enrollments/findOne", {params: {filter:{where: {studentId: uid, courseId: cid}}}})
          .then(({data}) => {
            // console.log("Enrollment exists!")
            // console.log(data)
            self.enrollment = data
            self.userEnrolled = true
          })
          .catch(err => {
            console.log('No enrollment found!')
            // console.error(err)
          })
      
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
      var lossCnt = Array(this.course.content.length).fill(0)
      console.log(lostAt)
      for (let p of lostAt) { //count where not finished users stopped
        lossCnt[p]++
      }
      var bigLoss = lossCnt.indexOf(Math.max(...lossCnt)) + 1 // Index of Content that lost most users
      console.log(`We lost most users at Content #${bigLoss}`)

      var lostUsers = notFinished - lostAt.length //only count users that didn't do anythin for over a week
      console.log(`We lost ${lostUsers} in total`)

      var fbAvg = (avgFeedback.reduce((a,b) => (a+b)) / avgFeedback.length).toFixed(1) //calculate average of averages 

      stats = {...stats, averageTime: avgTime, lostUsersAt: bigLoss, usersLost: lostUsers, feedbackAverage: fbAvg}
      
      

      //TODO: get data for flags

      console.log(stats)
      this.courseStats = stats

    },

    updateEnrollment() {
      const enrol = this.enrollment

      http.patch(`enrollments/${enrol.id}`, enrol)
          .then(resp => {
            console.log("Enrollment updated!")
          })
          .catch(err => {
            console.error(err)
          })
    },

    compView: function(name) {
      const la = this.$laya.la[name]
      return la ? la.components.view : this.$laya.lb[name].components.view
    },

    content() {
      return this.course.content[this.step-1]
    },

    viewPermit() {
      const crs = this.content()
      if(crs) {
        
        return (this.isAuthor || this.userEnrolled)? true : false;
      }
      return false
    },

    feedback() {
      if(this.course.content[this.step-1].name === "laya-course-feedback") {
        const fb = {
          feedback: this.enrollment.feedback,
          fno: Number(this.step)
        }
        return fb
      }
      return null
    },

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

    courseNavIncomplete() {
      return this.course.content.reduce((all, c) => (!c.nextStep || all), false)
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
      return this.course.content.length+1
    },

    getLocale(comp) {
      let lang = this.$store.state.profile.lang
      if(comp.i18n.hasOwnProperty(lang)) return comp.i18n[lang]
      else return comp.i18n.de
    }

    /*
    
    subscribe() {
      const ctx = this;
      http
        .put(`accounts/${ctx.auth.userId}/mycourses/rel/${ctx.course.name}`)
        .then(({ data }) => {
          ctx.$store.commit("addMyCourse");
          ctx.userEnrolled = true;
        })
        .catch(err => console.error(err));
    },

    unsubscribe() {
      const ctx = this;
      ctx.$store.commit("setBusy", true);
      http
        .delete(`accounts/${ctx.auth.userId}/mycourses/rel/${ctx.course.name}`)
        .then(({ data }) => {
          ctx.userEnrolled = false;
        })
        .catch(err => console.error(err))
        .then(() => {
          ctx.$store.commit("setBusy", false);
        });
    },

    learn() {
      const ctx = this;
      http.get(`courses/${ctx.course.name}/startInteraction`)
        .then(({ data }) => {
          console.log("data", data);
          let li = ctx.$laya.lookupType(data.assessmentType);
          switch (li.type) {
            case "assessment":
              ctx.$router.push({
                name: "assessment-view",
                // FIXME data.id might be inconsistent with specific with Assessment's id. Ask Sebastian for details
                params: { type: li.id, assId: data.id }
              });
              break;
            case "block":
              // TODO add logic for learning blocks.
          }
        });
    }
    */
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
    lyScrollToTop
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

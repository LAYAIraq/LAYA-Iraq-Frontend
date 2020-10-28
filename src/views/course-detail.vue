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

    <courseEdit v-if="isAuthor" :name="name" :step="step" @saved="$forceUpdate"></courseEdit>

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
  BModal
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
    ...mapGetters(["isAuthor", "profileLang", "hasContent", "hasCourse"]),

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

    userEnrolled() {
      return this.$store.state.edit.userEnrolled
    }

  },
  methods: {
    ...utils,

    fetchCourse() {
      const ctx = this;

      window.scrollTo(0,0)
      document.title = `Laya - ${ctx.name}`
      console.log("Fetching Course...")
      let fc = ctx.$store.dispatch("fetchCourse", ctx.name)
      fc.then( resp => { 
          console.log(resp)
        })
        .catch( err => {
        ctx.$router.push("/courses")
      })
    },

    fetchEnrollment() {
      this.$store.dispatch("fetchEnrollment", this.hasCourse.createDate)
    },

    updateEnrollment() {
      this.$store.dispatch("updateEnrollment")
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

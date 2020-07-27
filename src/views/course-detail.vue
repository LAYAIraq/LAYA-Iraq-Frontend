<template>
  <div v-if="!note.busy" class="course-detail-view">

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
      <p>{{ i18n.bModal.delCourse.text }}</p>
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
            <b>{{ course.name }}</b>
          </h1>

        </div>
      </div>
    </div>

    <!-- content -->
    <div class="container content">
      <div class="row">
        <div class="col">

          <div id="main-content-anchor" style="height: 7rem"></div>

          <component v-if="content()"
                     :key="name+'-'+step"
                     :is="content().name"
                     v-bind="content().input"
                     :name="name"
                     :courseFeedback="feedback()"
                     :onFinish="nextStep(content().nextStep)">
          </component>

          <h2 v-else class="mt-5 text-center text-muted">
            {{ i18n.content }}
          </h2>

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
            {{ i18n.authTools.editContentTip1 }} <b>{{step}}</b> 
            {{ i18n.authTools.editContentTip2 }}
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

          <div class="col text-dark">
            {{ i18n.authTools.changeTypeTip1 }}
            <u>{{ i18n.authTools.changeTypeTip2 }}</u> {{ i18n.authTools.changeTypeTip3 }}
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
                {{ block.i18n.de }}
              </b-dropdown-item>

              <b-dropdown-divider></b-dropdown-divider>

              <b-dropdown-header>{{ i18n.authTools.newContentAssmnt }}</b-dropdown-header>
              <b-dropdown-item v-for="ass in $laya.la"
                               :key="ass.id"
                               :to="'/courses/'+name+'/'+nextId()+'/new/'+ass.id">
                {{ ass.i18n.de }}
              </b-dropdown-item>
            </b-dropdown>

          </div>

          <div class="col text-dark">
            {{ i18n.authTools.newContentTip }}
            <b>{{nextId()}}</b>.
          </div>
        </div>

        <div class="row" v-if="course.content.length > 0">
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
            {{ i18n.authTools.editNavTip1 }}
            {{course.content.length}} {{ i18n.authTools.editNavTip2 }}
          </div>
        </div>

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

        <div class="row mt-3">
          <div class="col">
            <b-button size="sm"
                      variant="danger"
                      class="float-right"
                      @click="$bvModal.show('author-delCourse-confirm')">
              <i class="fas fa-exclamation-circle"></i> {{ i18n.authTools.deleteCourse }}
            </b-button>
          </div>

          <div class="col text-dark">
            {{ i18n.authTools.deleteCourseTip1 }} <u>{{ i18n.authTools.deleteCourseTip2 }}</u> {{ i18n.authTools.deleteCourseTip3 }} 
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
  BToast, BvToast,
  BModal, BvModal
} from "bootstrap-vue"

import http from "axios";
import * as i18n from "@/i18n/course-detail";
import utils from "../misc/utils.js";

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
      rename: "",
      copy: "",
      changetype: null
    }
  },
  beforeRouteUpdate(to,from,next) {
    document.getElementById("main-content-anchor").scrollIntoView()
    next()
  },
  created() {
    const ctx = this;

    window.scrollTo(0,0)
    document.title = `Laya - ${ctx.name}`

    ctx.$store.commit("setBusy", true);
    /*
     * fetch course */
    http.get(`courses/${ctx.name}`)
      .then(function({ data }) {
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
  computed: {
    ...mapState(["auth", "note"]),
    ...mapGetters(["isAuthor"]),

    /* returns empty function on every [] invocation */
    onFinishDummy: function() {
      return new Proxy({}, {
        get: function(target, name) {
          return function(){}
        }
      })
    },

    plugins: function() {
      const la = this.$laya.la
      const lb = this.$laya.lb
      let lalb = [{value: null, text: this.i18n.changeTypeText, disabled: true}]
      for(const id in lb)
        lalb.push({value: id, text: lb[id].i18n.de})
      for(const id in la)
        lalb.push({value: id, text: la[id].i18n.de})
      return lalb
    },

    i18n () {
      return i18n[this.$store.state.profile.lang]
    }
  },
  methods: {
    ...utils,

    compView: function(name) {
      const la = this.$laya.la[name]
      return la ? la.components.view : this.$laya.lb[name].components.view
    },

    content: function() {
      return this.course.content[this.step-1]
    },

    feedback: function() {
      return this.course.feedback
    },

    updateStep: function(changedStep) {
      this.course.content[this.step-1] = {
        ...this.course.content[this.step-1], ...changedStep
      }
      this.storeCourse()
      this.$forceUpdate()
    },

    updateContent: function(changedContent) {
      this.course.content = [...changedContent]
      this.storeCourse()
      this.$forceUpdate()
    },

    delContent: function() {
      this.course.content.splice(this.step-1, 1) 
      this.storeCourse()
    },

    delCourse() {
      const self = this
      http.delete(`courses/${self.name}`)
        .then(function() {
          self.$router.push("/courses")
        })
        .catch(err => console.error("Failed to delete course:", err))
    },

    copyCourse() {
      const self = this
      if(!self.copy) return
      console.log("new copy", self.copy)
      http.head(`courses/${self.copy}`)
        .catch(function() {
          // course name does not exist
          let copied_course = {...self.course}
          copied_course.name = self.copy
          http.post(`courses`, copied_course)
            .catch(err => console.error("Failed course copy:", err))
            .finally(() => self.$bvToast.show("author-toast"))
        })
        .then(function() {
          // course name already exists
        })
    },

    renameCourse() {
      const self = this
      if(!self.rename) return
      console.log("new name", self.rename)
      http.delete(`courses/${self.name}`)
        .then(function() {
          let renamed_course = {...self.course}
          renamed_course.name = self.rename
          http.post(`courses`, renamed_course)
            .catch(err => console.error("Failed course rename:", err))
            .finally(() => {
              self.$bvToast.show("author-toast")
              self.$router.push("/courses")
            })
        })
        .catch(function() {
        })
    },

    changeContentType() {
      const self = this
      if(!self.changetype) return
      console.log("Change type")
      self.updateStep({name: self.changetype, input: null})
    },

    storeCourse() {
      const self = this
      http.patch(`courses/${self.name}`, {content: self.course.content})
        .catch(err => console.error("Failed storing course content:", err))
        .finally(function() {
          self.$bvToast.show("author-toast")
        })
    },

    courseNavIncomplete: function() {
      return this.course.content.reduce((all, c) => (!c.nextStep || all), false)
    },

    nextStep(steps) { // string e.g. "1,2"
      if(!steps) return []

      const {name, $router} = this
      return steps.split(",").map(step => {
        return function() {
          $router.push({name: "course-detail-view", params: {name, step}})
        }
      })
    },

    nextId() {
      return this.course.content.length+1
    }

    /*
    
    subscribe: function() {
      const ctx = this;
      http
        .put(`accounts/${ctx.auth.userId}/mycourses/rel/${ctx.course.name}`)
        .then(({ data }) => {
          ctx.$store.commit("addMyCourse");
          ctx.userEnrolled = true;
        })
        .catch(err => console.error(err));
    },

    unsubscribe: function() {
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
    BToast, BvToast,
    BModal, BvModal
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

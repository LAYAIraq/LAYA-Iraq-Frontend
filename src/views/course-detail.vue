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
                     :init="feedback()"
                     :onSave="saveFeedback"
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
            {{ i18n.authTools.editNavTip.replace("{steps}", course.content.length ) }}
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

          <div class="col text-dark" v-html="i18n.authTools.deleteCourseTip">
            
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
    }
  },
  methods: {
    ...utils,
    
    compView(name) {
      const la = this.$laya.la[name]
      return la ? la.components.view : this.$laya.lb[name].components.view
    },

    content() {
      return this.course.content[this.step-1]
    },

    feedback() {
      if(this.course.content[this.step-1].name === "laya-course-feedback") {
        const fb = {
          cid: this.course.authorId,
          created: Date.parse(this.course.createDate),
          feedback: this.course.feedback,
          uid: this.auth.userId,
          fno: Number(this.step)
        }
        return fb
      }
      return null
    },

     saveFeedback(feedback) {
      var cfb = this.course.feedback
      for (var i in cfb) {
        if(cfb[i].fid === feedback.fid) {
          this.updateFeedback(feedback, i)
          return
        }
      }
      this.course.feedback.push(feedback)
      this.storeFeedback()
    },

    updateFeedback(updatedFeedback, index) {
      this.course.feedback[index] = {
        ...this.course.feedback[index], ...updatedFeedback
      }
      //console.log("Feedback id "+ updatedFeedback.fid + " updated!")
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
      http.patch(`courses/${this.name}`, {feedback: this.course.feedback})
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
        return function() {
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

<template>
  <div v-if="!note.busy" class="course-detail-view">

    <b-toast id="author-toast"
             title="Autor-Tools"
             static
             variant="success"
             auto-hide-delay="1500"
             class="author-toast">
      Speichern erfolgreich!
    </b-toast>

    <!-- course header -->
    <div class="container-fluid bg-dark">
      <div class="row">
        <div class="col">

          <div style="height: 3rem"></div>
          <h1 class="text-center text-light py-5">
            <b>{{ course.name }}</b>
          </h1>
          <div style="height: 2rem"></div>

        </div>
      </div>
    </div>

    <!-- content -->
    <div class="container content mt-5">
      <div class="row">
        <div class="col">

          <component v-if="content()"
            :is="content().name"
            v-bind="content().input"
            :onFinish="nextStep(content().nextStep)">
          </component>

          <h2 v-else class="mt-5 text-center text-muted">
            Dieser Inhalt ist noch leer
          </h2>

        </div>
      </div>
    </div>

    <div style="height: 4rem"></div>

    <!-- author view -->
    <div class="ly-bg-author py-4">

      <div class="container mb-4">
        <div class="row">
          <div class="col">
            <router-link
              :to="{name: 'course-detail-view', params: {name, step}}"
              active-class="author-tools-active"
              class="text-secondary text-decoration-none pb-1"
              style="font-size: 120%"
              exact>
              <i class="fas fa-tools"></i> Autor-Tools
            </router-link>

            <span class="content-nav float-right" style="font-size: 120%">
              aktueller Inhalt:
              <router-link v-if="step > 1"
                           :to="{name: 'course-detail-view', params: {name, step: step-1+''}}"
                           class="px-2">
                <i class="fas fa-chevron-left"></i>
              </router-link>

              <b>{{step}}</b>

              <router-link v-if="step < course.content.length"
                           :to="{name: 'course-detail-view', params: {name, step: 1*step+1+''}}"
                           class="px-2">
                <i class="fas fa-chevron-right"></i>
              </router-link>
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
              <i class="fas fa-edit"></i> Inhalt bearbeiten
            </b-button>
          </div>

          <div class="col text-dark">
            Damit kannst Du den oben angezeigten Inhalt ( Nr. <b>{{step}}</b> )
            bearbeiten.
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
                <i class="fas fa-plus"></i> Neuen Inhalt hinzufügen
              </template>

              <b-dropdown-header>Lernbausteine</b-dropdown-header>
              <b-dropdown-item v-for="block in $laya.lb"
                               :key="block.id"
                               :to="'/courses/'+name+'/'+nextId()+'/new/'+block.id">
                {{ block.i18n.de }}
              </b-dropdown-item>

              <b-dropdown-divider></b-dropdown-divider>

              <b-dropdown-header>Lernüberprüfungen</b-dropdown-header>
              <b-dropdown-item v-for="ass in $laya.la"
                               :key="ass.id"
                               :to="'/courses/'+name+'/'+nextId()+'/new/'+ass.id">
                {{ ass.i18n.de }}
              </b-dropdown-item>
            </b-dropdown>

          </div>

          <div class="col text-dark">
            Damit kannst Du einen neuen Inhalt erstellen. Er wird die Nummer
            <b>{{nextId()}}</b> haben.
          </div>
        </div>

        <div class="row" v-if="course.content.length > 0">
          <div class="col">
            <b-button block variant="primary" append :to="{path: 'editNav'}">
              <i class="fas fa-project-diagram"></i> Kursführung bearbeiten
            </b-button>
          </div>

          <div class="col text-dark">
            Damit kannst Du die Kursführung bearbeiten. Insgesamt hat der Kurs
            {{course.content.length}} Inhalte.
            <p v-if="courseNavIncomplete()" class="bg-warning text-center">
              <i class="fas fa-exclamation-triangle"></i> Unvollständig
            </p>
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
  BToast, BvToast
} from "bootstrap-vue"

import http from "axios";
import * as i18n from "../i18n/login";
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
    }
  },
  created() {
    const ctx = this;
    window.scrollTo(0, 0);
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

    updateStep: function(changedStep) {
      this.course.content[this.step-1] = {...changedStep}
      this.storeCourse()
      this.$forceUpdate()
    },

    updateContent: function(changedContent) {
      this.course.content = [...changedContent]
      this.storeCourse()
      this.$forceUpdate()
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
    BToast, BvToast
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

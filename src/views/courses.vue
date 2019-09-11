<template>
  <div class="courses-view">
    <div class="container">
      <div class="row">
        <img class="mx-auto" src="../assets/kurse.svg" alt="Gerhirn">
      </div>

      <div style="height: 2rem"></div>

      <div class="row">
        <div class="col">
          <h1 class="text-center">
            <strong>{{ i18n.title }}</strong>
          </h1>
        </div>
      </div>

      <div style="height: 2rem"></div>

      <div class="row">
        <div class="col">
          <div class="ly-search-bar">
            <input id="search-bar"
                   type="text"
                   v-model="search"
                   :placeholder="i18n.searchPH">
            <i class="icon fas fa-search"></i>
          </div>
        </div>
      </div>
    </div>

    <div style="height: 2rem"></div>

    <div class="ly-bg-grey py-5">
      <div class="container">
        <div class="row">
          <div class="col">

            <ly-course-list :courses="courses" :filter="search">
            </ly-course-list>

          </div> <!-- col -->
        </div> <!-- row -->
      </div> <!-- container -->
    </div>

    <div style="height: 5rem"></div>

    <!-- author view -->
    <div class="ly-bg-author py-4">
      <div class="container">
        <div class="row">
          <div class="col">
            <lyCourseEdit v-if="isAuthor"></lyCourseEdit>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex"

import lyCourseEdit from "@/components/authoring/course-update"
import lyCourseList from "@/components/ly-course-list"

import http from "axios";
import * as i18n from "@/i18n/courses";
import utils from "../misc/utils.js";

export default {
  name: "courses-view",
  mounted() {
    document.querySelector("#search-bar").focus();
    this.fetchCourses();
  },
  data() {
    return {
      courses: [],
      search: "",
    };
  },
  computed: {
    ...mapState(["note", "auth"]),
    ...mapGetters(["isAuthor"]),

    i18n: function() {
      return i18n[this.$store.state.profile.lang];
    },
  },
  methods: {
    ...utils,

    fetchCourses: function() {
      let ctx = this;
      http.get("courses?filter[include]=author").then( ({data}) => {
        ctx.courses = [...data]
      }).catch(err => console.error(err))
    },

    delCourse: function(name) {
      const { fetchCourses } = this;
      http.delete(`courses/${name}`)
        .catch(err => console.error(err))
        .then(fetchCourses)
    },

  },
  components: {
    lyCourseEdit,
    lyCourseList
  }
}
</script>

<style scoped>
*:focus {
  outline-offset: 5px;
  outline: 2px dashed deepskyblue;
}

.ly-search-bar {
  width: 100%;
  padding: 5px 10px;
  border: 2px solid black;
}
.ly-search-bar input {
  width: 90%;
  font-size: 120%;
  border: none;
}
.ly-search-bar .icon {
  float: right;
  margin: 0.4em;
}

#search-bar:focus {
  outline-offset: 1rem;
}
</style>

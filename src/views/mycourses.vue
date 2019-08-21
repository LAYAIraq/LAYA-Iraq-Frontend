<template>
  <div class="mycourses-view">
    <!-- avatar -->
    <div class="bg-dark pt-5 pb-3 mb-5">
      <img
        v-if="profile.avatar !== ''"
        :src="avatarURL"
        alt="Avatar"
        class="d-block rounded-circle mx-auto avatar"
      >
      <img
        v-else
        src="../assets/anmelden.svg"
        alt="Avatar"
        class="d-block rounded-circle mx-auto avatar"
      >
      <h1 class="text-center text-light">{{ profile.name }}</h1>
    </div>

    <!-- filter and search -->
    <div class="container">
      <div class="row">
        <div class="col">
          <div class="d-flex justify-content-between">
            <h2 id="tab-focus" tabindex="0">
              <b>{{ i18n.title }}</b>
            </h2>
          </div>
          <div class="sep"></div>
          <div id="filters" class="d-flex justify-content-start flex-wrap">
            <a
              href
              v-for="cat in cats"
              @click.prevent="cat.on = !cat.on"
              class="filter"
              :class="{active: cat.on}"
            >
              <u>{{ cat.label }}</u>
            </a>
          </div>
          <div class="sep"></div>

          <div class="ly-search-bar">
            <input
              id="search-bar"
              type="text"
              v-model="searchStr"
              :placeholder="i18n.searchPH"
              autofocus
            >
            <i class="fas fa-search"></i>
          </div>
        </div>
      </div>
    </div>

    <div style="height: 2rem"></div>

    <div class="ly-bg-grey">
      <div class="container">
        <div class="row">
          <div class="col">
            <ly-accordion :data="search(sort(filter(courses)))">
              <div slot="header">
                <div class="d-flex">
                  <div style="flex-basis: 25%;"></div>
                  <a href @click.prevent="sortByName" class="w-50 pt-3 pb-3">
                    <i :class="nameSortIcon"></i>
                    <span class="d-none d-sm-inline">{{ i18n.sortByName }}</span>
                  </a>
                  <a href @click.prevent="sortByDate" class="w-25 text-right pt-3 pb-3">
                    <i :class="dateSortIcon"></i>
                    <span class="d-none d-sm-inline">{{ i18n.sortByDate }}</span>
                  </a>
                </div>
              </div>

              <div slot="item" slot-scope="data">
                <div class="d-flex">
                  <!-- left meta infos -->
                  <div class="w-25 pr-5">
                    <h3 class="d-flex justify-content-start h-25">
                      <span v-if="data.item.locked" class="mr-2">
                        <i class="fas fa-lock"></i>
                      </span>
                      <span v-if="data.item.endDate" class="mr-2">
                        <i class="fas fa-stopwatch"></i>
                      </span>
                    </h3>
                    <span v-if="data.item.endDate">
                      {{ shortDate(data.item.startDate) }} &mdash;
                      {{ shortDate(data.item.endDate) }}
                    </span>
                  </div>

                  <!-- course link -->
                  <router-link
                    :to="{ name: 'course-detail-view', params: { id: data.item.name}}"
                    class="w-50"
                  >
                    <h4 class="m-0">
                      <u>
                        <strong>{{ data.item.name }}</strong>
                      </u>
                    </h4>
                    <span>{{ data.item.category }}</span>
                    <span>&mdash;</span>
                    <br>
                    <!-- TODO dynamic author lookup -->
                    <span>Stefanie</span>
                  </router-link>

                  <!-- right meta infos -->
                  <div class="w-25 text-right">
                    <span>{{ locDate(data.item.createDate) }}</span>
                  </div>
                </div>
              </div>
            </ly-accordion>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

import bCollapse from "bootstrap-vue/es/components/collapse/collapse";
import vBToggle from "bootstrap-vue/es/directives/toggle/toggle";
import lyAccordion from "@/components/accordion";

import http from "axios";
import * as i18n from "@/i18n/mycourses";
import utils from "../misc/utils.js";
import be from "../backend-url.ts";

export default {
  name: "mycourses-view",
  data() {
    return {
      cats: [],
      courses: [],

      sortBy: "nameDESC",
      searchStr: ""
    };
  },
  computed: {
    ...mapState(["profile", "note", "auth"]),

    i18n: function() {
      return i18n[this.$store.state.profile.lang];
    },
    avatarURL: function() {
      return `${be()}/storage/img/download/${this.profile.avatar}`;
    },
    nameSortIcon: function() {
      return {
        "fas fa-sort-up": this.sortBy === "nameASC",
        "fas fa-sort-down": this.sortBy === "nameDESC",
        "fas fa-sort": /date/.test(this.sortBy)
      };
    },
    dateSortIcon: function() {
      return {
        "fas fa-sort-up": this.sortBy === "dateASC",
        "fas fa-sort-down": this.sortBy === "dateDESC",
        "fas fa-sort": /name/.test(this.sortBy)
      };
    }
  },
  methods: {
    ...utils,
    search: function(courses) {
      const { searchStr } = this;
      if (searchStr === "") return courses;
      return courses.filter(course => {
        const re = new RegExp(searchStr, "i");
        return re.test(course.name);
      });
    },
    filter: function(courses) {
      if (courses.length === 0) return courses;
      let activeCats = this.cats.filter(c => c.on).map(c => c.label);
      if (activeCats.length === 0) return courses;
      return courses.filter(c => activeCats.includes(c.category));
    },
    sort: function(_courses) {
      let courses = [..._courses];
      const by = this.sortBy;
      if (by === "nameASC") {
        return courses.sort((c1, c2) => c1.name < c2.name);
      }
      if (by === "nameDESC") {
        return courses.sort((c1, c2) => c1.name >= c2.name);
      }
      if (by === "dateASC") {
        return courses.sort((c1, c2) => c1.createDate < c2.createDate);
      }
      if (by === "dateDESC") {
        return courses.sort((c1, c2) => c1.createDate >= c2.createDate);
      }
      return courses;
    },
    sortByName: function() {
      if (this.sortBy === "nameASC") {
        this.sortBy = "nameDESC";
        return;
      }
      if (this.sortBy === "nameDESC") {
        this.sortBy = "nameASC";
        return;
      }
      this.sortBy = "nameDESC";
    },
    sortByDate: function() {
      if (this.sortBy === "dateASC") {
        this.sortBy = "dateDESC";
        return;
      }
      if (this.sortBy === "dateDESC") {
        this.sortBy = "dateASC";
        return;
      }
      this.sortBy = "dateDESC";
    }
  },
  beforeRouteEnter(to, from, next) {
    next();
  },
  mounted() {
    document.querySelector("#tab-focus").focus();
  },
  created() {
    const ctx = this;
    this.$store.commit("setBusy", true);
    this.$store.commit("clearMyCourse");
    /*
     * fetch courses */
    http
      .get(`accounts/${ctx.auth.userId}/mycourses?filter[include]=author`)
      .then(function({ data }) {
        ctx.courses = data;
        /*
         * create filters from categories */
        const filters = [];
        const cats = ctx.courses.map(course => course.category);
        cats.forEach(cat => {
          if (filters.indexOf(cat) === -1) filters.push(cat);
        });
        ctx.cats = filters.map(f => ({ label: f, on: false }));
      })
      .catch(err => console.error(err))
      .then(() => ctx.$store.commit("setBusy", false));
  },
  components: {
    lyAccordion,
    bCollapse,
    vBToggle
  }
};
</script>

<style scoped>
*:focus {
  outline-offset: 5px;
  outline: 2px dashed deepskyblue;
}

#avatar {
  border: 2px solid white;
  width: 7rem;
  height: 7rem;
}

.sep {
  height: 1px;
  background-color: black;
  margin: 1rem 0 1rem 0;
}

#filters {
  margin: 0 -1rem -1rem 0;
}

.filter {
  border: 1px dotted black;
  padding: 0.5rem 1rem;
  margin: 0 1rem 1rem 0;
}

.filter.active {
  border-style: solid;
  background-color: black;
}

.filter * {
  color: black;
}

.filter.active * {
  color: white;
}

.separator {
  display: none;
}

.ly-search-bar input {
  outline-offset: 1rem !important;
}

.avatar {
  width: 7rem;
  height: 7rem;
  border: 2px solid #eee;
  background-color: #eee;
}
</style>

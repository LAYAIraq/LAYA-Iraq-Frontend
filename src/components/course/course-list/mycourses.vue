<!--
  Filename: mycourses.vue
  Use: show courses for certain user
  Creator: core
  Since: v1.0.0
-->

<template>
  <div class="mycourses">
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
        src="../../../assets/images/anmelden.svg"
        alt="Avatar"
        class="d-block rounded-circle mx-auto avatar"
      >
      <h1 class="text-center text-light">
        {{ profile.username }}
      </h1>
    </div>

    <!-- filter and search -->
    <div class="container">
      <div class="row">
        <div class="col">
          <div class="d-flex justify-content-between">
            <h2
              id="tab-focus"
              tabindex="0"
            >
              <b>{{ y18n('mycourses.title') }}</b>
            </h2>
          </div>
          <div class="sep"></div>
          <div
            id="filters"
            class="d-flex justify-content-start flex-wrap"
          >
            <a
              v-for="cat in cats"
              :key="cat"
              href
              class="filter"
              :class="{active: cat.on}"
              @click.prevent="cat.on = !cat.on"
            > <!-- was missing v-bind:key directive -->
              <u>{{ cat.label }}</u>
            </a>
          </div>
          <div class="sep"></div>

          <div class="search-bar">
            <input
              id="search-bar"
              v-model="searchStr"
              type="text"
              :placeholder="y18n('searchPH')"
            >
            <i class="fas fa-search"></i>
          </div>
        </div>
      </div>
    </div>

    <div style="height: 2rem"></div>

    <div class="bg-grey">
      <div class="container">
        <div class="row">
          <div class="col">
            <accordion :data="search(sort(filter(courses)))">
              <div slot="header">
                <div class="d-flex">
                  <div style="flex-basis: 25%;"></div>
                  <a
                    href
                    class="w-50 pt-3 pb-3"
                    @click.prevent="sortByName"
                  >
                    <i :class="nameSortIcon"></i>
                    <span class="d-none d-sm-inline">{{ y18n('mycourses.sortByName') }}</span>
                  </a>
                  <a
                    href
                    class="w-25 text-right pt-3 pb-3"
                    @click.prevent="sortByDate"
                  >
                    <i :class="dateSortIcon"></i>
                    <span class="d-none d-sm-inline">{{ y18n('mycourses.sortByDate') }}</span>
                  </a>
                </div>
              </div>

              <div
                slot="item"
                slot-scope="data"
              >
                <div class="d-flex">
                  <!-- left meta infos -->
                  <div class="w-25 pr-5">
                    <h3 class="d-flex justify-content-start h-25">
                      <span
                        v-if="data.item.locked"
                        class="mr-2"
                      >
                        <i class="fas fa-lock"></i>
                      </span>
                      <span
                        v-if="data.item.endDate"
                        class="mr-2"
                      >
                        <i class="fas fa-stopwatch"></i>
                      </span>
                    </h3>
                    <span v-if="data.item.endDate">
                      {{ dateShort(data.item.startDate) }} &mdash;
                      {{ dateShort(data.item.endDate) }}
                    </span>
                  </div>

                  <!-- course link -->
                  <router-link
                    :to="{ name: 'course', params: { id: data.item.name}}"
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
                    <span>{{ dateLocalized(data.item.courseId) }}</span>
                  </div>
                </div>
              </div>
            </accordion>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import Accordion from '@/components/helpers/accordion.vue'

import http from 'axios'
import { locale } from '@/mixins'
import utils from '../../../mixins/general/helpers.ts'
import be from '@/backend-url'

export default {
  name: 'Mycourses',

  components: {
    Accordion
  },

  mixins: [
    locale
  ],

  beforeRouteEnter (to, from, next) {
    next()
  },

  data () {
    return {
      cats: [],
      courses: [],

      sortBy: 'nameDESC',
      searchStr: ''
    }
  },

  computed: {
    ...mapState(['profile', 'note', 'auth']),
    ...mapGetters(['courseList']),

    /**
     * avatarURL: return url of profile avatar
     *
     * Author: core
     *
     * Last Updated: March 21, 2021
     */
    avatarURL () {
      return `${be()}/storage/img/download/${this.profile.avatar}`
    },

    /**
     * nameSortIcon: return icon css class depending on how names are sorted
     *
     * Author: core
     *
     * Last Updated: unknown
     */
    nameSortIcon () {
      return {
        'fas fa-sort-up': this.sortBy === 'nameASC',
        'fas fa-sort-down': this.sortBy === 'nameDESC',
        'fas fa-sort': /date/.test(this.sortBy)
      }
    },

    /**
     * dateSortIcon: return icon css class depending on how dates are sorted
     *
     * Author: core
     *
     * Last Updated: unknown
     */
    dateSortIcon () {
      return {
        'fas fa-sort-up': this.sortBy === 'dateASC',
        'fas fa-sort-down': this.sortBy === 'dateDESC',
        'fas fa-sort': /name/.test(this.sortBy)
      }
    }
  },

  mounted () {
    document.querySelector('#tab-focus').focus()
  },

  created () {
    this.fetchCourses()
  },

  methods: {
    ...utils,

    /**
     * Function search: filter courses with given input
     *
     * Author: core
     *
     * Last Updated: unknown
     *
     * @param {array} courses course array
     * @returns {array} filtered course list
     */
    search (courses) {
      const { searchStr } = this
      if (searchStr === '') return courses
      return courses.filter(course => {
        const re = new RegExp(searchStr, 'i')
        return re.test(course.name)
      })
    },

    /**
     * Function filter: filter courses by category
     *
     * Author: core
     *
     * Last Updated: unknown
     *
     * @param {array} courses course array
     * @returns {array} filtered course list
     */
    filter (courses) {
      if (courses.length === 0) return courses
      const activeCats = this.cats.filter(c => c.on).map(c => c.label)
      if (activeCats.length === 0) return courses
      return courses.filter(c => activeCats.includes(c.category))
    },

    /**
     * Function sort: sort courses
     *
     * Author: core
     *
     * Last Updated: unknown
     *
     * @param {array} _courses course array
     * @returns {array} sorted course array
     */
    sort (_courses) {
      const courses = [..._courses]
      const by = this.sortBy
      if (by === 'nameASC') {
        return courses.sort((c1, c2) => c1.name < c2.name)
      }
      if (by === 'nameDESC') {
        return courses.sort((c1, c2) => c1.name >= c2.name)
      }
      if (by === 'dateASC') {
        return courses.sort((c1, c2) => c1.createDate < c2.createDate)
      }
      if (by === 'dateDESC') {
        return courses.sort((c1, c2) => c1.createDate >= c2.createDate)
      }
      return courses
    },

    /**
     * Function sortByName: sort courses by name
     *
     * Author: core
     *
     * Last Updated: unknown
     */
    sortByName () {
      if (this.sortBy === 'nameASC') {
        this.sortBy = 'nameDESC'
        return
      }
      if (this.sortBy === 'nameDESC') {
        this.sortBy = 'nameASC'
        return
      }
      this.sortBy = 'nameDESC'
    },

    /**
     * Function sortByDate: sort courses by date
     *
     * Author: core
     *
     * Last Updated: unknown
     */
    sortByDate () {
      if (this.sortBy === 'dateASC') {
        this.sortBy = 'dateDESC'
        return
      }
      if (this.sortBy === 'dateDESC') {
        this.sortBy = 'dateASC'
        return
      }
      this.sortBy = 'dateDESC'
    },

    /**
     * Function fetchCourses: fetch courses from database,
     *  create categories
     *
     * Author: core
     *
     * Last Updated: unknown
     */
    fetchCourses () {
      const ctx = this
      this.$store.commit('setBusy', true)
      this.$store.commit('clearMyCourse')
      /*
      * fetch courses */
      http
        .get(`accounts/${ctx.authentication.userId}/mycourses?filter[include]=author`)
        .then(function ({ data }) {
          ctx.courses = data
          /*
          * create filters from categories */
          const filters = []
          const cats = ctx.courses.map(course => course.category)
          cats.forEach(cat => {
            if (filters.indexOf(cat) === -1) filters.push(cat)
          })
          ctx.cats = filters.map(f => ({ label: f, on: false }))
        })
        .catch(err => console.error(err))
        .then(() => ctx.$store.commit('setBusy', false))
    }
  }
}
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

.search-bar input {
  outline-offset: 1rem !important;
}

.avatar {
  width: 7rem;
  height: 7rem;
  border: 2px solid #eee;
  background-color: #eee;
}
</style>

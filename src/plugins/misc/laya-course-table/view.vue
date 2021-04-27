<!--
Filename: view.vue
Use: Show Course Table
Creator: core
Date: unknown
Dependencies: @/i18n/plugins/misc/laya-course-table
-->

<template>
  <div class="laya-course-table">

    <h3 v-show="filtered.length === 0" class="text-center text-muted">
      {{ i18n.noCourses }}
    </h3>

    <div v-for="(courses, category) in categories" :key="category"
         class="category">
      <div class="d-flex justify-content-between align-item-center header"
           v-b-toggle="category"
           tabindex="0"
           @keyup.enter="toggle(category)">
        <h4><u>{{category}}</u></h4>
        <span>{{courses.length}} {{courses.length == 1 ? 'Kurs':'Kurse'}}</span>
      </div>

      <!-- courses -->
      <b-collapse :id="category" v-model="collapsed[category]">

        <div v-for="(course,i) in courses"
             class="d-flex px-2 py-3"
             :key="category+'-'+course.name+'-'+i">

          <!-- left meta infos -->
          <div class="w-25 pr-5 pl-1">
            <!--
              <h4>
              <i v-show="course.locked" class="fas fa-lock"></i>
              <i v-show="course.endDate" class="fas fa-stopwatch"></i>
              </h4>
              <span v-show="course.endDate">
              {{ shortDate(data.item.startDate) }} &mdash;
              {{ shortDate(data.item.endDate) }}
              </span>
            -->
          </div>

          <!-- course link -->
          <router-link
            :to="{name: 'course-detail-view', params: {name: course.name, step: '1'}}"
            class="w-50 pl-xs-1 pl-md-0 course-link">
            <h5><u><b>{{ course.name }}</b></u></h5>
          </router-link>

          <!-- right meta infos -->
          <div class="w-25 d-inline-flex flex-column justify-content-between align-items-end">
          </div>
        </div>
      </b-collapse>
    </div>
  </div>
</template>

<script>
import * as i18n from '@/i18n/plugins/misc/laya-course-table'

export default {
  name: 'laya-course-table',
  data() {
    return {
      cats: {},
      collapsed: {}
    };
  },
  props: {
    courses: Array,
    filter: String,
  },
  computed: {

    /**
     * filtered: Filter Course list 
     * 
     * Author: Core
     * 
     * Last Updated: unknown
     */
    filtered() {
      if (!this.filter) return this.courses;

      const filterByCourseName = new RegExp(this.filter, 'i')
      return this.courses.filter(course => filterByCourseName.test(course.name))
    },

    /**
     * categories: Return a List of Categories
     * 
     * Author: core
     * 
     * Last Updated: unknown
     */
    categories() {

      let cats = {}
      if (!this.filtered || this.filtered.length == 0)
        return cats

      this.filtered.forEach(course => {
        const {category} = course
        if (!cats[category])
          cats[category] = []
        cats[category].push(course)
      })
      return cats
    },
    
    /**
     * i18n: Load translation files depending on user language
     * 
     * Author: cmc
     * 
     * Last updated: March 20, 2021
     * 
     */
    i18n() {
      return i18n[this.$store.state.profile.lang]
    }
  },
  methods: {

    /**
     * function collapse: supposedly collapse certain categories
     * 
     * Author: core
     * 
     * Last Updated: unknown
     */
    collapse(category) {
      this.collapsed[category] = !this.collapsed[category]
    }
  }
}
</script>

<style scoped>
*:focus {
  outline-offset: 5px;
  outline: 2px dashed deepskyblue;
}

.course-link {
  text-decoration: none;
  color: black;
}

._category:last-child > .header.collapsed {
  border-bottom: none;
}

.header.collapsed {
  border-top: 2px solid black;
  border-bottom: 2px solid black;
}

.header {
  padding: 1rem 0rem;
  cursor: pointer;
  border-top: 2px solid black;
  border-bottom: 2px dashed black;
}

.category {
  position: sticky;
  top: 3rem;
}
</style>

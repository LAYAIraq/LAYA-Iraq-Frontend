<template>
  <div class="laya-course-table">

    <h3 v-show="!filtered" class="text-center text-muted">
      Keine Kurse gefunden
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
            Left Column
          </div>

          <!-- course link -->
          <router-link :to="{name: 'course-detail-view', params: {id: course.name}}"
            class="w-50 pl-xs-1 pl-md-0 course-link">
            <h5><u><b>{{ course.name }}</b></u></h5>
          </router-link>

          <!-- right meta infos -->
          <div class="w-25 d-inline-flex flex-column justify-content-between align-items-end">
            Right Column
          </div>
        </div>
      </b-collapse>
    </div>
  </div>
</template>

<script>
import bCollapse from "bootstrap-vue/es/components/collapse/collapse"
import vBToggle from "bootstrap-vue/es/directives/toggle/toggle"

export default {
  name: "courses-view",
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
    filtered: function() {
      if (!this.filter) return this.courses;

      const filterByCourseName = new RegExp(this.filter, "i");
      return this.courses.filter(course => filterByCourseName.test(course.name))
    },
    categories: function() {

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
    }
  },
  methods: {
    collapse: function(category) {
      this.collapsed[category] = !this.collapsed[category];
    },
  },
  components: {
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

.course-link {
  text-decoration: none;
  color: black;
}

.category:last-child > .header.collapsed {
  border-bottom: none;
}

.header.collapsed {
  border-bottom: 2px solid black;
}

.header {
  padding: 1rem 0rem;
  cursor: pointer;
  border-bottom: 2px dashed black;
}

.category {
  position: sticky;
  top: 3rem;
}
</style>

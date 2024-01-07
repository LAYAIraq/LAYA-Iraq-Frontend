<!--
  Filename: course-list.vue
  Use: Wrap course list and adding courses
  Creator: core
  Since: v1.0.0
-->

<template>
  <div>
    <div class="container">
      <div class="row">
        <div class="col">
          <course-grade-details></course-grade-details>
        </div> <!-- col -->
      </div> <!-- row -->
    </div> <!-- container -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { locale } from '@/mixins'
// import http from 'axios'
import CourseGradeDetails from '@/components/course/course-grade/course-grade-details.vue'

export default {
  name: 'CourseGrade',

  components: {
    CourseGradeDetails // not lazily loaded b/c always visible
  },

  async created () {
    // console.log('liste!!!')
    // console.log(this)
    // console.log(this.$store.getters) // check for enrollement
    // console.log(await this.$store.dispatch('getCourseEnrollments', this.$store.getters.course.courseId))
  }
}
</script>

<style scoped>
*:focus {
  outline-offset: 5px;
  outline: 2px dashed deepskyblue;
}

.search-bar {
  width: 100%;
  padding: 5px 10px;
  border: 2px solid black;
}
.search-bar input {
  width: 90%;
  font-size: 120%;
  border: none;
}
.search-bar .icon {
  float: right;
  margin: 0.4em;
}

#search-bar:focus {
  outline-offset: 1rem;
}
</style>

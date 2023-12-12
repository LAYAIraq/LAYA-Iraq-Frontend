<!--
  Filename: course-list.vue
  Use: Wrap course list and adding courses
  Creator: core
  Since: v1.0.0
-->

<template>
  <div>
    <p>Ttsd</p>
  </div>
</template>

<script>

export default {
  name: 'CourseGrade',

  async created () {
    console.log('liste!!!')
    console.log(this)
    console.log(this.$store.getters) // check for enrollement
    console.log(await this.$store.dispatch('getCourseEnrollments', this.$store.getters.course.courseId))
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

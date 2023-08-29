<template>
  <div>
    <h2>Hello World</h2>
    <course-list-details :filter="courseNames"></course-list-details>
  </div>
</template>

<script>
import CourseListDetails from '@/components/course/course-list/course-list-details.vue'

export default {
  name: 'filtered-course-list',
  components: { CourseListDetails },
  data () {
    return {
      courseNames: ''
    }
  },
  created () {
    this.getAllMyCourses()
  },
  methods: {
    getAllMyCourses () {
      this.$store.dispatch('enrollmentsUserFetch').then(data => {
        this.$store.dispatch('courseGetById', data.data.sublist[0].courseId).then(course => {
          this.courseNames += course.data.name
        })
      })
    }
  }
}
</script>

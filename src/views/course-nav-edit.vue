<template>
  <div
    id="course-nav-edit"
    class="container"
  >
    <div class="row">
      <course-nav-chapter
        :chapter="courseNavEdit"
        :chapter-name="courseNavEdit.chapterName"
        class="col"
      />
      <div class="col">
        <h3>Data</h3>
        <pre>{{ valueString }}</pre>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { courseChapterTransformToDraggable } from '@/misc/course-navigation-utils'
import CourseNavChapter from './course-nav-edit/course-nav-chapter.vue'
export default {
  name: 'CourseNavigationEditor',
  components: {
    CourseNavChapter
  },
  data () {
    return {
      courseNavEdit: []
    }
  },
  computed: {
    ...mapGetters(['courseNav']),
    valueString () {
      return JSON.stringify(this.courseNavEdit.children, null, 2)
    }
  },
  created () {
    this.courseNavEdit = courseChapterTransformToDraggable(this.courseNav.structure)
  }
}
</script>
<style scoped>
</style>

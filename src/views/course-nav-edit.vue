<template>
  <div
    id="course-nav-edit"
    class="container"
  >
    <div class="row">
      <div class="col">
        <h3>Course Navigation</h3>
      </div>
    </div>
    <div class="row nav-editor-main bg-light">
      <course-nav-chapter
        :chapter="courseNavEdit"
        :chapter-name="courseNavEdit.chapterName"
        class="w-100"
      />
    </div>
    <div v-if="showRawData" class="col">
      <h3>Data</h3>
      <pre>{{ valueString }}</pre>
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
      courseNavEdit: [],
      showRawData: false
    }
  },
  computed: {
    ...mapGetters(['courseNav']),
    valueString () {
      return JSON.stringify(this.courseNavEdit.children, null, 1)
    }
  },
  created () {
    this.courseNavEdit = courseChapterTransformToDraggable(this.courseNav.structure)
  }
}
</script>
<style scoped>
.nav-editor-main {
  min-height: 300px;
}
</style>

<template>
  <div id="course-nav-edit">
    <div id="chapter-editor">
      <course-nav-chapter
        v-for="chapter in courseNavEdit.children"
        :key="chapter.id"
        :chapter="chapter"
        :chapter-name="chapter.id"
      ></course-nav-chapter>
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
    ...mapGetters(['courseNav'])
  },
  created () {
    this.courseNavEdit = courseChapterTransformToDraggable(this.courseNav.structure)
  }
}
</script>
<style scoped>
</style>

<template>
  <div
    id="course-nav-edit"
    class="container"
  >
    <div
      id="nav-editor-header"
      class="row"
    >
      <div class="col">
        <h3>Course Navigation</h3>
      </div>
    </div>
    <div
      id="nav-editor-main"
      class="row bg-light"
    >
      <course-nav-chapter
        :chapter="courseNavEdit"
        :chapter-name="courseNavEdit.chapterName"
        :main="true"
        @propagatePropertyChange="changeProperty"
      />
    </div>
    <div
      id="nav-editor-footer"
      class="row"
    >
      <button @click="addChapter">
        Add chapter
      </button>
    </div>
    <div
      v-if="showRawData"
      id="nav-editor-data"
      class="col"
    >
      <h3>Data</h3>
      <pre>{{ valueString }}</pre>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { courseChapterTransformToDraggable } from '@/misc/course-navigation-utils'
import { CourseNavChapter } from '@/views/course-nav-edit-tools'
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
  },
  methods: {
    /**
     * @function Add chapter object to `courseNavEdit` data prop
     * @author cmc
     */
    addChapter () {
      this.courseNavEdit.children.push({
        chapterName: 'New Chapter',
        isChapter: true,
        children: []
      })
    },

    /**
     * @function change chapter name of referenced chapter object
     * @author cmc
     * @param chapter reference to object in `courseNavEdit`
     * @param property property to change
     * @param value new value for property
     */
    changeProperty (chapter, property, value) {
      chapter[property] = value
    }
  }
}
</script>
<style scoped>

</style>

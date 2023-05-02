<template>
  <div
    id="course-nav-edit"
    class="container"
  >
    <div
      v-show="!preview"
      id="navigation-editor"
    >
      <div
        id="nav-editor-header"
        class="row"
      >
        <div class="col">
          <h3>{{ y18n('courseNavEdit.title') }}</h3>
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
          @preview="previewSet"
          @propagatePropertyChange="changeProperty"
        />
      </div>
      <div
        id="nav-editor-footer"
        class="row"
      >
        <button @click="addChapter">
          {{ y18n('courseNavEdit.chapterAdd') }}
        </button>
      </div>
    </div>
    <div
      v-if="preview"
      id="block-preview"
    >
      <div class="row">
        <div class="col-4">
          <button
            class="btn-lg btn-primary"
            @click="previewClear"
          >
            {{ y18n('courseNavEdit.previewClear') }}
          </button>
        </div>
        <h3 class="col">
          {{ y18n('courseNavEdit.previewTitle') }}
        </h3>
      </div>
      <div class="row">
        <div class="col">
          <component
            :is="previewComponent"
            :view-data="previewData"
            :edit-preview="true"
          />
        </div>
      </div>
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
import { courseChapterTransformToDraggable } from '@/mixins/general/course-navigation'
import { locale } from '@/mixins'
import CourseNavChapter from './course-nav-chapter.vue'
export default {
  name: 'CourseNavigationEditor',
  components: {
    CourseNavChapter
  },
  mixins: [locale],
  data () {
    return {
      courseNavEdit: [],
      preview: false,
      previewId: null,
      showRawData: false
    }
  },
  computed: {
    ...mapGetters(['courseContent', 'courseNav']),
    previewComponent () {
      const comps = { ...this.$laya.blocks, ...this.$laya.assessments, ...this.$laya.organization }
      console.log('comps', comps)
      return comps[this.previewData.name].components.view
    },
    previewData () {
      return this.courseContent[this.previewId]
    },
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
        chapterName: this.y18n('courseNavEdit.chapterNew'),
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
      if (property !== 'followingContent') { // followingContent emit has no data
        chapter[property] = value
      }
    },
    /**
     * @function set preview variables to default
     * @author cmc
     */
    previewClear () {
      this.preview = false
      this.previewId = null
    },
    /**
     * @function set preview boolean true, previewId to param value
     * @author cmc
     * @param pid id of content to preview
     */
    previewSet (pid) {
      this.preview = true
      this.previewId = pid
    }
  }
}
</script>
<style scoped>

</style>

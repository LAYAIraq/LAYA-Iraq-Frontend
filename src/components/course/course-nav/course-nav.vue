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
          :course-end="courseEnd ? courseEnd : ''"
          :main="true"
          @chapter-coherent="coherentChaptersUpdate"
          @deleted-chapter="deleteChapter"
          @duplicate-chapters="chaptersDuplicateUpdate"
          @preview="previewSet"
          @propagate-property-change="changeProperty"
        />
      </div>
      <div
        id="nav-editor-footer"
        class="row"
      >
        <button @click="addChapter">
          {{ y18n('courseNavEdit.chapterAdd') }}
        </button>
        <button @click="integrityCheck">
          {{ y18n('courseNavEdit.save') }}
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
    <b-modal
      id="nav-integrity-compromised"
      :title="y18n('courseNavEdit.integrityCheckTitle')"
      header-bg-variant="warning"
      static
      centered
      :ok-title="y18n('courseNavEdit.integrityCheckOk')"
      ok-variant="danger"
      @ok="navigationSave"
      >
      <p>{{ y18n('courseNavEdit.integrityCheckMessage')}}</p>
      <ul>
        <li v-if="chapterNamesDuplicate">
          {{ y18n('courseNavEdit.integrityCheckChapterDuplicate') }}
        </li>
        <li v-if="chaptersIncoherent">
          {{ y18n('courseNavEdit.integrityCheckChapterIntegrity') }}
        </li>
      </ul>
      <p>{{ y18n('courseNavEdit.integrityCheckMessageCTA')}}</p>
    </b-modal>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { locale } from '@/mixins'
import CourseNavChapter from './course-nav-chapter.vue'
import { deepCopy, stripKey } from '@/mixins/general/helpers'
import { contentIdGet, slugify } from '@/mixins/general/course-structure'

export default {
  name: 'CourseNavigationEditor',
  components: {
    CourseNavChapter
  },
  mixins: [locale],
  data () {
    return {
      chaptersDuplicate: {},
      chapterNamesDuplicate: false,
      chaptersCoherent: {},
      chaptersIncoherent: false,
      courseNavEdit: [],
      edited: false,
      preview: false,
      previewId: null,
      showRawData: false
    }
  },
  computed: {
    ...mapGetters(['courseChapters', 'courseContent', 'courseNav']),
    courseEnd () {
      return contentIdGet(this.courseNavEdit.children, 'last')
    },
    previewComponent () {
      const comps = { ...this.$laya.blocks, ...this.$laya.assessments, ...this.$laya.organization }
      console.log('comps', comps)
      return this.previewData ? comps[this.previewData.name].components.view : null
    },
    previewData () {
      return this.courseContent[this.previewId]
    },
    valueString () {
      return JSON.stringify(this.courseNavEdit.children, null, 1)
    }
  },
  watch: { // TODO fix check for integrity
    chaptersCoherent: {
      handler () {
        this.chaptersIncoherent = Object.values(this.chaptersCoherent).some(val => val === false)
      },
      deep: true
    },
    chaptersDuplicate () {
      this.chapterNamesDuplicate = Object.values(this.chaptersDuplicate).some(val => val === true)
    }
  },
  created () {
    this.courseNavEdit = { isChapter: true, children: deepCopy(this.courseChapters) }
  },
  beforeDestroy () {
    // if (this.edited) {
    //
    // }
  },
  methods: {
    /**
     * @function Add chapter object to `courseNavEdit` data prop
     * @author cmc
     */
    addChapter () {
      this.courseNavEdit.children.push({
        chapterName: this.y18n('courseNavEdit.chapterNew'),
        slug: slugify(this.y18n('courseNavEdit.chapterNew')),
        isChapter: true,
        children: []
      })
    },
    /**
     * @description update chapter map if chapter was deleted
     * @param id deleted chapter's id
     */
    deleteChapter (id) {
      this.chaptersCoherent = stripKey(id, this.chaptersCoherent)
      this.chaptersDuplicate = stripKey(id, this.chaptersDuplicate)
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
      if (property === 'chapterName') {
        chapter.slug = slugify(value)
      }
      this.edited = true
    },
    chaptersDuplicateUpdate (id, val) {
      console.log('duplicate keys in', id)
      this.chaptersDuplicate[id] = val
    },
    coherentChaptersUpdate (id, val) {
      console.log(id, val)
      this.chaptersCoherent[id] = val
    },
    integrityCheck () {
      if (this.chapterNamesDuplicate || this.chaptersIncoherent) {
        this.navigationSave()
      } else {
        this.$bvModal.show('nav-integrity-compromised')
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
    },

    navigationSave () {
      this.$store.commit('courseChaptersSet', deepCopy(this.courseNavEdit.children))
      this.edited = false
      this.$store.commit('courseRoutesUpdate')
    }
  }
}
</script>
<style scoped>

</style>

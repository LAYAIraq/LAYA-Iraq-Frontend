<!--
  @file wrap course navigation editor
  @author cmc
  @since v1.3.0
-->
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
        <h3>{{ y18n('courseNavEdit.title') }}</h3>
        <i
          id="questionmark"
          v-b-tooltip.left
          class="fas fa-question-circle"
          :class="langIsAr? 'mr-auto' : 'ml-auto'"
          :title="y18n('showTip')"
          aria-labelledby="tooltipText"
          aria-live="polite"
          @click="toggleTip"
        ></i>
      </div>

      <b-jumbotron
        v-if="tooltipOn"
        id="tooltipText"
        :header="y18n('courseNavEdit.title')"
        :lead="y18n('tipHeadline')"
      >
        <hr class="my-4">
        <p>{{ y18n('courseNavEdit.helpText') }}</p>
        <p>{{ y18n('courseNavEdit.helpText2') }}</p>
        <p>{{ y18n('courseNavEdit.helpText3') }}</p>
        <p>{{ y18n('courseNavEdit.helpText4') }}</p>
        <p>{{ y18n('courseNavEdit.helpText5') }}</p>
      </b-jumbotron>

      <div
        id="nav-editor-main"
        class="row bg-light"
      >
        <course-nav-chapter
          :chapter="courseNavEdit"
          :chapter-name="courseNavEdit.chapterName"
          :course-end="courseEnd ? courseEnd : ''"
          :main="true"
          @chapter-coherent="chaptersCoherentUpdate"
          @deleted-chapter="chapterDelete"
          @duplicate-chapters="chaptersDuplicateUpdate"
          @edited="edited = true"
          @preview="previewSet"
          @propagate-property-change="propertyChange"
        />
      </div>
      <div
        id="nav-editor-footer"
        class="row"
      >
        <b-button
          secondary
          variant="success"
          @click="chapterAdd"
        >
          {{ y18n('courseNavEdit.chapterAdd') }}
        </b-button>
        <b-button
          variant="success"
          @click="integrityCheck"
        >
          {{ y18n('courseNavEdit.save') }}
        </b-button>
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
      v-if="messageShow"
      id="nav-editor-warning-messages"
      class="col mt-3"
    >
      <h3>{{ y18n('courseNavEdit.warningMessagesTitle') }}</h3>
      <p v-if="edited">
        {{ y18n('courseNavEdit.warningEdited') }}
      </p>
      <p v-if="chaptersIncoherent">
        {{ y18n('courseNavEdit.integrityCheckChapterIntegrity') }}
      </p>
      <p v-if="chapterNamesDuplicate">
        {{ y18n('courseNavEdit.integrityCheckChapterDuplicate') }}
      </p>
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
      <p>{{ y18n('courseNavEdit.integrityCheckMessage') }}</p>
      <ul>
        <li v-if="chapterNamesDuplicate">
          {{ y18n('courseNavEdit.integrityCheckChapterDuplicate') }}
        </li>
        <li v-if="chaptersIncoherent">
          {{ y18n('courseNavEdit.integrityCheckChapterIntegrity') }}
        </li>
      </ul>
      <p>{{ y18n('courseNavEdit.integrityCheckMessageCTA') }}</p>
    </b-modal>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { v4 as uuidv4 } from 'uuid'
import { locale, tooltipIcon } from '@/mixins'
import CourseNavChapter from './course-nav-chapter.vue'
import { deepCopy, stripKey } from '@/mixins/general/helpers'
import { courseContentIdGet } from '@/mixins/general/course-structure'
import { slugify } from '@/mixins/general/slugs'

export default {
  name: 'CourseNavigationEditor',
  components: {
    CourseNavChapter
  },
  mixins: [locale, tooltipIcon],
  beforeRouteLeave (to, from, next) {
    if (to.name === 'content-follow-edit') {
      this.$store.commit('courseChaptersSet', deepCopy(this.courseNavEdit.children))
    }
    next()
  },
  data () {
    return {
      chaptersDuplicate: {},
      chapterNamesDuplicate: false,
      chaptersCoherent: {},
      chaptersIncoherent: false,
      courseNavEdit: [],
      edited: false,
      preview: false,
      previewId: null
    }
  },
  computed: {
    ...mapGetters(['courseChapters', 'courseContent']),
    courseEnd () {
      return courseContentIdGet(this.courseNavEdit.children, 'last')
    },
    messageShow () {
      return this.edited || this.chaptersIncoherent || this.chapterNamesDuplicate
    },
    previewComponent () {
      const comps = { ...this.$laya.blocks, ...this.$laya.assessments, ...this.$laya.organization }
      return this.previewData ? comps[this.previewData.name].components.view : null
    },
    previewData () {
      return this.courseContent[this.previewId]
    }
  },
  watch: {
    chaptersCoherent: {
      handler () {
        this.chaptersIncoherent = Object.values(this.chaptersCoherent).some(val => val === false)
      },
      deep: true
    },
    chaptersDuplicate: {
      handler () {
        this.chapterNamesDuplicate = Object.values(this.chaptersDuplicate).some(val => val === true)
      },
      deep: true
    },
    courseChapters: {
      handler () {
        this.courseNavEdit = { isChapter: true, children: deepCopy(this.courseChapters) }
      },
      deep: true
    }
  },
  created () {
    this.courseNavEdit = this.courseChapters.length === 0 // when chapters empty, create them
      ? this.chaptersCreate()
      : { isChapter: true, children: deepCopy(this.courseChapters) }
  },

  methods: {
    /**
     * @function Add chapter object to `courseNavEdit` data prop
     * @author cmc
     */
    chapterAdd () {
      this.courseNavEdit.children.push({
        chapterName: this.y18n('courseNavEdit.chapterNew'),
        slug: slugify(this.y18n('courseNavEdit.chapterNew')),
        isChapter: true,
        id: uuidv4(),
        children: []
      })
    },
    /**
     * @description update chapter map if chapter was deleted
     * @param id deleted chapter's id
     */
    chapterDelete (id) {
      this.chaptersCoherent = stripKey(id, this.chaptersCoherent)
      this.chaptersDuplicate = stripKey(id, this.chaptersDuplicate)
    },
    /**
     * @description create courseNav from course chapters if none in store
     * @returns {{children: *[], isChapter: boolean}} courseNav data structure
     */
    chaptersCreate () {
      const chapters = {
        isChapter: true,
        children: []
      }
      for (const block of Object.values(this.courseContent)) {
        chapters.children.push({
          id: block.id,
          slug: slugify(block.input.title.text),
          type: block.type,
          follow: null
        })
      }
      return chapters
    },
    /**
     * @description update chaptersCoherent to monitor integrity of sub-chapters
     * @param {string} id chapter id
     * @param {boolean} val chapter is coherent
     */
    chaptersCoherentUpdate (id, val) {
      if (id) { // avoid 'undefined' key in chaptersCoherent
        this.chaptersCoherent[id] = val
      }
    },
    /**
     * @description update chaptersDuplicate object to monitor chapter names
     * @param {string} id chapter id
     * @param {boolean} val chapter name duplicate on same level
     */
    chaptersDuplicateUpdate (id, val) {
      if (id) { // avoid 'undefined' key in chaptersCoherent
        this.chaptersDuplicate[id] = val
      }
    },
    /**
     * @description check if chapter names are duplicate or chapters incoherent, show modal if yes
     */
    integrityCheck () {
      if (!this.chapterNamesDuplicate && !this.chaptersIncoherent) {
        this.navigationSave()
      } else {
        this.$bvModal.show('nav-integrity-compromised')
      }
    },
    /**
     * @description write changed nav into store, emit saved event to trigger persistence
     * @author cmc
     * @since v1.3.0
     */
    navigationSave () {
      this.$store.commit('courseChaptersSet', deepCopy(this.courseNavEdit.children))
      this.$store.commit('courseRoutesUpdate')
      this.$emit('saved') // emit saved to trigger courseUpdate
      this.$nextTick(() => { this.edited = false }) // make sure 'edited' is reset after saving
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
    /**
     * @description change chapter name of referenced chapter object
     * @author cmc
     * @param chapter reference to object in `courseNavEdit`
     * @param property property to change
     * @param value new value for property
     */
    propertyChange (chapter, property, value) {
      if (property !== 'followingContent') { // followingContent emit has no data
        chapter[property] = value
      }
      if (property === 'chapterName') {
        chapter.slug = slugify(value)
      }
      this.edited = true
    }
  }
}
</script>
<style scoped>

</style>

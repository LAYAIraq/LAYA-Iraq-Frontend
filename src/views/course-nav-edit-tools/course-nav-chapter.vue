<template>
  <div class="chapter-item">
    <i
      v-if="chapter.isChapter && !main"
      class="fa fa-bars drag-handle"
    ></i>
    <course-nav-property-edit
      v-if="chapter.isChapter && !main"
      :callback="courseChapterNameConvertToId"
      :display="courseChapterIdConvertToName"
      :form-placeholder="y18n('courseNavEdit.chapterPlaceholder')"
      :property="chapterName"
      :class="{ 'border rounded border-danger': chapterNameDuplicate }"
      @changed="changeChapterName"
    />
    <draggable
      :list="chapter.children"
      :group="{ name: 'chapters' }"
      class="bg-white border rounded drag-area"
      :class="{'border-danger': !coherentItem}"
      handle=".drag-handle"
      @start="dragStart"
      @end="dragEnd"
    >
      <div
        v-for="(item, i) in chapter.children"
        :key="`${id}-${i}`"
        class="chapter-child"
      >
        <course-nav-chapter
          v-if="item.isChapter"
          :chapter="item"
          :chapter-name="item.chapterName"
          :chapter-name-duplicate="duplicateChapterNames.includes(i)"
          @propagatePropertyChange="propagatePropertyChange"
        />
        <course-nav-item
          v-else-if="!collapsed"
          :drag-bubble="!dragging && dragStartIndex === i"
          :drag-end="!dragging && dragEndIndex === i"
          :drag-start="dragging && dragStartIndex === i"
          :value="item"
          @propagatePropertyChange="propagatePropertyChange"
        />
      </div>
    </draggable>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import Draggable from 'vuedraggable'
import CourseNavChapter from '@/views/course-nav-edit-tools/course-nav-chapter.vue'
import CourseNavItem from '@/views/course-nav-edit-tools/course-nav-item.vue'
import CourseNavPropertyEdit from '@/views/course-nav-edit-tools/course-nav-property-edit.vue'
import { locale } from '@/mixins'
import { v4 as uuidv4 } from 'uuid'
import { courseChapterIdConvertToName, courseChapterNameConvertToId } from '@/misc/course-navigation-utils'

export default {
  name: 'CourseNavChapter',
  components: {
    Draggable,
    CourseNavChapter,
    CourseNavPropertyEdit,
    CourseNavItem
  },
  mixins: [locale],
  props: {
    chapter: {
      type: Object,
      required: true
    },
    chapterName: {
      type: String,
      // required: true
      default: () => 'chapterName'
    },
    chapterNameDuplicate: {
      type: Boolean,
      default: () => false
    },
    main: {
      type: Boolean,
      default: () => false
    }
  },
  data () {
    return {
      collapsed: false,
      id: '', // exists to make v-for keys unique,
      dragging: false,
      dragStartIndex: null,
      dragEndIndex: null
    }
  },
  computed: {
    ...mapGetters(['courseNav']),

    /**
     * @function check if all children are coherent, i.e. either all are chapters or all are items
     * @author cmc
     * @returns {Boolean} true if all children are coherent items
     */
    coherentItem () {
      const subChapters = this.chapter.children.reduce(
        (curVal, item) => curVal + (item.isChapter ? 1 : 0),
        0) // count the number of chapters in the children
      return subChapters === this.chapter.children.length
        ? (subChapters > 0 || !this.chapter.isChapter) // all children are chapters or it is an item
        : subChapters === 0 // all children are items
    },

    /**
     * @description return a list of indexes of children with duplicate chapter names
     * @author cmc
     * @return {number[]} list of duplicate chapterNames indexes
     */
    duplicateChapterNames () {
      const chapterNames = this.chapter.children.map(chapter => chapter.chapterName)
      const duplicates = []
      chapterNames.forEach((name, i) => { // check if name is in chapterNames, if yes, add to duplicates
        if (name) {
          chapterNames.forEach((name2, j) => {
            if (name === name2 && i !== j && !duplicates.includes(i)) {
              duplicates.push(i)
            }
          })
        }
      })
      return duplicates
    }
  },
  created () {
    this.id = uuidv4()
  },
  methods: {
    courseChapterNameConvertToId,
    courseChapterIdConvertToName,
    /**
     * @function propagate name change from `CourseNavChapterName` to parent
     * @author cmc
     * @param newName new name for `chapter` prop to propagate to parent
     */
    changeChapterName (newName) {
      this.$emit('propagatePropertyChange', this.chapter, 'chapterName', newName)
    },
    dragStart (event) {
      this.dragging = true
      this.dragStartIndex = event.oldIndex
    },
    dragEnd (event) {
      this.dragging = false
      this.dragEndIndex = event.newIndex
    },
    /**
     * @function propagate name change from child Component to parent
     * @author cmc
     * @param chapter reference to `chapter` object
     * @param property name of property to change
     * @param value new value for property to propagate to parent
     */
    propagatePropertyChange (chapter, property, value) {
      this.$emit('propagatePropertyChange', chapter, property, value)
    }
  }
}
</script>
<style>
.drag-area {
  border: 1px solid #ccc;
  border-radius: 4px;
  /*margin: .5em;*/
  padding: 0 0 0 .5em;
  min-height: 50px;
  min-width: 50px;
  float: end;
  width: 100%;
}
.chapter-item {
  display: flex;
  justify-content: center;
  align-items: center;
}
.chapter-item > .property-edit {
  min-width: 150px;

}
.chapter-item > div + div {
  margin-left: 1em;
}
.chapter-child {
  margin: .25em 0;
}
.drag-handle {
  cursor: grab;
  margin-right: .5em;
  display: inline-flex;
}

</style>

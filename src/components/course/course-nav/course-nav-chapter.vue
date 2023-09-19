<!--
  Filename: course-nav-chapter.vue
  Use: This component is used to display a chapter in the course navigation editor
  Author: cmc
  Since: v1.3.0
-->
<template>
  <div
    class="chapter-item"
    @blur="blockHighlightUnset"
    @mouseup="blockHighlightUnset"
  >
    <div
      v-if="!main && chapter.isChapter"
      class="chapter-name d-flex"
    >
      <i
        class="fa fa-bars drag-handle"
      ></i>
      <course-nav-property-edit
        :form-placeholder="y18n('courseNavEdit.chapterPlaceholder')"
        :property="chapterName"
        class="chapter-edit"
        :class="{ 'border rounded border-danger': chapterNameDuplicate }"
        @changed="propagatePropertyChange(chapter, 'chapterName', $event)"
        @state-changed="chapterNameChange = $event"
      />
      <b-button
        v-if="!chapterNameChange"
        v-b-tooltip.top
        class="chapter-delete-button"
        size="sm"
        variant="danger"
        :title="y18n('courseNavEdit.chapterDelete')"
        @click="chapterDelete"
      >
        <i class="fas fa-times"></i>
      </b-button>
    </div>
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
          :course-end="courseEnd"
          :following-content="item.follow"
          :highlighted-block="main? highlightId : highlightedBlock"
          @chapter-delete="chapterDeletedUpdate"
          @highlight="blockHighlight"
          @preview="pid => previewEmit(pid)"
          @propagate-property-change="propagatePropertyChange"
        />
        <course-nav-item
          v-else-if="!collapsed"
          :class="{ 'border-success': item.id === highlightId }"
          :course-end="courseEnd"
          :drag-bubble="[!dragging && dragStartIndex === i, childrenVisibility[item.id]]"
          :drag-end="[!dragging && dragEndIndex === i, childrenVisibility[item.id]]"
          :following-content="item.follow"
          :value="item"
          @highlight="blockHighlight"
          @visibility-change="childVisibilityChange"
          @propagate-property-change="propagatePropertyChange"
          @preview="pid => previewEmit(pid)"
        />
      </div>
    </draggable>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import Draggable from 'vuedraggable'
import CourseNavItem from '@/components/course/course-nav/course-nav-item.vue'
import CourseNavPropertyEdit from '@/components/course/course-nav/course-nav-property-edit.vue'
import { courseNavEmits, locale } from '@/mixins'
import { v4 as uuidv4 } from 'uuid'
import { chapterFollowSet } from '@/mixins/general/course-structure'
import { deepCopy } from '@/mixins/general/helpers'

export default {
  name: 'CourseNavChapter',
  components: {
    Draggable,
    CourseNavPropertyEdit,
    CourseNavItem
  },
  mixins: [courseNavEmits, locale],
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
    courseEnd: {
      type: String,
      required: true
    },
    followingContent: {
      type: String,
      default: () => null
    },
    highlightedBlock: {
      type: String,
      default: () => null
    },
    main: {
      type: Boolean,
      default: () => false
    }
  },
  data () {
    return {
      chapterNameChange: false,
      childrenVisibility: {},
      collapsed: false,
      id: uuidv4(), // exists to make v-for keys unique,
      dragging: false,
      dragStartIndex: null,
      dragEndIndex: null,
      highlightId: null
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
  watch: {
    chapter: {
      handler () {
        // console.log('chapter changed')
        if (this.main) {
          // console.log('changing following content....')
          this.followingContentSet()
        }
      },
      deep: true
    }
  },
  created () {
    this.chapter.children.forEach(child => { this.childrenVisibility[child.id] = false })
  },
  methods: {
    blockHighlight (id) {
      if (this.main) {
        this.highlightId = id
      } else {
        this.$emit('highlight', id)
      }
    },
    blockHighlightUnset () {
      if (this.main && this.highlightId) {
        this.highlightId = null
      }
    },
    /**
     * @description propagate removal of a chapter
     */
    chapterDelete () {
      this.$emit('chapter-delete', this.chapterName, deepCopy(this.chapter.children))
    },
    /**
     * @description remove chapter by name, adding their children to chapter, propagate changes
     * @param deletedChapterName name of deleted chapter
     * @param newChildren children of deleted chapter to be added to chapter
     */
    chapterDeletedUpdate (deletedChapterName, newChildren) {
      const deleteIndex = this.chapter.children.findIndex(e => e.chapterName === deletedChapterName)
      const children = deepCopy(this.chapter.children)
      const croppedChildren = []
      children.forEach((el, i) => { // using Array.slice() did not yield the correct result
        if (i !== deleteIndex) {
          croppedChildren.push(el)
        }
      })
      this.propagatePropertyChange(this.chapter, 'children', [...croppedChildren, ...newChildren])
    },
    /**
     * @function set visibility of child in childrenVisibility object
     * @author cmc
     * @param id id of child
     * @param visibility visibility of child
     */
    childVisibilityChange (id, visibility) {
      this.childrenVisibility[id] = visibility
    },
    /**
     * @function handle event when drag starts, setting dragStartIndex and dragging to true
     * @author cmc
     * @param event emitted event from draggable component
     */
    dragStart (event) {
      this.dragging = true
      this.dragStartIndex = event.oldIndex
    },
    /**
     * @function handle event when drag ends, setting dragEndIndex and calling followingContentSet if main element
     * @author cmc
     * @param event emitted event from draggable component
     */
    dragEnd (event) {
      this.dragging = false
      this.dragEndIndex = event.newIndex
    },
    /**
     * @function propagate property change from child Component to parent
     * @author cmc
     * @param chapter reference to `chapter` object
     * @param property name of property to change
     * @param value new value for property to propagate to parent
     */
    propagatePropertyChange (chapter, property, value) {
      this.$emit('propagate-property-change', chapter, property, value)
    },
    /**
     * @function set followingContent property of all items in the chapter
     * @author cmc
     */
    followingContentSet () {
      chapterFollowSet(this.chapter, null)
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
  float: inline-end;
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
.chapter-delete-button {
  margin-left: .5em;
  flex-shrink: 0;
}
.chapter-edit {
  flex-grow: 0;
  flex-shrink: 1;
  flex-basis: max-content
}
.chapter-name > .chapter-delete-button {
  visibility: hidden;
}
.chapter-name:hover > .chapter-delete-button {
  visibility: visible;
}
.drag-handle {
  cursor: grab;
  display: inline-block;
  margin-right: .5rem;
  margin-top: auto;
  margin-bottom: auto;
}

</style>

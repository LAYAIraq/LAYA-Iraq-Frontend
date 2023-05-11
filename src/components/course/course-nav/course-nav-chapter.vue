<!--
  Filename: course-nav-chapter.vue
  Use: This component is used to display a chapter in the course navigation editor
  Author: cmc
  Since: v1.3.0
-->
<template>
  <div class="chapter-item"
    @blur="blockHighlightUnset"
    @mouseup="blockHighlightUnset"
  >
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
      @changed="e => propagatePropertyChange(chapter, 'chapterName', e)"
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
          :following-content="firstContentId(chapter.children, i + 1)"
          :highlighted-block="main? highlightId : highlightedBlock"
          @highlight="blockHighlight"
          @preview="pid => previewEmit(pid)"
          @propagatePropertyChange="propagatePropertyChange"
        />
        <course-nav-item
          v-else-if="!collapsed"
          :class="{ 'border-success': item.id === highlightId }"
          :drag-bubble="[!dragging && dragStartIndex === i, childrenVisibility[item.id]]"
          :drag-end="[!dragging && dragEndIndex === i, childrenVisibility[item.id]]"
          :following-content="firstContentId(chapter.children, i + 1)"
          :value="item"
          @highlight="blockHighlight"
          @visibilityChange="childVisibilityChange"
          @propagatePropertyChange="propagatePropertyChange"
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
import { courseChapterIdConvertToName, courseChapterNameConvertToId } from '@/mixins/general/course-navigation'

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
      childrenVisibility: {},
      collapsed: false,
      id: '', // exists to make v-for keys unique,
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
        console.log('chapter changed')
        if (this.main && this.coherentItem) {
          console.log('changing following content....')
          this.followingContentSet()
        }
      },
      deep: true
    }
  },
  created () {
    this.id = uuidv4()
    this.chapter.children.forEach(child => { this.childrenVisibility[child.id] = false })
  },
  methods: {
    blockHighlight (id) {
      console.log(id)
      if (this.main) {
        this.highlightId = id
      } else {
        this.$emit('hightlight', id)
      }
    },
    blockHighlightUnset () {
      if (this.main && this.highlightId) {
        this.highlightId = null
      }
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
    courseChapterNameConvertToId,
    courseChapterIdConvertToName,
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
     * @function get the id of the first content of the chapter, recursively
     * @author cmc
     * @param chapter reference to `chapter` object
     * @param index index of the chapter to check
     * @return {string|null} id of the first content of the chapter, or null the index is out of bounds
     */
    firstContentId (chapter, index) {
      if (chapter && chapter[index]) {
        if (chapter[index].isChapter) {
          return this.firstContentId(chapter[index].children, 0)
        } else {
          return chapter[index].id
        }
      }
      return null
    },
    /**
     * @function propagate property change from child Component to parent
     * @author cmc
     * @param chapter reference to `chapter` object
     * @param property name of property to change
     * @param value new value for property to propagate to parent
     */
    propagatePropertyChange (chapter, property, value) {
      this.$emit('propagatePropertyChange', chapter, property, value)
    },
    /**
     * @function set followingContent property of all items in the chapter
     * @author cmc
     */
    followingContentSet () {
      const setFollow = (item, follow) => {
        if (item.type !== 'laya-dialog') {
          item.follow = follow
        }
      }
      /**
       * @function automaticFollow recursively sets the followingContent property of all but dialog items in the chapter
       * @param item reference to item to set followingContent for
       * @param followingItem reference to following item if exists
       * @param depth recursion depth
       */
      const automaticFollow = (item, followingItem, depth) => {
        if (item.isChapter) {
          item.children.forEach((child, i) => {
            const res = automaticFollow(child, item.children[i + 1] ?? null, depth + 1)
            if (res) { // if automaticFollow returns something, set followingContent to next block
              console.log('reach last element')
              console.log('recursion depth: ', depth)
              const nextInput = this.firstContentId(item.children[i + 1], 0)
              console.log('nextInput: ', nextInput)

              if (!nextInput) {
                if (depth !== 0) {
                  return item
                } else {
                  setFollow(item, null)
                  return null
                }
              } else {
                setFollow(item, nextInput)
                return null
              }
            }
          })
        } else { // set followingContent if exists
          if (followingItem) {
            setFollow(item, followingItem.id)
            return null
          } else {
            return item
          }
        }
      }
      const k = automaticFollow(this.chapter, null, 0) // TODO: nested follow of last elements still broken
      if (!k) {
        console.log('no return, all gucci')
      } else {
        console.log('something went wrong')
      }
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
.drag-handle {
  cursor: grab;
  margin-right: .5em;
  display: inline-flex;
}

</style>

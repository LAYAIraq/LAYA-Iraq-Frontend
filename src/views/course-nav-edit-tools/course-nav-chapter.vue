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
          :following-content="getFirstContentId(chapter.children,i + 1)"
          @propagatePropertyChange="propagatePropertyChange"
        />
        <course-nav-item
          v-else-if="!collapsed"
          :drag-bubble="[!dragging && dragStartIndex === i, childrenVisibility[item.id]]"
          :drag-end="[!dragging && dragEndIndex === i, childrenVisibility[item.id]]"
          :following-content="chapter.children[i + 1] ? chapter.children[i + 1].id : followingContent"
          :value="item"
          @visibilityChange="changeChildVisibility"
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
    followingContent: {
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
    this.chapter.children.forEach(child => { this.childrenVisibility[child.id] = false })
  },
  methods: {
    /**
     * @function set visibility of child in childrenVisibility object
     * @author cmc
     * @param id id of child
     * @param visibility visibility of child
     */
    changeChildVisibility (id, visibility) {
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
     * @function handle event when drag ends, setting dragEndIndex and calling setFollowingContent if main element
     * @author cmc
     * @param event emitted event from draggable component
     */
    dragEnd (event) {
      this.dragging = false
      this.dragEndIndex = event.newIndex
      if (this.main && this.coherentItem) { // if main element, set following content
        this.setFollowingContent()
      }
    },
    /**
     * @function get the id of the first content of the chapter, recursively
     * @author cmc
     * @param chapter reference to `chapter` object
     * @param index index of the chapter to check
     * @return {string|null} id of the first content of the chapter, or null the index is out of bounds
     */
    getFirstContentId (chapter, index) {
      if (chapter[index]) {
        if (chapter[index].isChapter) {
          return this.getFirstContentId(chapter[index].children, 0)
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
      if (this.main && property === 'followingContent') {
        this.setFollowingContent()
      } else {
        this.$emit('propagatePropertyChange', chapter, property, value)
      }
    },
    /**
     * @function set followingContent property of all items in the chapter
     * @author cmc
     */
    setFollowingContent () {
      /**
       * @function automaticFollow recursively sets the followingContent property of all but dialog items in the chapter
       * @param item reference to item to set followingContent for
       * @param followingItem reference to following item if exists
       */
      const automaticFollow = (item, followingItem) => {
        if (item.isChapter) {
          item.children.forEach((child, i) => {
            if (child.isChapter) { // recursive call if child is a chapter
              automaticFollow(child, item.children[i + 1])
            } else { // set followingContent if child is an item
              const hasFollow = this.getFirstContentId(item.children, i + 1)
              if (!hasFollow) { // no following content
                if (!followingItem && item.type !== 'laya-dialog') { // set follow to null if item is not a dialog
                  child.follow = null
                } else { // set follow to first content of followingItem
                  child.follow = this.getFirstContentId(followingItem.children, 0)
                }
              } else { // set follow to first following content
                child.follow = hasFollow
              }
            }
          })
        } else if (item.type !== 'laya-dialog') { // set followingContent if item is not a dialog
          item.follow = followingItem?.id ?? null
        }
      }
      this.chapter.children.forEach((child, i) => { // call automaticFollow for each child
        automaticFollow(child, this.chapter.children[i + 1] ?? null)
      })
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

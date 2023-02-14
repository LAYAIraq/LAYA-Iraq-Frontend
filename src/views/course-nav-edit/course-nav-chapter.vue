<template>
  <div class="chapter-item">
    <div
      v-if="chapter.isChapter && !main"
      class="m-1"
    >
      {{ chapterName }}
    </div>
    <draggable
      :list="chapter.children"
      :group="{ name: 'chapters' }"
      class="bg-white border rounded drag-area"
      :class="{'border-danger': !coherentItem}"
      @start="shrinkChapter"
      @end="unShrinkChapter"
    >
      <div
        v-for="(item, i) in chapter.children"
        :key="`${id}-${i}`"
        class="chapter-children"
      >
        <course-nav-chapter
          v-if="item.isChapter"
          :chapter="item"
          :chapter-name="item.chapterName"
        />
        <course-nav-item
          v-else-if="!collapsed"
          :value="item"
        />
      </div>
    </draggable>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import Draggable from 'vuedraggable'
import CourseNavChapter from '@/views/course-nav-edit/course-nav-chapter.vue'
import CourseNavItem from '@/views/course-nav-edit/course-nav-item.vue'
import { v4 as uuidv4 } from 'uuid'
export default {
  name: 'CourseNavChapter',
  components: {
    Draggable,
    CourseNavChapter,
    CourseNavItem
  },
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
    main: {
      type: Boolean,
      default: () => false
    }
  },
  data () {
    return {
      collapsed: false,
      id: '' // exists to make v-for keys unique
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
    }
  },
  created () {
    this.id = uuidv4()
  },
  methods: {
    shrinkChapter (event) {
      // TODO: shrink so bigger chapters fit into smaller ones
    },
    unShrinkChapter (event) {
      // TODO: unshrink
    }
  }
}
</script>
<style>
.drag-area {
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: .5em;
  margin: .5em;
  min-height: 50px;
  min-width: 50px;
  float: end;
  width: 100%;
}
.chapter-item {
  display: flex;
}
.chapter-children {
  display: flex;
}

</style>

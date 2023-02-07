<template>
  <draggable
    :list="chapter.children"
    class="drag-area"
  >
    <div
      v-for="(item, i) in chapter.children"
      :key="i"
    >
      <course-nav-item :value="item">
      </course-nav-item>
      <course-nav-chapter
        :chapter="item"
        :chapter-name="item.chapterName"
      />
    </div>
  </draggable>
</template>
<script>
import { mapGetters } from 'vuex'
import Draggable from 'vuedraggable'
import CourseNavChapter from '@/views/course-nav-edit/course-nav-chapter.vue'
import CourseNavItem from '@/views/course-nav-edit/course-nav-item.vue'
export default {
  name: 'CourseNavChapter',
  components: {
    Draggable,
    CourseNavChapter,
    CourseNavItem
  },
  props: {
    chapter: {
      type: {
        children: Array,
        chapterName: String,
        id: String
      },
      required: true
    },
    chapterName: {
      type: String,
      // required: true
      default: () => 'chapterName'
    }
  },
  computed: {
    ...mapGetters(['courseNav']),
    arrayizedChapter () {
      return this.chapter.children ?? [this.chapter]
    }
  }
}
</script>
<style scoped>
.drag-area {
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 8px;
  margin-bottom: 8px;
  min-height: 40px;
}
</style>

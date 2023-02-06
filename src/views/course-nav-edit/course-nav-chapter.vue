<template>
  <draggable
    :list="arrayizedChapter"
    :group="{ name: chapterName }"
  >
    <div v-if="chapter.children">
      IT IS A CHAPTER
      <course-nav-chapter
        v-for="item in chapter.children"
        :key="item.chapterName"
        :chapter="item"
        :chapter-name="item.chapterName"
      />
    </div>
    <div v-else>
      IT IS AN ITEM: {{ chapter.id }}
      <course-nav-item>
      </course-nav-item>
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
      type: Object,
      required: true
    },
    chapterName: {
      type: String,
      required: true
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

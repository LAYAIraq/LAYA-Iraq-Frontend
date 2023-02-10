<template>
  <div class="position-relative">
    <draggable
      :list="chapter.children"
      :group="{ name: 'chapters' }"
      class="drag-area"
    >
      <div
        v-for="(item, i) in chapter.children"
        :key="i"
        class="bg-white border rounded p-2 mb-2 chapter-info"
      >
        <course-nav-chapter
          :chapter="item"
          :chapter-name="item.chapterName"
        />
        <course-nav-item
          :value="item"
        >
        </course-nav-item>
      </div>
    </draggable>
  </div>

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
      // required: true
      default: () => 'chapterName'
    }
  },
  computed: {
    ...mapGetters(['courseNav']),
    arrayizedChapter () {
      return this.chapter.children ?? [this.chapter]
    }
  },
  methods: {
    logEvent (event) {
      console.log(event)
    }
  }
}
</script>
<style>
.drag-area {
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 8px;
  margin-bottom: 8px;
  min-height: 50px;
  float: end;
  width: 100%;
}
.chapter-info {
  margin-bottom: 8px;
  position: absolute;
  right: 0;
}

</style>

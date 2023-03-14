<template>
  <div>
    <div v-if="item.name === 'laya-dialog'">
      <ul id="follow-list">
        <draggable
          list="follow"
          tag="li"
        ></draggable>
      </ul>
    </div>
    <div v-else>
    </div>
  </div>
</template>
<script>
import Draggable from 'vuedraggable'
export default {
  name: 'CourseNavFollowSet',
  components: {
    Draggable
  },
  props: {
    follow: {
      type: [Number, String, Array],
      default: () => null
    },
    item: {
      type: Object,
      required: true
    }
  }
}
</script>

<template>
  <div class="d-block">
    <div v-if="item.name === 'laya-dialog'">
      <div
        v-if="followSet.length !== item.answers.length"
        id="incomplete-follow"
      >
        Add following content
        <suggesting-input></suggesting-input>
      </div>
      <ul id="follow-list">
        <draggable
          :list="followSet"
        >
          <li
            v-for="e in followSet"
            :key="e"
          ></li>
        </draggable>
      </ul>
    </div>
    <div
      v-else
      class="d-block"
    >
      {{ follow }}
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
  },
  data () {
    return {
    }
  },
  computed: {
    followSet: {
      get () {
        return (!this.follow || Array.isArray(this.follow))
          ? this.follow
          : [this.follow]
      },
      set (val) {
        console.log(val)
      }
    }
  },
  methods: {
  }
}
</script>

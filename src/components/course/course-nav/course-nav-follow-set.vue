<!--
  Filename: course-nav-follow-set.vue
  Use: This component is used to display the follow set of a course nav item.
  Author: cmc
  Since: v1.3.0
-->
<template>
  <div class="d-block">
    <div v-if="item.name === 'button-navigation'">
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
      <div v-if="follow"
       :title="y18n('courseNavEdit.followHighlight')"
       v-b-tooltip.top
       @mousedown="followHighlight"
      >
        {{ follow }}
      </div>
      <div v-else>

      </div>
    </div>
  </div>
</template>
<script>
import Draggable from 'vuedraggable'
import { locale } from '@/mixins'
export default {
  name: 'CourseNavFollowSet',
  components: {
    Draggable
  },
  mixins: [locale],
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
    followHighlight (e) {
      e.preventDefault()
      console.log(e.shiftKey)
      if (e.shiftKey) {
        this.$emit('highlight', this.follow)
        console.log(e.shiftKey)
      }
    }
  }
}
</script>

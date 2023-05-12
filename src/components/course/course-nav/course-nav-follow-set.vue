<!--
  Filename: course-nav-follow-set.vue
  Use: This component is used to display the follow set of a course nav item.
  Author: cmc
  Since: v1.3.0
-->
<template>
  <div class="d-block">
    <div>
      <div
        v-if="followSet && followSet.length === 1"
        v-b-tooltip.top
        :title="y18n('courseNavEdit.followHighlight')"
        @mousedown="followHighlight"
      >
        {{ follow }}
      </div>
      <div
        v-else
        id="incomplete-follow"
      >
        Add following content
        <suggesting-input
          :domain="courseContent"
          :keys="['title', 'name', 'id']"
          :nested-key="'text'"
          @select="followSet = $event"
        ></suggesting-input>
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
    </div>
  </div>
</template>
<script>
import Draggable from 'vuedraggable'
import SuggestingInput from '@/components/helpers/suggesting-input.vue'
import { locale } from '@/mixins'

export default {
  name: 'CourseNavFollowSet',
  components: {
    Draggable,
    SuggestingInput
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
    courseContent () {
      return this.$store.getters.courseContent
    },
    followSet: {
      get () {
        return (!this.follow || Array.isArray(this.follow))
          ? this.follow
          : [this.follow]
      },
      set (val) {
        console.log('followSet', val)
        this.$emit('followUpdate', [...this.follow, val])
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

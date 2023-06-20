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
        v-if="followSet && followSet.length === 1 && edit === false"
        v-b-tooltip.top
        :title="y18n('courseNavEdit.followHighlight')"
        class="d-flex follow-content"
        @click="edit = true"
        @mousedown="followHighlight"
      >
        <div>
          <p v-if="followSet.length === 1">
            {{ follow }}
          </p>
          <ul
            v-else
            id="follow-list"
          >
            <draggable
              :list="followSet"
            >
              <li
                v-for="e in followSet"
                :key="e"
              >
                {{ e }}
              </li>
            </draggable>
          </ul>
        </div>
        <i
          v-b-tooltip.top.ds500
          class="fas fa-edit"
          :class="langIsAr ? 'mr-auto' : 'ml-auto'"
          :title="y18n('courseWrapper.edit')"
        ></i>
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
          :previous-selection="follow"
          @tagSelected="followSet = $event; edit = false"
        ></suggesting-input>
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
      edit: false
    }
  },
  computed: {
    courseContent () {
      return this.$store.getters.courseContent
    },
    followSet: {
      get () {
        return this.follow
          ? Array.isArray(this.follow) // return array as is, turn string into array of length 1
            ? this.follow
            : [this.follow]
          : null
      },
      set (val) {
        this.$emit('follow-update', val) // TODO: what if there's more than one item?
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
<style>
.follow-content>i {
  display: none;
}
.follow-content:hover>i {
  display: inline-flex;
}
</style>

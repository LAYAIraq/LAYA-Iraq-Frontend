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
        v-if="followSet && followSet.length === followLength && edit === false"
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
          :tags-needed="followLength"
          @tags-selected="followSet = $event; edit = false"
        ></suggesting-input>
      </div>
    </div>
  </div>
</template>
<script>
import Draggable from 'vuedraggable'
import SuggestingInput from '@/components/helpers/suggesting-input.vue'
import { locale } from '@/mixins'
import { mapGetters } from 'vuex'

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
    ...mapGetters(['courseContent']),
    /**
     * @function return text of buttons if item is button navigation
     * @author cmc
     * @since v1.3.0
     * @returns {string[]} labels of buttons
     */
    buttonLabels () {
      return this.item.name === 'button-navigation'
        ? this.item.answers.map(el => el.text)
        : null
    },
    /**
     * @function return length of follow items needed (1 for everything but button navigation)
     * @author cmc
     * @since v1.3.0
     * @returns {number} amount of follow items for content block
     */
    followLength () {
      return this.item.name === 'button-navigation'
        ? this.item.answers.length
        : 1
    },
    /**
     * @function return follow set as array, set propagate change to follow set
     * @author cmc
     * @since v1.3.0
     */
    followSet: {
      get () {
        return this.follow
          ? Array.isArray(this.follow) // either array or string
            ? this.follow // return array as is
            : [this.follow] // return string as single item in array
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

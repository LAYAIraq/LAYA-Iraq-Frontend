<!--
  Filename: course-nav-item.vue
  Use: render a single item in the course navigation editor
  Author: cmc
  Since: v1.3.0
-->
<template>
  <div class="w-100 border rounded p-1">
    <!-- Item header -->
    <div
      :id="`item-header-${item.id}`"
      class="d-flex"
    >
      <div
        class="drag-handle"
        tabindex="0"
      >
        <i class="fas fa-bars"></i>
      </div>
      <div class="show-item-details">
        <i
          v-b-toggle="`item-body-${item.id}`"
          v-b-tooltip.top.ds500.hover
          class="fa drop-down-icon p-1"
          :class="{
            'fa-chevron-right': !langIsAr && collapsed,
            'fa-chevron-left': langIsAr && collapsed,
            'fa-chevron-down': !collapsed,
            'ml-1': !langIsAr,
            'mr-1': langIsAr
          }"
          :title="y18n('showDetails')"
          @keyup.enter="toggleCollapsed"
          @click="toggleCollapsed"
        ></i>
      </div>
      <course-nav-property-edit
        id="item-title"
        :form-placeholder="y18n('title')"
        :property="item.title.text"
        @changed="updateTitle"
      ></course-nav-property-edit>
    </div>
    <!-- Item body -->
    <div
      v-if="!collapsed"
      :id="`item-body-${item.id}`"
      class="collapsible px-3"
      :class="langIsAr? 'mr-3': 'ml-3'"
    >
      <div class="d-flex">
        <span
          class="text-muted small btn-link"
          :class="langIsAr? 'ml-2': 'mr-2'"
          @keyup.enter="previewEmit(value.id)"
          @click="previewEmit(value.id)"
        >
          {{ y18n('courseNavEdit.preview') }}
        </span>
      </div>
      <div class="d-flex">
        <span
          class="text-muted small"
          :class="langIsAr? 'ml-2': 'mr-2'"
        >
          {{ y18n('courseNavEdit.id') }}
        </span>
        {{ item.id }}
      </div>
      <div class="d-flex">
        <span
          class="text-muted small"
          :class="langIsAr? 'ml-2': 'mr-2'"
        >
          {{ y18n('courseNavEdit.slug') }}
        </span>
        <course-nav-property-edit
          :form-placeholder="y18n('courseNavEdit.slug')"
          :property="value.slug"
          @changed="v => propagateChange('slug', v)"
        ></course-nav-property-edit>
      </div>
      <div class="d-flex">
        <span
          class="text-muted small"
          :class="langIsAr? 'ml-2': 'mr-2'"
        >
          {{ y18n('courseNavEdit.fullPath') }}
        </span>
        {{ item.path }}
      </div>
      <div class="d-flex">
        <span
          class="text-muted small"
          :class="langIsAr? 'ml-2': 'mr-2'"
        >
          {{ y18n('type') }}
        </span>
        {{ getName() }}
      </div>
      <div class="d-block">
        <div class="d-flex text-muted small">
          Follow
        </div>
        <course-nav-follow-set
          :follow="followingContent"
          :item="item"
          @follow-update="v => propagateChange('follow', v)"
          @highlight="p => $emit('highlight', p)"
        ></course-nav-follow-set>
      </div>
    </div>
  </div>
</template>
<script>
import { courseNavEmits, locale } from '@/mixins'
import CourseNavFollowSet from '@/components/course/course-nav/course-nav-follow-set.vue'
import CourseNavPropertyEdit from '@/components/course/course-nav/course-nav-property-edit.vue'
import { mapGetters } from 'vuex'
import { deepCopy, kebabToCamel } from '@/mixins/general/helpers'

export default {
  name: 'CourseNavItem',
  components: {
    CourseNavFollowSet,
    CourseNavPropertyEdit
  },
  mixins: [courseNavEmits, locale],
  props: {
    dragBubble: {
      type: Array,
      default: () => [false, false]
    },
    dragEnd: {
      type: Array,
      default: () => [false, false]
    },
    dragStart: {
      type: Boolean,
      default: () => false
    },
    followingContent: {
      type: [String, Array],
      default: () => null
      // required: true
    },
    value: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      collapsed: true,
      moving: false
    }
  },
  computed: {
    ...mapGetters(['courseContent']),
    item () {
      return this.courseContent[this.value.id]
    }
  },
  watch: {
    dragBubble ([bubbled, visible]) {
      if (bubbled) {
        this.collapsed = !visible
      }
    },
    dragEnd ([moved, visible]) {
      if (moved) {
        this.collapsed = !visible
      }
    }
  },
  methods: {
    /**
     * @description return localized Description of Block type
     * @since v1.3.0
     * @author cmc
     * @return {string} Localized name of block
     */
    getName () {
      return this.y18n(kebabToCamel(this.value.type) + '.name')
    },
    /**
     * @description emit event to propagate change to parent
     * @author cmc
     * @since v1.3.0
     * @param property the property to change
     * @param value change value for slug
     */
    propagateChange (property, value) {
      this.$emit('propagatePropertyChange', this.value, property, value)
    },
    /**
     * @description toggle collapsed state of item, emit event to parent
     * @author cmc
     * @since v1.3.0
     */
    toggleCollapsed () {
      this.collapsed = !this.collapsed
      this.$emit('visibilityChange', this.value.id, !this.collapsed) // negate because we want to know if it is visible
    },
    /**
     * @description commit title update to store
     * @author cmc
     * @since v1.3.0
     * @param newTitle change value for title
     */
    updateTitle (newTitle) {
      const newBlock = deepCopy(this.item)
      newBlock.title.text = newTitle
      this.$store.commit(
        'courseContentSetProperty',
        { id: this.value.id, property: 'title', value: newBlock.title }
      )
      this.$forceUpdate() // needed to update rendered title
    }
  }
}
</script>
<style scoped>
#item-title {
  width: 100%;
  font-weight: bolder;
}
.drop-down-icon {
  cursor: pointer;
  min-width: 15px;
}
.edit {
  display: flex;
  justify-content: space-between;
}
.edit>i {
  display: none;
}
.edit:hover>i {
  display: inline-flex;
}
</style>

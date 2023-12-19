<!--
  Filename: course-nav-item.vue
  Use: render a single item in the course navigation editor
  Author: cmc
  Since: v1.3.0
-->
<template>
  <div
    v-b-tooltip.auto
    class="w-100 border rounded p-1"
    :class="{
      'border-primary': value.id === courseStart,
    }"
    :title="value.id === courseStart ? y18n('courseNavEdit.firstBlock') : null"
  >
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
      <!-- preview -->
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
      <!-- id -->
      <div class="d-flex">
        <span
          class="text-muted small"
          :class="langIsAr? 'ml-2': 'mr-2'"
        >
          {{ y18n('courseNavEdit.id') }}
        </span>
        {{ item.id }}
      </div>
      <!-- slug -->
      <div class="d-flex">
        <span
          class="text-muted small"
          :class="langIsAr? 'ml-2': 'mr-2'"
        >
          {{ y18n('courseNavEdit.slug') }}
        </span>
        {{ value.slug }}
      </div>
      <!-- type -->
      <div class="d-flex">
        <span
          class="text-muted small"
          :class="langIsAr? 'ml-2': 'mr-2'"
        >
          {{ y18n('type') }}
        </span>
        {{ typeName(value.type) }}
      </div>
      <!-- follow -->
      <div
        class="d-block"
      >
        <div class="d-flex follow-content">
          <span class="text-muted small">
            {{ y18n('courseNavEdit.follow') }}
          </span>
          <i
            v-b-tooltip.top.ds500
            class="fas fa-edit"
            :class="langIsAr ? 'mr-auto' : 'ml-auto'"
            role="button"
            :title="y18n('courseWrapper.edit')"
            @click="$router.push({name: 'content-follow-edit', params: { contentId: value.id, follow: value.follow }})"
          ></i>
        </div>
        <div
          class="d-flex"
          @click="$bvModal.show('follow-edit')"
        >
          <div
            v-if="followSet"
            class="text-break w-100"
          >
            <p
              v-if="value.type !== 'button-navigation'"
              v-b-tooltip.right
              :title="y18n('courseNavEdit.followHighlight')"
              @mousedown="followHighlight($event, followingContent)"
            >
              {{ followingContent }}
              <span
                v-if="value.followManual"
                :class="langIsAr? 'mr-auto' : 'ml-auto'"
              >
                <i
                  v-b-tooltip.bottom
                  class="fas fa-pen"
                  :title="y18n('courseNavEdit.followEditTip')"
                ></i>
              </span>
            </p>
            <ul
              v-else
              id="follow-list"
            >
              <li
                v-for="e in followSet"
                :key="e"
                v-b-tooltip.right
                :title="y18n('courseNavEdit.followHighlight')"
                @mousedown="followHighlight($event,e)"
              >
                {{ e }}
              </li>
            </ul>
          </div>
          <div v-else>
            <i
              v-if="value.type === 'button-navigation' || value.id !== courseEnd"
              v-b-tooltip.bottom
              class="fas fa-exclamation-circle"
              :title="y18n('courseNavEdit.followWarning')"
            ></i>
            {{ y18n('courseNavEdit.followNone') }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { courseNav, locale } from '@/mixins'
import CourseNavPropertyEdit from '@/components/course/course-nav/course-nav-property-edit.vue'
import { mapGetters } from 'vuex'
import { deepCopy } from '@/mixins/general/helpers'

export default {
  name: 'CourseNavItem',
  components: {
    CourseNavPropertyEdit
  },
  mixins: [courseNav, locale],
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
    courseEnd: {
      type: String,
      required: true
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
    ...mapGetters(['courseContent', 'courseStart']),
    followSet () {
      return this.followingContent
        ? Array.isArray(this.followingContent) // either array or string
          ? this.followingContent // return array as is
          : [this.followingContent] // return string as single item in array
        : null
    },
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
     * @description emit highlight event when shift is pressed
     * @author cmc
     * @since v1.3.0
     */
    followHighlight (e, id) {
      e.preventDefault()
      if (e.shiftKey) {
        this.$emit('highlight', id)
      }
    },
    /**
     * @description toggle collapsed state of item, emit event to parent
     * @author cmc
     * @since v1.3.0
     */
    toggleCollapsed () {
      this.collapsed = !this.collapsed
      this.$emit('visibility-change', this.value.id, !this.collapsed) // negate because we want to know if it is visible
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
.follow-content>i {
  display: none;
}
.follow-content:hover>i {
  display: inline-flex;
}
</style>

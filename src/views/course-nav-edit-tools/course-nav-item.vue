<template>
  <div class="w-100 border rounded p-1">
    <!-- Item header -->
    <div
      :id="`item-header-${item.id}`"
      class="d-flex"
    >
      <div class="drag-handle">
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
            'ml-1': langIsAr,
            'mr-1': !langIsAr
          }"
          :title="y18n('showDetails')"
          @click="collapsed = !collapsed"
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
    <b-collapse
      :id="`item-body-${item.id}`"
      class="px-3"
      :class="langIsAr? 'mr-3': 'ml-3'"
    >
      <div>
        <div class="d-flex">
          <span
            class="text-muted small"
            :class="langIsAr? 'ml-2': 'mr-2'"
          >
            {{ y18n('courseNavEdit.id') }}
          </span>
          {{ item.id }}
        </div>
      </div>
      <div>
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
            @changed="propagateSlugChange"
          ></course-nav-property-edit>
        </div>
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
      <div>
        <div class="d-flex">
          <span
            class="text-muted small"
            :class="langIsAr? 'ml-2': 'mr-2'"
          >
            {{ y18n('type') }}
          </span>
          {{ getName() }}
        </div>
      </div>
    </b-collapse>
  </div>
</template>
<script>
import { locale } from '@/mixins'
import CourseNavPropertyEdit from '@/views/course-nav-edit-tools/course-nav-property-edit.vue'
import { mapGetters } from 'vuex'
import { deepCopy } from '@/misc/utils'
export default {
  name: 'CourseNavItem',
  components: {
    CourseNavPropertyEdit
  },
  mixins: [locale],
  props: {
    dragBubble: {
      type: Boolean,
      default: () => false
    },
    dragEnd: {
      type: Boolean,
      default: () => false
    },
    dragStart: {
      type: Boolean,
      default: () => false
    },
    value: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      collapsed: true,
      moved: false
    }
  },
  computed: {
    ...mapGetters(['courseContent']),
    item () {
      return this.courseContent[this.value.id]
    }
  },
  watch: {
    dragStart (newVal) {
      if (newVal) {
        console.log('being dragged', this.value.id)
        this.moved = true
      }
    },
    dragBubble (newVal) {
      if (newVal) {
        console.log('moved index', this.value.id)
      }
    },
    dragEnd (newVal) {
      if (newVal && this.moved) {
        console.log('stopped being dragged', this.value.id)
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
      return this.y18n(this.$laya.li[this.item.name].name + '.name')
    },
    /**
     * @description emit event to propagate slug change to parent
     * @author cmc
     * @since v1.3.0
     * @param value change value for slug
     */
    propagateSlugChange (value) {
      this.$emit('propagatePropertyChange', this.value, 'slug', value)
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

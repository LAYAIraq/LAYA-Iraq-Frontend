<template>
  <div class="w-100">
    <div class="d-flex">
      <div class="drag-handle">
        <i
          v-b-toggle="`item-body-${item.id}`"
          v-b-tooltip.top.ds500
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

    <b-collapse
      :id="`item-body-${item.id}`"
      class="pl-4 v-collapse"
    >
      <div>
        <div class="d-flex">
          {{ item.id }}
        </div>
      </div>
      <div>
        <div class="d-flex edit">
          <div
            class="mr-2"
            @click="editProperty('slug')"
          >
            {{ value.slug }}
          </div>
          <i class="fa fa-edit"></i>
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
    value: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      collapsed: true
    }
  },
  computed: {
    ...mapGetters(['courseContent']),
    item () {
      return this.courseContent[this.value.id]
    }
  },
  methods: {
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

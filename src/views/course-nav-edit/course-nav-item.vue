<template>
  <div id="item-container">
    <div
      id="item-header"
      class="d-flex drag-handle"
    >
      <i
        v-b-tooltip.top.ds500
        class="fa drop-down-icon"
        :class="{
          'fa-chevron-right': !langIsAr && collapsed,
          'fa-chevron-left': langIsAr && collapsed,
          'fa-chevron-down': !collapsed
        }"
        :title="y18n('showDetails')"
        @click="collapsed = !collapsed"
      ></i>
      <div
        id="item-title"
        class="edit"
        @click="editProperty('title')"
      >
        {{ item.title.text }}
        <i
          class="fas fa-edit"
          :class="langIsAr ? 'mr-auto' : 'ml-auto'"
        ></i>
      </div>
    </div>
    <div
      v-if="!collapsed"
      id="item-body"
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
    </div>
  </div>
</template>
<script>
import { locale } from '@/mixins'
import { mapGetters } from 'vuex'
export default {
  name: 'CourseNavItem',
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

<!--
Filename: accordion.vue
Use: This component is used to show all courses a user has enrolled in
Creator: core
Date: unknown
Dependencies: none
-->

<template>
  <div class="accordion">
    <div v-show="data.length > 0">
      <slot name="header"></slot>
      <div class="list">
        <div
          class="item"
          v-for="d in data"
          :key="d"
        >
          <slot
            name="item"
            :item="d"
          ></slot>
        </div>
      </div>
    </div>
    <div
      v-show="data.length === 0"
      class="p-3"
    >
      <h3 class="empty text-center">
        <i class="far fa-frown"></i>
        <span>{{ y18n('noCourses') }}</span>
      </h3>
    </div>
  </div>
</template>

<script>
import { locale } from '@/mixins'
export default {
  name: 'Accordion',

  mixins: [
    locale
  ],

  props: {
    data: {
      type: Array,
      default () {
        return []
      }
    }
  }
}
</script>

<style scoped>
.empty * {
  color: grey !important;
}

.accordion * {
  color: black;
}

.list {
  border-top: 2px solid black;
}

.item {
  border-bottom: 1px dashed black;
  padding: 0.5rem 0 0.5rem 0;
}

.item:last-child {
  border-bottom: none;
}
</style>

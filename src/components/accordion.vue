<template>

  <div class="ly-accordion">
    <div v-show="data.length > 0">
      <slot name="header"></slot>
      <div class="list">

        <div class="item" v-for="d in data">
          <slot name="item" :item="d"></slot>
        </div>

      </div>
    </div>
    <div v-show="data.length === 0" class="p-3">
      <h3 class="empty text-center">
        <i class="far fa-frown"></i>
        <span v-if="$store.state.profile.lang === 'de'">
          Keine Kurse gefunden
        </span>
        <span v-else>No courses found</span>
      </h3>
    </div>
  </div>

</template>

<script>
export default {
  name: 'ly-accordion',
  props: {
    data: Array
  }
}
</script>

<style scoped>
.empty * {
  color: grey !important;
}

.ly-accordion * {
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

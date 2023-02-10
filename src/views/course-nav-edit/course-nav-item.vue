<template>
  <div class="m-auto">
    <div>{{ value.slug }}</div>
  </div>
</template>
<script>
export default {
  name: 'CourseNavItem',
  props: {
    value: {
      type: Object,
      required: true
    }
  }
}
</script>

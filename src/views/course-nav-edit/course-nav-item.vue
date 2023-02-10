<template>
  <div>
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

<template>
  <label class="ly-button" for="ly-submit">

    {{ left ? '&#10094;' : '' }}
    <slot />
    {{ right ? '&#10095;' : '' }}

    <input v-if="submit" id="ly-submit" type="submit" class="d-none">
  </label>
</template>

<script>
export default {
  name: 'ly-button',
  props: {
    left: { type: Boolean, default: false },
    right: { type: Boolean, default: false },
    submit: { type: Boolean, default: false }
  }
}
</script>

<style scoped>
.ly-button {
  width: 100%;

  display: inline-block;
  padding: 0.7rem;
  text-align: center;
  color: black !important;
  border: 0.2rem solid black;

  cursor: pointer;
  position: relative;
}
</style>

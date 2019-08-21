<template>
  <div class="ly-input-wrapper">

    <div class="ly-input" :class="{error: invalid}">

      <input 
      ref="input" 
      :value="value"
      @input="onValue($event.target.value)"
      :placeholder="ph"
      :type="type"
      :disabled="disabled"
      class="w-100">
    </div>
    <div class="text-center" :class="{'d-none': !invalid}">
      {{ hint }}
    </div>

  </div>
</template>

<script>
export default {
  name: 'ly-button',
  props: {

    ph: String,
    type: String,

    hint: String,
    invalid: Boolean,

    disabled: Boolean,

    value: null
  },
  methods: {

    onValue: function (val) {
      this.$emit('input', val)
    }
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

.disable {
  cursor: default;

  color: #aaa !important;
  border-color: #aaa !important;
  text-decoration: line-through;
}
</style>

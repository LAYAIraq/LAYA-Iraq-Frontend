<template>
  <div class="ly-input-file">

    <!-- select -->
    <div class="input-group mb-3">
      <div class="input-group-prepend">
        <div class="input-group-text">
          <slot></slot>
        </div>
      </div>
      <div class="custom-file">
        <label for="file" class="custom-file-label"
          :class="{'font-weight-bold': value, 'text-muted': !value}">
          {{ fileLabel }}
        </label>
        <input id="file" type="file" class="custom-file-input"
        ref="file" @change="setFile">
      </div>
      <div class="input-group-append">
        <button v-show="value" type="button" aria-label="Löschen"
          @click="unsetFile" class="btn btn-danger">
          <i class="fas fa-times"></i>
        </button>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: 'ly-input-file',
  props: [ 'ph', 'value' ],
  computed: {
    fileLabel: function () {
      if (!this.value) return this.ph
      if (typeof this.value === 'string') return this.value
      if (typeof this.value === 'object') return this.value.name
    }
  },
  methods: {
    setFile: function () {
      let file = new Object(this.$refs.file.files[0])
      this.$emit('input', file)
    },
    unsetFile: function () {
      this.$emit('input', null)
    }
  }
}
</script>

<style scoped>
.custom-file-label {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.custom-file-input {
  cursor: pointer;
}

.custom-file-label:after {
  display: none;
}
</style>

<template>
  <div class="laya-la-lb-wrapper">

    <!-- preview -->
    <div v-if="preview" :is="comps.view" v-bind="previewInput"></div>

    <!-- editing view -->
    <div v-show="!preview" :is="comps.edit" ref="edit"></div>

    <hr>

    <div class="d-flex justify-content-between">
      <button type="button"
              class="btn btn-secondary"
              :class="{active: preview}"
              @click="togglePreview">
        {{ preview ? 'Bearbeiten' : 'Vorschau' }}
      </button>
      <button type="button" class="btn btn-primary" @click="save">
        <i class="fas fa-check"></i> Speichern
      </button>
    </div>

  </div>
</template>

<script>
export default {
  name: "laya-la-lb-wrapper",
  data() {
    return {
      preview: false,
      previewInput: {},
    }
  },
  props: {
    cid: String
  },
  computed: {
    comps: function() {
      const la = this.$laya.la[this.cid]
      return la ? la.components : this.$laya.lb[this.cid].components
    }
  },
  methods: {
    save() {},
    togglePreview() {
      let input = {}
      const data = this.$refs.edit.$data
      for (let prop in data) {
        if(!/^[$_]/.test(prop)) {
          input[prop] = data[prop]
        }
      }
      this.previewInput = input
      this.preview = !this.preview
    }
  },
}
</script>

<style scoped></style>

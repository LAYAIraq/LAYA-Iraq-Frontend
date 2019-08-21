<template>
  <div class="ly-input-img position-relative">

    <!-- select -->
    <label for="image-input" class="d-block m-auto">

      <img v-if="preview"
           :src="preview"
           alt="Datei auswählen"
           class="rounded-circle"
           style="border: 2px solid black"> 

      <slot v-else class="rounded-circle"></slot>

    </label>
    <input id="image-input"
           ref="img"
           type="file"
           class="custom-input"
           @change="setImg">

    <!-- unselect -->
    <button v-if="preview"
            type="button"
            class="close"
            aria-label="Profilbild löschen"
            @click="unsetImg">
      <span :aria-hidden="!preview">&times;</span>
    </button>

  </div>
</template>

<script>
export default {
  name: 'ly-input-img',
  data () {
    return { preview: null }
  },
  props: {
    value: File
  },
  methods: {
    setImg: function () {
      let imgFile = this.$refs.img.files[0]
      this.preview = URL.createObjectURL(imgFile)
      this.$emit('input', imgFile)
    },
    unsetImg: function () {
      URL.revokeObjectURL(this.preview)
      this.preview = null
      this.$emit('input', null)
    }
  }
}
</script>

<style scoped>
*:focus {
  outline: 2px dashed deepskyblue;
}

#image-input {
  position: absolute;
  width: inherit;
  transform: translateX(-50%);
}

label {
  cursor: pointer;
}

img {
  width: 100%;
  height: 6rem;
}

.close {
  position: absolute;
  top: 0;
  right: 0;
  transform: translateX(50%) translateY(-50%);
  font-size: 2rem;
}
</style>

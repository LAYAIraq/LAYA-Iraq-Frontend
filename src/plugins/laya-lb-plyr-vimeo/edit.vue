<template>

  <div :class="name">

    <form>
      <div class="form-group">
        <label for="vimeo-vid-id">Vimeo Video</label>
        <input id="vimeo-vid-id"
               type="text"
               v-model="url"
               class="form-control"
               placeholder="z.B. https://vimeo.com/346694402">
      </div>

    </form>
      
  </div>

</template>

<script>
const name = "laya-lb-plyr-vimeo-edit"

export default {
  name,
  data() {
    return {
      name,
      url: ""
    }
  },
  mounted() {
  },
  props: {
  },
  computed: {
  },
  methods: {
  },
}
</script>

<style>
</style>

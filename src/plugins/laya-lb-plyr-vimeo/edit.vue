<template>

  <div class="laya-lb-plyr-vimeo-edit">

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

export default {
  name: "laya-lb-plyr-vimeo-edit",
  data() {
    if(Object.entries(this.$attrs).length > 0)
      return {...this.$attrs}
    return {
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

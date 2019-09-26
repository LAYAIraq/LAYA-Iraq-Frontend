<template>
  <div class="laya-ableplayer-edit">

    <h3>Video über AblePlayer</h3>
    <hr>
    <form>
      <div class="form-group">
        <label for="able-src-id">Haupt-Video-URL:</label>
        <input id="able-src-id"
               type="text"
               v-model="src"
               class="form-control"
               placeholder="z.B. https://laya.de/video.mp4">
      </div>

      <div class="form-group">
        <label for="able-sign-id">Gebärdensprache-Video-URL:</label>
        <input id="able-sign-id"
               type="text"
               v-model="sign"
               class="form-control"
               placeholder="z.B. https://laya.de/gebärdensprache.mp4">
      </div>

      <div class="form-group">
        <label for="able-sub-id">Untertitel-URL:</label>
        <input id="able-sub-id"
               type="text"
               v-model="sub"
               class="form-control"
               placeholder="z.B. https://laya.de/untertitel.vtt">
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
      src: "",
      sign: "",
      sub: ""
    }
  },
}
</script>

<style>
</style>

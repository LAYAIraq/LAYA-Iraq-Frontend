<template>
  <div class="laya-lb-plyr-vimeo-view">
    <div :id="playerId" data-plyr-provider="vimeo" :data-plyr-embed-id="vimeoId">
    </div>
  </div>
</template>

<script>
import Plyr from "plyr"
import "plyr/dist/plyr.css"

export default {
  name: "laya-plyr-vimeo",
  data() {
    return {
      plyr: null
    }
  },
  mounted() {
    const vue = this
    vue.plyr = new Plyr(`#${vue.playerId}`)
    vue.plyr.on("ended", e => vue.onFinish[0]())
  },
  props: {
    url: String,
    onFinish: Array
  },
  computed: {
    playerId: function() {
      return `ly-plyr-vimeo-${Date.now()}`
    },
    vimeoId: function() {
      let id = this.url
      if(/http/.test(id)) {
        let arr = id.split("/")
        id = arr[arr.length-1]
      }
      return parseInt(id)
    }
  },
  methods: {
  },
}
</script>

<style>
</style>

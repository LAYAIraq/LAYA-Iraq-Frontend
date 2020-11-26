<template>
  <div :id="playerId" class="ly-plyr plyr__video-embed">

    <iframe :src="src"></iframe>

  </div>
</template>

<script>
import Plyr from "plyr"

export default {
  name: "laya-plyr",
  data() {
    return {
      plyr: null
    }
  },
  mounted() {
    this.plyr = new Plyr(this.playerId)
    // console.log("plyr: ", this.plyr)
    this.plyr.on("ended", e => {
      console.log("finished playing")
    })
  },
  props: {
    src: String,
  },
  computed: {
    playerId() {
      return `ly-plyr-${Date.now()}`
    },
  },
  methods: {
    notEmpty(str) {
      return (!!str && str.length > 0) ? str : false
    }
  },
}
</script>

<style>
</style>

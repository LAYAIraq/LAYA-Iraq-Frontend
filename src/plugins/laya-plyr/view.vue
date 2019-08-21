<template>
  <div :id="playerId" class="ly-plyr plyr__video-embed">

    <iframe :src="src"></iframe>

  </div>
</template>

<script lang="ts">
import Vue from "vue"
import Plyr from "plyr"

export default Vue.extend({
  name: "laya-plyr",
  data() {
    return {
      plyr: null
    }
  },
  mounted() {
    this.plyr = new Plyr(this.playerId)
    console.log("plyr: ", this.plyr)
    this.plyr.on("ended", e => {
      console.log("finished playing")
    })
  },
  props: {
    src: String,
  },
  computed: {
    playerId: function() {
      return `ly-plyr-${Date.now()}`
    },
  },
  methods: {
    notEmpty: (str) => (!!str && str.length > 0) ? str : false,
  },
})
</script>

<style>
</style>

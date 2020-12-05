<template>
  <div class="ly-plyr-view">

    <div :id="playerId" :data-plyr-provider="platform" :data-plyr-embed-id="src" class="plyr__video-embed">
    </div>

    <button type="button"
            class="btn btn-primary mt-3 d-block ml-auto"
            @click="onFinish[0]() || {}">
      <span>{{ i18n.nextContent }}<i class="fas fa-arrow-right"></i></span>
    </button>
  

  </div>
</template>

<script>
import Plyr from "plyr"
import "plyr/dist/plyr.css"
import * as i18n from "@/i18n/plugins/misc/laya-plyr"

export default {
  name: "laya-plyr",
  data() {
    return {
      plyr: null
    }
  },
  mounted() {
    this.plyr = new Plyr(`#${this.playerId}`)
    // console.log("plyr: ", this.plyr)
    /* this.plyr.source = {
      type: 'video',
      sources: [
        {
          src: this.src,
          provider: this.platform
        }
      ]
    }
    this.plyr.on("ended", e => {
      console.log("finished playing")
    }) */
  },
  
  props: {
    src: String,
    onFinish: Array
  },
  computed: {
    playerId() {
      return `ly-plyr-${Date.now()}`
    },
    platform() {
      if (this.src.includes("youtube")) return "youtube"
      else if (this.src.includes("vimeo")) return "vimeo"
      else return "" 
    },
    i18n() {
      return i18n[this.$store.state.profile.lang]
    }

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

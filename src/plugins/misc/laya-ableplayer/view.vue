<template>
  <div class="ly-ableplayer">

    <video :id="playerId"
      preload="auto"
      data-debug
      :data-lang="lang" data-force-lang>

      <source type="video/mp4"
              :src="notEmpty(src)"
              :data-sign-src="notEmpty(sign)"/>

        <track kind="captions" :src="notEmpty(sub)" default/>
    </video>

    <button type="button"
            class="btn btn-primary mt-3 d-block ml-auto"
            @click="onFinish[0]() || {}">
      {{ i18n.nextContent }}<i class="fas fa-arrow-right"></i>
    </button>


  </div>
</template>

<script>
import "ableplayer"
import "ableplayer/build/ableplayer.min.css"
import * as i18n from "@/i18n/plugins/misc/laya-ableplayer"

export default {
  name: "laya-ableplayer",
  data() {
    return {
      ableplayer: null
    }
  },
  mounted() {
    this.ableplayer = new window.AblePlayer(`#${this.playerId}`)
  },
  props: {
    src: String,
    sign: String,
    sub: String,
    onFinish: Array
  },
  computed: {
    playerId: function() {
      return `laya-ableplayer-${Date.now()}`
    },
    lang: function() {
      return "de"
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

<style scoped>
.able-status-bar {
  min-height: 2.5em;
}
</style>

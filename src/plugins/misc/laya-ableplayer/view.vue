<template>
  <div class="ly-ableplayer">

    <video :id="playerId"
      :data-vimeo-id="vimeo ? src : false"
      preload="auto"
      data-debug
      :data-lang="lang" data-force-lang>

      <source v-if="!vimeo"
              type="video/mp4"
              :src="notEmpty(src)"
              :data-sign-src="notEmpty(sign)">

        <track v-if="!vimeo" kind="captions" :src="notEmpty(sub)" default>
    </video>
  </div>
</template>

<script lang="ts">
import "ableplayer"
import Vue from "vue"
export default Vue.extend({
  name: "laya-ableplayer",
  data() {
    return {
      ableplayer: null
    }
  },
  mounted() {
    this.ableplayer = new window["AblePlayer"](`#${this.playerId}`)
  },
  props: {
    src: String,
    vimeo: Boolean,
    sign: String,
    sub: String,
  },
  computed: {
    playerId: function() {
      return `ly-able-${Date.now()}`
    },
    lang: function() {
      return "de"
    }
  },
  methods: {
    notEmpty: (str) => (!!str && str.length > 0) ? str : false,
  },
})
</script>

<style>
.able {
  box-shadow: unset;
}
.able * {
  box-sizing: content-box;
}
</style>

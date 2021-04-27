<!-- 
Filename: view.vue
Use: Show button to play audio
Creator: core
Date: unknown
Dependencies: none
-->

<template>
  <span class="laya-audio-inline">
    <button type="button"
            class="btn btn-outline-info btn-sm"
            :class="{active: playing}"
            @click="togglePlay">
      <i class="fas fa-volume-up"></i>
    </button>
    <audio v-show="false" ref="player" @ended="playing = false" :src="src">
    </audio>
  </span>
</template>

<script>
export default {
  name: "laya-audio-inline",
  data() {
    return {
      playing: false,
    }
  },
  props: {
    src: String,
  },
  methods: {

    /**
     * Function togglePlay: toggle audio
     * 
     * Author: core
     * 
     * Last Updated: unknown
     */
    togglePlay() {
      if (this.playing) {
        this.$refs.player.pause()
        this.playing = false
      } else {
        this.$refs.player.play()
        this.playing = true
      }
    }
  },
}
</script>

<style>
</style>

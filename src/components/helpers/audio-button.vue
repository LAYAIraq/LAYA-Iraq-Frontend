<!--
  Filename: audio-button.vue
  Use: Show button to play audio
  Creator: core
  Since: v1.0.0
-->

<template>
  <span class="audio-button">
    <button
      type="button"
      class="btn btn-outline-info btn-sm"
      :class="{active: playing}"
      @click="togglePlay"
    >
      <i class="fas fa-volume-up"></i>
    </button>
    <audio
      v-show="!playing"
      ref="player"
      :src="src"
      @ended="playing = false"
    >
    </audio>
  </span>
</template>

<script>
export default {
  name: 'AudioButton',
  props: {
    src: {
      type: String,
      default () { return '' }
    }
  },
  data () {
    return {
      playing: false
    }
  },
  methods: {

    /**
     * Function togglePlay: toggle audio
     *
     * Author: core
     *
     * Last Updated: unknown
     */
    togglePlay () {
      if (this.playing) {
        this.$refs.player.pause()
        this.playing = false
      } else {
        this.$refs.player.play()
        this.playing = true
      }
    }
  }
}

</script>

<style>
</style>

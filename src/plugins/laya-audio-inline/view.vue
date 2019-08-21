<template>
  <span class="laya-audio-inline">
    <button type="button"
            class="btn btn-outline-info btn-sm"
            :class="{active: playing}"
            @click="togglePlay">
      <i class="fas fa-volume-up"></i>
    </button>
    <audio v-show="false" ref="player" @ended="playing = false">
      <source :src="src" type="audio/mp3" />
    </audio>
  </span>
</template>

<script lang="ts">
import Vue from "vue"

export default Vue.extend({
  name: "laya-audio-inline",
  data() {
    return {
      playing: false,
    }
  },
  props: {
    src: String,
  },
  computed: {
  },
  methods: {
    togglePlay: function() {
      if (this.playing) {
        this.$refs.player.pause()
        this.playing = false
      } else {
        this.$refs.player.play()
        this.playing = true
      }
    }
  },
})
</script>

<style>
</style>

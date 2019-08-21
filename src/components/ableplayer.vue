<template>
  <div class="ly-ableplayer">

    <video :id="playerId"
           preload="auto"
           width="480"
           height="360"
           :data-lang="lang" data-force-lang>

      <source type="video/mp4" :src="src" :data-sign-src="sign">
      <track kind="captions" :src="sub" default>
    </video>
  </div>
</template>

<script>
import $ from 'jquery'

export default {
  name: 'ly-ableplayer',
  data () {
    return {
      ableplayer: null
    }
  },
  props: {
    src: String,
    sign: String,
    sub: String
  },
  mounted: function () {
    this.ableplayer = new window.AblePlayer($(`#${this.playerId}`))
  },
  computed: {
    playerId: function () {
      return `ly-ableplayer-video-${this._uid}`
    },
    lang: function () {
      return (this.$store.state.profile.lang === 'de') ? 'de' : 'en'
    }
  }
}
</script>

<style>
.able * {
  box-sizing: content-box;
}
</style>

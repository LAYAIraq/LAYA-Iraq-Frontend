<template>
  <div class="ly-ableplayer">

    <video :id="playerId"
      preload="auto"
      data-debug
      :data-lang="$store.state.profile.lang" data-force-lang>

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
import { mapGetters } from "vuex"
import "ableplayer/build/ableplayer.min.css"
import * as i18n from "@/i18n/plugins/misc/laya-ableplayer"

export default {
  name: "laya-ableplayer",
  data() {
    if (Object.entries(this.$attrs).length === 3)
      return {
        ...this.$attrs,
        ableplayer: null
      }
    return {
      src: "",
      sign: "",
      sub: "",
      ableplayer: null
    }
  },
  created() {
    let idx = this.$route.params.step - 1
    const preData = JSON.parse(JSON.stringify(this.content[idx].input))
    this.src = preData.src
    this.sign = preData.sign
    this.sub = preData.sub
  },
  mounted() {
    this.ableplayer = new window.AblePlayer(`#${this.playerId}`)
  },
  props: {
    onFinish: Array
  },
  computed: {
    ...mapGetters(["content"]),
    playerId() {
      return `laya-ableplayer-${Date.now()}`
    },
    lang() {
      return this.$store.state.profile.lang
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
  min-height: 2.5em !important;
}
</style>

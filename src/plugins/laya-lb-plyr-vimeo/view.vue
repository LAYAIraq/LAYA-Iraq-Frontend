<template>
  <div class="laya-lb-plyr-vimeo-view">
    <div :id="playerId" data-plyr-provider="vimeo" :data-plyr-embed-id="url">
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
import * as i18n from "@/i18n/plugins/laya-lb-plyr-vimeo"
// import { mapGetters } from "vuex"

export default {
  name: "laya-plyr-vimeo",
  data() {
    return {
      plyr: null
    }
  },
  mounted() {
    const vue = this
    vue.plyr = new Plyr(`#${vue.playerId}`)
    //vue.plyr.on("ended", e => vue.onFinish[0]())
  },
  props: {
    url: String,
    onFinish: Array
  },
  computed: {
    // ...mapGetters(["profileLang"]),
    playerId: function() {
      return `ly-plyr-vimeo-${Date.now()}`
    },
    vimeoId: function() {
      let id = this.url
      if(/http/.test(id)) {
        let arr = id.split("/")
        id = arr[arr.length-1]
      }
      return parseInt(id)
    },
    i18n() {
      return i18n[this.$store.state.profile.lang]
    }
  },
  methods: {
  },
}
</script>

<style>
</style>

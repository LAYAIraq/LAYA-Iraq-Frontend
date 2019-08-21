<template>
  <div
    :id="playerId"
    class="laya-plyr-vimeo"
    data-plyr-provider="vimeo"
    :data-plyr-embed-id="id">
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import Plyr from "plyr"
import "plyr/dist/plyr.css"

export default Vue.extend({
  name: "laya-plyr-vimeo",
  data() {
    return {
      plyr: null
    }
  },
  mounted() {
    const vue = this
    vue.plyr = new Plyr(`#${vue.playerId}`)
    vue.plyr.on("ended", e => {
      vue.onFinish[0]()
    })
    //document.querySelector("[data-plyr='play']").click()
  },
  props: {
    id: Number,
    onFinish: Array
  },
  computed: {
    playerId: function() {
      return `ly-plyr-vimeo-${Date.now()}`
    },
  },
  methods: {
  },
})
</script>

<style>
</style>

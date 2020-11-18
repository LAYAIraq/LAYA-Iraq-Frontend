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
    playerId() {
      return `laya-ableplayer-${Date.now()}`
    },
    lang() {
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

<style>
.able {
  box-shadow: unset;
  box-sizing: content-box;
}


.able-status-bar {
  display: block;
}

.able-controller div {
  display: flex;
}

.able-seekbar {
  margin-top: 20px;
  width: 100%;
}

[role=button] {
  margin-right: 5px;
  padding: 1px;
  width: 25px;
}
</style>

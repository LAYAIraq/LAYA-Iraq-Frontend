<!--
Filename: view.vue
Use: View Videos in AblePlayer
Creator: core
Date: unknown
Dependencies:
  ableplayer,
  vuex,
  @/i18n/plugins/misc/laya-ableplayer
-->

<template>
  <div class="ly-ableplayer">

    <video :id="playerId"
      preload="auto"
      data-debug
      :data-lang="profileLang" data-force-lang>

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
import 'ableplayer'
import { mapGetters } from 'vuex'
import 'ableplayer/build/ableplayer.min.css' //neccessary, otherwise ableplayer is butchered
import * as i18n from '@/i18n/plugins/misc/laya-ableplayer'

export default {
  name: 'laya-ableplayer',
  data() {
    if (Object.entries(this.$attrs).length === 3)
      return {
        ...this.$attrs,
        ableplayer: null
      }
    return {
      src: '',
      sign: '',
      sub: '',
      ableplayer: null
    }
  },
  created() {
    this.fetchData()
  },
  mounted() {
    this.ableplayer = new window.AblePlayer(`#${this.playerId}`)
  },
  props: {
    onFinish: Array
  },
  computed: {
    ...mapGetters(['content', 'profileLang']),

    /**
     * playerId: return an id for ableplayer html element
     * 
     * Author: core
     * 
     * Last Updated: unknown
     */
    playerId() {
      return `laya-ableplayer-${Date.now()}`
    },

    /**
     * i18n: Load translation files depending on user langugage
     * 
     * Author: cmc
     * 
     * Last updated: March 19, 2021
     * 
     */
    i18n() {
      return i18n[this.profileLang]
    }
  },
  methods: {

    /**
     * Function notEmpty: returns the string if it's not empty, false otherwise
     * 
     * Author: core
     * 
     * Last Updated: unknown
     * 
     * @param {string} str string to be checked
     */
    notEmpty(str) {
      return (!!str && str.length > 0) ? str : false
    },

    /**
     * Function fetchData: fetch data from vuex and make data property
     * 
     * Author: cmc
     * 
     * Last Updated: March 19, 2021
     */
    fetchData() {
      let idx = this.$route.params.step - 1
      const preData = JSON.parse(JSON.stringify(this.hasContent[idx].input))
      this.src = preData.src
      this.sign = preData.sign
      this.sub = preData.sub
    }
  },
}
</script>

<style scoped>
.able-status-bar {
  min-height: 2.5em !important;
}
</style>

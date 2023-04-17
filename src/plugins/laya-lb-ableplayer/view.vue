<!--
Filename: view.vue
Use: View Videos in AblePlayer
Creator: core
Date: unknown
Dependencies:
  ableplayer,
  vuex,
  @/mixins/locale.vue
-->

<template>
  <div class="ly-ableplayer">
    <div
      v-if="title.show"
      :id="title.id"
      class="flaggable row"
    >
      <h4> {{ title.text }}</h4>
      <flag-icon
        v-if="!viewData"
        :ref-data="title"

        @flagged="title.flagged = true"
      ></flag-icon>
    </div>

    <video
      :id="playerId"
      preload="auto"
      data-debug
      :data-lang="profileLang"
      data-force-lang
    >

      <source
        type="video/mp4"
        :src="notEmpty(src)"
        :data-sign-src="notEmpty(sign)"
      />

      <track
        kind="captions"
        :src="notEmpty(sub)"
        default
      />
    </video>

    <button
      type="button"
      class="btn btn-primary mt-3 d-block ml-auto"
      @click="onFinish[0]() || {}"
    >
      {{ y18n('nextContent') }}
      <i class="fas fa-arrow-right"></i>
    </button>
  </div>
</template>

<script>
// import 'ableplayer' FIXME: still broken
import { mapGetters } from 'vuex'
import 'ableplayer/build/ableplayer.min.css' // neccessary, otherwise ableplayer is butchered
import { locale, viewPluginProps, watchContent } from '@/mixins'
import '@/assets/styles/flaggables.css'
import FlagIcon from '@/components/course/flag/flag-icon.vue'

export default {

  name: 'LayaAbleplayer',
  components: { FlagIcon },

  mixins: [
    locale,
    viewPluginProps,
    watchContent
  ],

  data () {
    if (this.viewData) {
      return {
        ...this.viewData,
        ableplayer: null
      }
    }
    return {
      title: '',
      src: '',
      sign: '',
      sub: '',
      ableplayer: null
    }
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
    playerId () {
      return `laya-ableplayer-${Date.now()}`
    }
  },
  created () {
    if (!this.viewData) this.fetchData()
  },

  mounted () {
    this.ableplayer = new window.AblePlayer(`#${this.playerId}`)
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
    notEmpty (str) {
      return (!!str && str.length > 0) ? str : false
    },

    /**
     * Function fetchData: fetch data from vuex and make data property
     *
     * Author: cmc
     *
     * Last Updated: March 19, 2021
     */
    fetchData () {
      const idx = this.$route.params.step - 1
      const preData = JSON.parse(JSON.stringify(this.content[idx].input))
      this.src = preData.src
      this.sign = preData.sign
      this.sub = preData.sub
      this.title = preData.title
      this.showTitle = preData.showTitle
    }
  }
}
</script>

<style scoped>
.able-status-bar {
  min-height: 2.5em !important;
}
</style>

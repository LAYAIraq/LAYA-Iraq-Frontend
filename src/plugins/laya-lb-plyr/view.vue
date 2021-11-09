<!--
Filename: view.vue
Use: View Plyr content block
Creator: core
Date: unknown
Dependencies:
  plyr,
  vuex,
  @/mixins/locale.vue
-->

<template>
  <div class="ly-plyr-view">

    <div
      v-if="title.show"
      class="flaggable row"
      :id="title.id"
    >
      <h2>{{ courseSimple? title.simple : title.text }}</h2>
      <laya-flag-icon v-if="!previewData"
          :refData="title"
          @flagged="title.flagged = true"
      ></laya-flag-icon>
    </div>


    <div>
        <div
          :id="playerId"
          :data-plyr-provider="platform"
          :data-plyr-embed-id="src"
          class="plyr__video-embed"
        ></div>
<!--      <laya-flag-icon v-if="!previewData"-->
<!--          :refData="videoFlag"-->
<!--          :interactive="true"-->
<!--          @flagged="videoFlag.flagged = true"-->
<!--      ></laya-flag-icon>-->
    </div>

    <div class="row">
      <button
        type="button"
        class="btn btn-primary mt-3 d-block ml-auto"
        :class="langIsAr? 'float-right': 'float-left'"
        @click="onFinish[0]() || {}">
        <span>
          {{ i18n['nextContent'] }}
          <i :class="langIsAr?
            'fas fa-arrow-left' :
            'fas fa-arrow-right'"></i>
        </span>
      </button>
    </div>

  </div>
</template>

<script>
import Plyr from 'plyr'
import { mapGetters } from 'vuex'
import 'plyr/dist/plyr.css'
import { locale } from '@/mixins'
import '@/styles/flaggables.css'

export default {
  name: 'laya-plyr',

  mixins: [
    locale
  ],

  data() {
    if (this.previewData) { // for 'preview' feature
      return {...this.previewData}
    }
    return {
      plyr: null,
      src: '',
      title: '',
      videoFlag: {}
    }
  },
  created() {
    if(!this.previewData) this.fetchData()
  },
  mounted() {
    this.initPlyr()
  },

  props: {
    onFinish: Array
  },
  computed: {
    ...mapGetters([
      'content',
      'courseSimple'
    ]),

    /**
     * playerId: returns id for html element
     *
     * Author: core
     *
     * Last Updated: unknown
     */
    playerId() {
      return `ly-plyr-${Date.now()}`
    },

    /**
     * platform: returns 'youtube' or 'vimeo' depending in src
     *
     * Author: cmc
     *
     * Last Updated: January 17, 2021
     */
    platform() {
      if (this.src.includes('youtube')) return 'youtube'
      else if (this.src.includes('vimeo')) return 'vimeo'
      else return ''
    }

  },
  methods: {

    /**
     * Function notEmpty: checks if String is not empty
     *
     * Author: core
     *
     * Last Updated: unknown
     *
     * @param {string} str string to check
     */
    notEmpty(str) {
      return (!!str && str.length > 0) ? str : false
    },

    /**
     * Function fetchData: fetch data from vuex and make data property
     *
     * Author: cmc
     *
     * Last Updated: March 20, 2021
     */
    fetchData() {
      let idx = this.$route.params.step - 1
      const preData = JSON.parse(JSON.stringify(this.content[idx].input))
      this.src = preData.src
      this.showTitle = preData.showTitle
      this.title = preData.title
      this.videoFlag = preData.videoFlag
    },

    /**
     * function initPlyr: initialize Plyr instance
     *
     * Author: core
     *
     * Updated: March 20, 2021
     */
    initPlyr() {
      this.plyr = new Plyr(`#${this.playerId}`)
      // console.log('plyr: ', this.plyr)
      /* this.plyr.source = {
        type: 'video',
        sources: [
          {
            src: this.src,
            provider: this.platform
          }
        ]
      }
      this.plyr.on('ended', e => {
        console.log('finished playing')
      }) */
    }
  }
}
</script>

<style>
</style>

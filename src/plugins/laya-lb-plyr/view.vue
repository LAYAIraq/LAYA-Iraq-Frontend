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

    <h4 v-if="showTitle">{{ title }}</h4>

    <div 
      :id="playerId" 
      :data-plyr-provider="platform" 
      :data-plyr-embed-id="src" 
      class="plyr__video-embed">
    </div>

    <button 
      type="button"
      class="btn btn-primary mt-3 d-block ml-auto"
      @click="onFinish[0]() || {}">
      <span>
        {{ i18n['nextContent'] }}
        <i class="fas fa-arrow-right"></i>
      </span>
    </button>
  
  </div>
</template>

<script>
import Plyr from 'plyr'
import { mapGetters } from 'vuex'
import 'plyr/dist/plyr.css'
import { locale } from '@/mixins'

export default {
  name: 'laya-plyr',

  mixins: [
    locale
  ],

  data() {
    if (Object.entries(this.$attrs).length === 4) { // for 'preview' feature
      return {...this.$attrs}
    }
    return {
      plyr: null,
      src: '',
      title: '',
      showTitle: false
    }
  },
  created() {
    this.fetchData()
  },
  mounted() {
    this.initPlyr()
  },
  
  props: {
    onFinish: Array
  },
  computed: {
    ...mapGetters(['content']),

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

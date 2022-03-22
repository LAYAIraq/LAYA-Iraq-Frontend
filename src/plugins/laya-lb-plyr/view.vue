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
      :id="title.id"
      class="flaggable row"
    >
      <h2>{{ courseSimple? title.simple : title.text }}</h2>
      <laya-flag-icon
        v-if="!previewData"
        :ref-data="title"
        @flagged="title.flagged = true"
      ></laya-flag-icon>
    </div>

    <div>
      <div
        v-if="platform !== 'self-hosted'"
        :id="playerId"
        :data-plyr-provider="platform"
        :data-plyr-embed-id="src"
        class="plyr__video-embed"
      >
      </div>
      <video
        v-else
        :id="playerId"
      >
        <source
          v-for="source in sources"
          :key="source.src"
          :src="source.src"
          :type="source.type"
        />
        <track
          v-for="track in tracks"
          :key="track.label"
          :default="track.default"
          :src="track.src"
          :label="track.label"
          :srclang="track.srclang"
          :kind="track.kind"
        />
      </video>
      <!--      <laya-flag-icon v-if="!previewData"-->
      <!--          :refData="videoFlag"-->
      <!--          :interactive="true"-->
      <!--          @flagged="videoFlag.flagged = true"-->
      <!--      ></laya-flag-icon>-->
    </div>

    <div class="row">
      <button
        type="button"
        class="btn btn-primary btn-lg mt-3 d-block"
        :class="langIsAr? 'float-left mr-auto': 'float-right ml-auto'"
        @click="onFinish[0]() || {}"
      >
        <span>
          {{ i18n['nextContent'] }}
          <i
            :class="langIsAr?
              'fas fa-arrow-left' :
              'fas fa-arrow-right'"
          ></i>
        </span>
      </button>
    </div>
  </div>
</template>

<script>
import Plyr from 'plyr'
import { mapGetters } from 'vuex'
import 'plyr/dist/plyr.css'
import { locale, viewPluginProps, watchContent } from '@/mixins'
import '@/styles/flaggables.css'

export default {
  name: 'LayaPlyr',

  mixins: [
    locale,
    viewPluginProps,
    watchContent
  ],

  data () {
    if (this.previewData) { // for 'preview' feature
      return { ...this.previewData }
    }
    return {
      plyr: null,
      src: '',
      title: {
        show: false,
        id: '',
        simple: '',
        text: '',
        flagged: false
      },
      videoFlag: {}
    }
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
    playerId () {
      return `ly-plyr-${Date.now()}`
    },

    /**
     * platform: returns 'youtube' or 'vimeo' depending in src
     *
     * Author: cmc
     *
     * Last Updated: January 17, 2021
     */
    platform () {
      if (this.src.includes('youtube')) return 'youtube'
      else if (this.src.includes('vimeo')) return 'vimeo'
      else return 'self-hosted'
    },

    tracks () {
      return [
        {
          kind: 'captions',
          label: 'English',
          srclang: 'en',
          src:
            'http://localhost:3001/api/storage/73ef9e89-69c4-4848-929c-56591f23bc12/download/a1f453e4-7328-4c99-a0e1-fcd18de6dff2.vtt',
          default: true
        },
        {
          kind: 'captions',
          label: 'French',
          srclang: 'fr',
          src: 'http://localhost:3001/api/storage/73ef9e89-69c4-4848-929c-56591f23bc12/download/bde12ecf-f5ef-47c6-9814-65f11f335644.vtt'
        }
      ]
    },
    sources () {
      return [
        {
          src:
            'https://filesamples.com/samples/video/mp4/sample_640x360.mp4',
          type: 'video/mp4'
        },
        {
          src: 'https://dl8.webmfiles.org/big-buck-bunny_trailer.webm',
          type: 'video/webm'
        }
      ]
    }

  },

  created () {
    if (!this.previewData) this.fetchData()
  },

  mounted () {
    this.initPlyr()
  },

  methods: {

    /**
     * Function fetchData: fetch data from vuex and make data property
     *
     * Author: cmc
     *
     * Last Updated: March 20, 2021
     */
    fetchData () {
      const idx = this.$route.params.step - 1
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
    initPlyr () {
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
      // this.plyr.source = options
    }
  }
}
</script>

<style>
</style>

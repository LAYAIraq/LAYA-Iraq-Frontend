<!--
Filename: video-view.vue
Use: View Plyr content block
Creator: core
Date: unknown
Dependencies:
  plyr,
  vuex,
  @/mixins/locale.vue
-->

<template>
  <div class="video-view">
    <div
      v-if="title.show"
      :id="title.id"
      class="flaggable row"
    >
      <h2>{{ courseSimple? title.simple : title.text }}</h2>
      <flag-icon
        v-if="!editPreview"
        :ref-data="title"
        @flagged="title.flagged = true"
      ></flag-icon>
    </div>

    <div>
      <div
        v-if="host !== 'upload'"
        id="video-player"
        :data-plyr-provider="host"
        :data-plyr-embed-id="src"
        class="plyr__video-embed"
      ></div>
      <video
        v-else
        id="video-player"
      >
        <source
          :src="src"
        />
        <track
          v-for="track in captions.tracks"
          :key="track.label"
          :default="captions.default === captions.tracks.indexOf(track)"
          :src="track.src"
          :label="track.label"
          :srclang="track.srclang"
          :kind="track.kind"
        />
      </video>
      <!--      <flag-icon v-if="!editPreview"-->
      <!--          :refData="videoFlag"-->
      <!--          :interactive="true"-->
      <!--          @flagged="videoFlag.flagged = true"-->
      <!--      ></flag-icon>-->
    </div>

    <div class="row">
      <button
        type="button"
        class="btn btn-primary btn-lg mt-3 d-block"
        :class="langIsAr? 'float-left mr-auto': 'float-right ml-auto'"
        @click="onFinish[0]() || {}"
      >
        <span>
          {{ y18n('nextContent') }}
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
import { locale, pluginView } from '@/mixins'
import '@/assets/styles/flaggables.css'
import FlagIcon from '@/components/course/flag/flag-icon.vue'

export default {
  name: 'VideoView',
  components: { FlagIcon },

  mixins: [
    locale,
    pluginView
  ],

  data () {
    return { ...this.viewData }
  },

  computed: {
    ...mapGetters([
      'courseContent',
      'courseSimple'
    ])

    // tracks () {
    //   return [
    //     {
    //       kind: 'captions',
    //       label: 'English',
    //       srclang: 'en',
    //       src: 'someurl',
    //       default: true
    //     },
    //     {
    //       kind: 'captions',
    //       label: 'French',
    //       srclang: 'fr',
    //       src: 'http://localhost:3001/api/storage/73ef9e89-69c4-4848-929c-56591f23bc12/download/bde12ecf-f5ef-47c6-9814-65f11f335644.vtt'
    //     }
    //   ]
    // },
    // sources () {
    //   return [
    //     {
    //       src:
    //         'https://filesamples.com/samples/video/mp4/sample_640x360.mp4',
    //       type: 'video/mp4'
    //     },
    //     {
    //       src: 'https://dl8.webmfiles.org/big-buck-bunny_trailer.webm',
    //       type: 'video/webm'
    //     }
    //   ]
    // }

  },

  mounted () {
    this.initPlyr()
  },

  methods: {

    /**
     * function initPlyr: initialize Plyr instance
     *
     * Author: core
     *
     * Updated: March 20, 2021
     */
    initPlyr () {
      this.plyr = new Plyr('#video-player', {
        // captions: {active: true}
      })
      // const source = this.host === 'upload'
      //   ? { src: this.src }
      //   : { src: this.src, provider: this.host }
      // const tracks = []
      // this.captions.tracks.forEach(el => {
      //   if (this.captions.default === this.captions.tracks.indexOf(el)) {
      //     console.log('this is default: ', el)
      //     el.default = true
      //   }
      //   tracks.push(el)
      // })
      // const sourceData = {
      //   type: 'video',
      //   sources: [
      //     source
      //   ],
      //   tracks: tracks
      // }
      // console.log(sourceData)
      // this.plyr.source = sourceData
      // console.log('plyr: ', this.plyr)
      /* this.plyr.source = {
        type: 'video',
        sources: [
          {
            src: this.src,
            provider: this.platform
          }
        ]  // /**
    //  * platform: returns 'youtube' or 'vimeo' depending in src
    //  *
    //  * Author: cmc
    //  *
    //  * Last Updated: January 17, 2021
    //  */
    // platform () {
    //   if (this.src.includes('youtube')) return 'youtube'
    //   else if (this.src.includes('vimeo')) return 'vimeo'
    //   else return 'upload'
    // },
    //   }
    //   this.plyr.on('ended', e => {
    //     console.log('finished playing')
    //   }) */
      // this.plyr.source = options
    }
  }
}
</script>

<style>
</style>

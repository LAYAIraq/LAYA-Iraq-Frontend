<template>
  <div class="ly-media-video position-relative">

    <div class="text text-secondary">
      <i class="far fa-lightbulb"></i>
      <a v-if="!profile.prefs.media.video" href='#'
        class="media-switch ly-focus" @click.prevent="toggleMedia('video')">
        Inhalt als Video anzeigen
      </a>
      <a v-else href='#'
        class="media-switch ly-focus" @click.prevent="toggleMedia('video')">
        Video-Inhalt verstecken
      </a>
    </div>

    <div v-show="profile.prefs.media.video" class="mt-2">
      <b-tabs nav-class="ly-focus">
        <b-tab v-for="(vid,i) in videos[lang]"
          :title="vid.title" :key="'video'+i"
          :title-link-class="'text-dark'"
          class="text-dark position-relative"
          style="box-shadow: 0px 0px 4px black">

          <ly-vid :data="vid"></ly-vid>

          <!--
          <div v-if="isUpload(vid) && !emptyVid(vid)">
            <plyr>
              <video :src="url(vid, 'src')">
                <track kind="captions" :src="url(vid, 'sub')"
                :srclang="lang" :label="lang" default>
              </video>
            </plyr>
          </div>

          <plyr v-if="!isUpload(vid) && !emptyVid(vid)">
            <div :data-plyr-provider="vid.type"
              :data-plyr-embed-id="getId(vid)"></div>
          </plyr>
          -->

          <!-- author controls -->
          <form v-if="isAuthor" class="author p-2 my-2">
            <div class="form-row">

              <!-- title -->
              <div class="col">
                <div class="form-group">
                  <div class="input-group">
                    <div class="input-group-prepend">
                      <span class="input-group-text">Titel</span>
                    </div>
                    <input id="vid-title" type="text" class="form-control"
                    placeholder="Titel" v-model="vid.title">
                  </div>
                </div>
              </div>

              <!-- type -->
              <div class="col">
                <div class="form-group">
                  <div class="input-group">
                    <div class="input-group-prepend">
                      <label for="vid-type" class="input-group-text">Typ</label>
                    </div>
                    <select id="vid-type" class="custom-select"
                      v-model="vid.type" @change="vid.src = null">
                      <option value="0">Auswählen ...</option>
                      <option value="upload">Video-Datei</option>
                      <option value="youtube">Youtube</option>
                      <option value="vimeo">Vimeo</option>
                    </select>
                  </div>
                </div>
              </div>

            </div>

            <!-- source -->
            <div class="form-row" v-if="isUpload(vid)">
              <div class="col">
                <div class="form-group">
                  <ly-input-file ph="Datei" key="vid-input"
                    v-model="vid.src">
                    <i class="fas fa-file"></i>
                  </ly-input-file>
                </div>
              </div>
            </div>

            <div class="form-row" v-if="!isUpload(vid) && isChosen(vid)">
              <div class="col">
                <div class="form-group">

                  <div class="input-group">
                    <div class="input-group-prepend">
                      <span class="input-group-text">Quelle</span>
                    </div>
                    <input id="vid-title" type="text" class="form-control"
                    :placeholder="ph(vid)" v-model="vid.src">
                  </div>

                </div>
              </div>
            </div>

            <!-- subs -->
            <div class="form-row" v-if="isUpload(vid)">
              <div class="col">
                <div class="form-group">
                  <ly-input-file ph="Untertitel" key="sub-input"
                    v-model="vid.sub">
                    <i class="fas fa-closed-captioning"></i>
                  </ly-input-file>
                </div>
              </div>
            </div>

            <!-- audio description -->
            <div class="form-row" v-if="isUpload(vid)">
              <div class="col">
                <div class="form-group">
                  <ly-input-file ph="Audiodeskription" key="ad-input"
                    v-model="vid.ad">
                    <i class="fas fa-audio-description"></i>
                  </ly-input-file>
                </div>
              </div>
            </div>

            <!-- passive videos -->
            <div class="form-row" v-if="isUpload(vid)">
              <div class="col">
                <h4>
                  Passiv Videos
                  <button type="button" class="btn btn-sm btn-primary"
                    @click="addPassiv(vid)"><i class="fas fa-plus"></i></button>
                </h4>
                <div v-for="(add,j) in vid.adds" class="form-group">
                  <ly-input-file :ph="'Passiv Video '+(j+1)" :key="'add-input'+j"
                    v-model="vid.adds[j]" class="d-inline-block w-75">
                    <i class="fas fa-file"></i>
                  </ly-input-file>
                  <button type="button" class="btn btn-sm btn-danger"
                    @click="delPassiv(vid,j)">
                    <i class="fas fa-exclamation"></i> Löschen
                  </button>
                </div>
              </div>
            </div>

            <hr>
            <div class="form-row">

              <!-- save -->
              <div class="col">
                <div class="form-group text-left">
                  <button type="button" class="btn btn btn-primary"
                    @click="save" :disabled="upload">
                    <i class="fas fa-check"></i> Speichern
                  </button>
                </div>
              </div>

              <!-- delete -->
              <div class="col">
                <div class="form-group text-right">
                  <button type="button" class="btn btn-sm btn-danger"
                    @click="delVideo(i)" :disabled="upload">
                    <i class="fas fa-exclamation-triangle"></i> Löschen
                  </button>
                </div>
              </div>

            </div>
            <div class="form-row">
              <div class="col">

                <!-- upload indicator -->
                <div class="progress" v-if="upload">
                  <div class="progress-bar progress-bar-striped progress-bar-animated"
                    :aria-valuenow="progress" aria-valuemin="0" aria-valuemax="100"
                    :style="{width: progress + '%'}" role="progressbar">
                    {{ progress + '%' }}
                  </div>
                </div>

              </div>
            </div>
          </form>

        </b-tab>

        <!-- author controls -->
        <b-nav-item v-if="isAuthor" slot="tabs"
          @click.prevent="addVideo()" href="#" style="border-color: lightskyblue">
          <i class="fas fa-plus fa-lg"></i>
        </b-nav-item>

        <div slot="empty" class="text-center text-muted">
          <h4>Noch keine Videos</h4>
        </div>
      </b-tab>
    </b-tabs>

    <div id="vid-lang-dd" v-if="isAuthor" class="author">
      <ly-lang-dd :onChoose="setLang"></ly-lang-dd>
    </div>
  </div>

  <!-- media type hint -->
  <span v-if="isAuthor" class="hint text-primary">
    <i class="fas fa-video"></i>
  </span>
</div>

</template>

<script>
import {mapState, mapGetters, mapMutations} from 'vuex'
import { Plyr } from 'vue-plyr'

import http from 'axios'
import api from '../backendURL.ts'

import lyLangDd from '@comps/lang-dd'
import lyInputFile from '@comps/input-file'
import lyVid from '@comps/vid'

import {Tabs} from 'bootstrap-vue/es/components'
import bNavItem from 'bootstrap-vue/es/components/nav/nav-item'

export default {
  name: 'ly-media-video',
  created () {
    this.contents.forEach(c => this.videos[c.lang].push(...c.videos))
    this.setLang('de')
  },
  data () {
    return {
      videos: {
        de: [],
        es: [],
        it: [],
        pl: [],
        nl: []
      },

      msg: '',
      lang: '',
      upload: false,
      progress: 0
    }
  },
  props: {
    contents: Array,
    update: Function
  },
  computed: {
    ...mapState(['profile']),
    ...mapGetters(['isAuthor'])
  },
  methods: {
    ...mapMutations(['toggleMedia']),
    /*
     * safety checks */
    emptyVid: function ({src}) {
      return src === null || src === ''
    },
    isUpload: function ({type}) {
      return type === 'upload'
    },
    isChosen: function ({type}) {
      return type !== '0'
    },

    /*
     * author controls */
    setLang: function (lang) {
      this.lang = lang
    },
    addVideo: function () {
      this.videos[this.lang].push({
        type: '0',
        src: null,
        sub: null,
        ad: null,
        adds: [],
        title: `Video ${this.videos[this.lang].length + 1}`
      })
    },
    delVideo: function (i) {
      this.videos[this.lang].splice(i, 1)
    },
    addPassiv: function (vid) {
      vid.adds.push(null)
    },
    delPassiv: function (vid, i) {
      vid.adds.splice(i, 1)
    },
    ph: function ({type}) {
      if (type === 'youtube') {
        return 'https://www.youtube.com/watch?v=WEkSYw3o5is'
      }

      if (type === 'vimeo') {
        return 'https://vimeo.com/23608259'
      }
    },
    save: function () {
      /*
       * upload files first */
      let videos = this.videos[this.lang]

      let files = []
      /* add potential files */
      videos.forEach(({src, sub, ad, adds}) => files.push(src, sub, ad, ...adds))
      files = files
        .filter(f => f) /* filter null */
        .filter(f => typeof f === 'object') /* filter files */

      if (files.length === 0) {
        /*
         * update structure only */
        console.log('Update video structure')
        this.update({videos}, this.lang)
        return
      }

      const data = new FormData()
      files.forEach(file => data.append('file', file))
      this.upload = true
      this.progress = 0
      http.post(`storage/${this.$route.params.id}/upload`, data, {
        onUploadProgress: (e) => {
          this.progress = Math.round(e.loaded * 100 / e.total)
        }
      }).then(files => {
        console.log('Upload done')
        /*
         * update content */
        videos.forEach(vid => {
          vid.src = this.getFileName(vid.src)
          vid.sub = this.getFileName(vid.sub)
          vid.ad = this.getFileName(vid.ad)
          vid.adds = vid.adds.map(v => v.name)
        })
        this.update({videos}, this.lang)
      }).catch(err => console.error(err))
        .then(() => { this.upload = false })
    },
    getFileName: function (obj) {
      return (obj !== null && typeof obj === 'object') ? obj.name : obj
    },

    /*
     * media output */
    url: function (obj, type) {
      if (this.emptyVid(obj)) return

      /* vid | sub | ad */
      let media = obj[type]

      if (typeof media === 'string') { /* file in backend */
        return `${api()}/storage/${this.$route.params.id}/download/${media}`
      }

      if (typeof media === 'object') { /* file in cache */
        return URL.createObjectURL(media)
      }
    },
    getId: function ({src, type}) {
      if (type === 'youtube') {
        return src.split('v=')[1].split('&')[0]
      }

      if (type === 'vimeo') {
        return src.split('/').slice(-1)[0]
      }
    }
  },
  components: {
    lyLangDd, lyInputFile, lyVid, Plyr, Tabs, bNavItem
  }
}
</script>

<style scoped>
#vid-lang-dd {
  position: absolute;
  top: 0px;
  right: 0px;
}

.author {
  border: 5px solid lightskyblue;
  background-color: #ccebff;
}

.hint {
  position: absolute;
  top: 0;
  left: -2rem;
}

.media-switch {
  color: #444;
  text-decoration: underline;
}
</style>

<!--
Filename: video-edit.vue
Use: Edit Plyr content block
Creator: core
Date: unknown
Dependencies:
  vuex,
  @/mixins/locale.vue
-->

<template>
  <div
    :class="langIsAr? 'text-right' : 'text-left'"
  >
    <form>
      <div class="row">
        <div class="col">
          <h4 class="d-inline-block mr-auto">
            {{ y18n('videoPlayer.name') }}
          </h4>
          <i
            id="questionmark"
            v-b-tooltip.auto
            class="fas fa-question-circle"
            :title="y18n('showTip')"
            aria-labelledby="tooltipText"
            aria-live="polite"
            @click="toggleTip"
          ></i>
        </div>
      </div>

      <b-jumbotron
        v-if="tooltipOn"
        id="tooltipText"
        :header="y18n('videoPlayer.name')"
        :lead="y18n('tipHeadline')"
      >
        <hr class="my-4">
        <p
          v-for="str in y18n('videoPlayer.tooltip').split(';')"
          :key="str.length"
        >
          <!-- eslint-disable-next-line vue/no-v-html --> <!-- TODO: find a way to avoid v-html -->
          <span v-html="replacePattern(str, /###([\w\s\-]+)###([A-Z0-9a-z\/.:#]+)###/, linkReplacement(true))"></span>
        </p>
      </b-jumbotron>

      <hr>
      <!-- title -->
      <content-title-edit
        :title="title"
        @set-title="title = $event"
      >
      </content-title-edit>

      <!-- video url -->
      <div class="form-group row">
        <label
          for="vid-id"
          class="col-2 col-form-label"
        >
          {{ y18n('videoPlayer.url') }}
        </label>
        <div class="col">
          <input
            id="vid-id"
            v-model="src"
            type="text"
            class="form-control"
            :placeholder="y18n('videoPlayer.placeholder')"
          >
        </div>
      </div>

      <!-- video props -->
      <div class="form-group row">
        <span class="col-2 col-form-label">
          {{ y18n('videoPlayer.platform') }}
        </span>
        <div class="col-5 form-check form-check-inline align-text-top">
          <input
            id="platform-upload"
            :checked="host === 'upload'"
            class="form-check-input"
            :class="langIsAr ? 'mr-3' : 'ml-3'"
            type="radio"
            name="platform"
            @click="setHost('upload')"
          >
          <label
            for="platform-upload"
            class="form-check-label"
            :class="langIsAr ? 'ml-3' : 'mr-3'"
          >
            {{ y18n('videoPlayer.upload') }}
          </label>
          <input
            id="platform-vimeo"
            :checked="host === 'vimeo'"
            class="form-check-input"
            type="radio"
            name="platform"
            @click="setHost('vimeo')"
          >
          <label
            for="platform-vimeo"
            class="form-check-label"
            :class="langIsAr ? 'ml-3' : 'mr-3'"
          >
            {{ y18n('videoPlayer.vimeo') }}
          </label>
          <input
            id="platform-yt"
            :checked="host === 'youtube'"
            class="form-check-input"
            type="radio"
            name="platform"
            @click="setHost('youtube')"
          >
          <label
            for="platform-yt"
            class="form-check-label"
            :class="langIsAr ? 'ml-3' : 'mr-3'"
          >
            {{ y18n('videoPlayer.youtube') }}
          </label>
        </div>

        <!-- URL warning -->
        <div
          v-if="urlMsg"
          id="url-hint"
          class="col form-check form-check-inline align-text-top"
        >
          <span class="text-danger form-control-plaintext text-right">
            {{ urlMsg }}
          </span>
        </div>
      </div>

      <!-- caption tracks -->
      <div
        v-if="host === 'upload'"
        id="caption-input"
        class="form-group"
      >
        <h4 class="mb-4 mt-4">
          {{ y18n('captionTypes.captions') }}
        </h4>

        <b-table
          :items="captions.tracks"
          :fields="fields"
          responsive
          stacked="sm"
        >
          <!-- Type Column -->
          <template #cell(type)="row">
            <b-select v-model="row.item.kind">
              <b-select-option :value="null">
                {{ y18n('videoPlayer.captions.chooseType') }}
              </b-select-option>
              <b-select-option
                v-for="type in captionTypes"
                :key="type"
                :value="type"
              >
                {{ y18n(`captionTypes.${type}`) }}
              </b-select-option>
            </b-select>
          </template>

          <!-- Label Column -->
          <template #cell(label)="row">
            <input
              v-model="row.item.label"
              class="form-control"
              type="text"
              :placeholder="y18n('videoPlayer.captions.label')"
            >
          </template>

          <!-- Language Column -->
          <template #cell(lang)="row">
            <input
              v-model="row.item.srclang"
              class="form-control"
              type="text"
              :placeholder="y18n('videoPlayer.captions.lang')"
            >
          </template>

          <!-- Source Column -->
          <template #cell(src)="row">
            <input
              v-model="row.item.src"
              class="form-control"
              type="text"
              :placeholder="y18n('videoPlayer.captions.src')"
            >
          </template>

          <!-- Default Column -->
          <template #cell(default)="row">
            <input
              type="radio"
              :checked="captions.default === row.index"
              @click="makeDefault(row.index)"
            >
          </template>

          <!-- Actions Column -->
          <template #cell(actions)="row">
            <b-button
              variant="danger"
              @click.prevent="removeCaption(row.index)"
            >
              <i class="fas fa-times"></i>
              <span class="sr-only">
                {{ y18n('delete') }}
              </span>
            </b-button>
          </template>
        </b-table>

        <!-- Add Caption Button -->
        <b-button
          id="add-caption"
          variant="success"
          class="mt-3"
          @click.prevent="addCaption"
        >
          <i class="fas fa-plus-circle"></i>
          {{ y18n('videoPlayer.captions.add') }}
        </b-button>
      </div>
    </form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { locale, pluginEdit, routes, tooltipIcon } from '@/mixins'
import { deepCopy } from '@/mixins/general/helpers'
import ContentTitleEdit from '@/components/helpers/content-title-edit'

export default {
  name: 'VideoEdit',
  components: { ContentTitleEdit },
  mixins: [
    routes,
    pluginEdit,
    locale,
    tooltipIcon
  ],

  data () {
    return {
      src: '',
      host: '',
      title: {
        text: '',
        flagged: false,
        show: false,
        id: ''
      },
      videoFlag: {
        flagged: false,
        id: ''
      },
      captions: {
        default: null,
        tracks: []
      },
      fields: []
    }
  },

  computed: {
    ...mapGetters(['courseContent']),
    /**
     * urlMsg: return warning if URL is not supported
     *
     * Author: cmc
     *
     * Last Updated: April 1, 2022
     */
    urlMsg () {
      if (!this.correctURL && this.validUrl) {
        return this.y18n('videoPlayer.wrongPlatform')
      } else if (!this.correctURL) {
        const choices = {
          upload: this.y18n('videoPlayer.wrongURL'),
          vimeo: this.y18n('videoPlayer.wrongVimeoId'),
          youtube: this.y18n('videoPlayer.wrongYoutubeId')
        }
        return choices[this.host]
      } else if (this.host === 'upload' && (this.validYtUrl || this.validVimeoUrl)) {
        return this.y18n('videoPlayer.wrongPlatform')
      } else {
        return null
      }
    },

    /**
     * correctURL: checks if video is on yt or vimeo
     *
     * Author: cmc
     *
     * Last Updated: March 31, 2022
     */
    correctURL () {
      if (this.host === 'upload') {
        return this.validUrl
      } else if (this.host === 'vimeo') {
        return this.validVimeoUrl
      } else if (this.host === 'youtube') {
        return this.validYtUrl
      } else { // no input set yet
        return true
      }
    },

    /**
     * captionTypes: returns the W3C caption types excluding metadata
     * @returns {[string, string, string, string]}
     */
    captionTypes () {
      return [
        'subtitles',
        'captions',
        'descriptions',
        'chapters'
      ]
    },

    /**
     * function validUrl: check if string is a valid URL according to RFC 3886
     *
     * Author: cmc
     *
     * Last Updated: March 31, 2022
     */
    validUrl () {
      if (this.src === '') return false
      let url
      try {
        // eslint-disable-next-line prefer-const
        url = new URL(this.src)
      } catch (_) {
        return false
      }
      return url.protocol === 'http:' || url.protocol === 'https:'
    },

    /**
     * function validVimeoUrl: check if URL contains vimeo or consists of Numbers
     *
     * Author: cmc
     *
     * Last Updated: March 31, 2022
     */
    validVimeoUrl () {
      return (this.validUrl)
        ? this.src.includes('vimeo')
        : /^\d+$/.test(this.src) // matcher for vimeo IDs
    },

    /**
     * function validYtUrl: check if URL contains youtu or consists of Numbers
     *
     * Author: cmc
     *
     * Last Updated: March 31, 2022
     */
    validYtUrl () {
      return (this.validUrl)
        ? this.src.includes('youtu')
        : (/^([0-9a-zA-Z]|-)+$/.test(this.src) && this.src.length === 11) // matcher for yt IDs
    }
  },

  created () {
    if (this.edit) {
      this.fetchData()
    }
    this.fields = [
      { key: 'type', label: this.y18n('type') },
      { key: 'label', label: this.y18n('videoPlayer.captions.label') },
      { key: 'lang', label: this.y18n('videoPlayer.captions.lang') },
      { key: 'src', label: this.y18n('videoPlayer.captions.src') },
      { key: 'default', label: this.y18n('videoPlayer.captions.default') },
      { key: 'actions', label: '' }
    ]
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
      // create deep copy of store object to manipulate in vue instance
      const preData = deepCopy(this.courseContent[this.pathId])
      this.src = preData.src
      this.host = preData.host
      this.title = preData.title
      this.showTitle = preData.showTitle
      this.captions = preData.captions ?? {
        default: null,
        tracks: []
      }
    },
    /**
     * function addCaption: add caption object to caption tracks array
     *
     * Author: cmc
     *
     * Last Updated: April 1, 2022
     */
    addCaption () {
      this.captions.tracks.push({
        kind: null,
        label: '',
        srclang: '',
        src: ''
      })
    },

    /**
     * function makeDefault: make element at index i the default track
     *
     * Author: cmc
     *
     * Last Updated: April 1, 2022
     * @param {number} i index for new default element
     */
    makeDefault (i) {
      this.captions.default = i
    },

    /**
     * function removeCaption: remove caption at given index
     *
     * Author: cmc
     *
     * Last Updated: April 1, 2022
     * @param {number} idx index at which to delete
     */
    removeCaption (idx) {
      this.captions.tracks.splice(idx, 1)
    },

    /**
     * function setHost: set host variable to val
     *
     * Author: cmc
     *
     * Last Updated: March 31, 2022
     * @param {string} str one of 'youtube', 'vimeo' or 'upload'
     */
    setHost (str) {
      this.host = str
    }
  }
}
</script>

<style scoped>
  .helptext {
    border: 1px green;
    padding: 5px;
  }
  .helptext i {
    float: start;
    margin-right: 10px;
  }
  .form-check-input[disabled] ~ .form-check-label{
    color: #212529 !important;
  }
</style>

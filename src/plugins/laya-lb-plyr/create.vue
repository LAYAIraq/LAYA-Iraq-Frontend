<!--
Filename: create.vue
Use: Create new Plyr content block
Creator: cmc
Date: January 17, 2021
Dependencies: @/mixins/locale.vue
-->

<template>
  <div
    :class="langIsAr? 'text-right' : 'text-left'"
  >
    <form>
      <div class="form-group row">
        <h4 class="d-inline-block mr-auto">
          {{ i18n['layaPlyr.name'] }}
        </h4>
        <i
          id="questionmark"
          v-b-tooltip.auto
          class="fas fa-question-circle"
          :title="i18n['showTip']"
          @click="toggleTip"
        ></i>
      </div>

      <b-jumbotron
        v-if="tooltipOn"
        id="helptext"
        :header="i18n['layaPlyr.name']"
        :lead="i18n['tipHeadline']"
      >
        <hr class="my-4">
        <p
          v-for="str in i18n['layaPlyr.tooltip'].split(';')"
          :key="str.length"
        >
          {{ str }}
        </p>
      </b-jumbotron>

      <hr>

      <div class="form-group">
        <div class="row">
          <!-- title -->
          <label
            for="laya-plyr-title"
            class="col col-form-label"
          >
            {{ i18n['title'] }}
          </label>
          <div class="form-group col-8">
            <input
              id="laya-plyr-title"
              v-model="title.text"
              type="text"
              class="form-control"
              :placeholder="i18n['titlePlaceholder']"
            >
          </div>
          <div
            id="show-title-button"
            class="form-group col"
          >
            <label
              for="show-title-tick"
              class="col col-form-label"
            >
              {{ i18n['showTitle'] }}
              <input
                id="show-title-tick"
                v-model="title.show"
                type="checkbox"
              >
            </label>
          </div>
        </div>
        <div
          v-if="courseSimple"
          class="row"
        >
          <!-- simple title -->
          <label
            for="laya-plyr-title-simple"
            class="col-2 col-form-label"
          >
            <span class="sr-only">
              {{ i18n['simpleAlt'] }}
            </span>
          </label>
          <div class="form-group col-8">
            <input
              id="laya-plyr-title-simple"
              v-model="title.simple"
              type="text"
              class="form-control"
              :placeholder="i18n['simpleAlt']"
            >
          </div>
        </div>
      </div>

      <!-- video url -->
      <div class="form-group row">
        <label
          for="vid-id"
          class="col-2 col-form-label"
        >
          {{ i18n['layaPlyr.url'] }}
        </label>
        <div class="col">
          <input
            id="vid-id"
            v-model="src"
            type="text"
            class="form-control"
            :placeholder="i18n['layaPlyr.placeholder']"
          >
        </div>
      </div>

      <!-- video props -->
      <div class="form-group row">
        <span class="col-2 col-form-label">
          {{ i18n['layaPlyr.platform'] }}
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
            {{ i18n['layaPlyr.upload'] }}
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
            {{ i18n['layaPlyr.vimeo'] }}
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
            {{ i18n['layaPlyr.youtube'] }}
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
          {{ i18n['captionTypes.captions'] }}
        </h4>
        <!-- table header -->
        <div
          id="caption-input-header"
          class="row mb-3"
        >
          <div class="col-2">
            {{ i18n['type'] }}
          </div>
          <div class="col">
            {{ i18n['layaPlyr.captions.label'] }}
          </div>
          <div class="col-1">
            {{ i18n['layaPlyr.captions.lang'] }}
          </div>
          <div class="col">
            {{ i18n['layaPlyr.captions.src'] }}
          </div>
          <div class="col-1">
            {{ i18n['layaPlyr.captions.default'] }}
          </div>
          <div class="col-1"></div> <!-- placeholder for alignment -->
        </div>
        <!-- input fields -->
        <div
          v-for="(track, i) in captions.tracks"
          :key="`track-${i}`"
          class="row"
        >
          <!-- caption type -->
          <div class="col-2">
            <label
              class="form-check-label sr-only"
              :for="`type-select-${i}`"
            >
              {{ i18n['type'] }}
            </label>
            <b-select
              :id="`type-select-${i}`"
              v-model="track.kind"
            >
              <b-select-option value="null">
                {{ i18n['layaPlyr.captions.chooseType'] }}
              </b-select-option>
              <b-select-option
                v-for="type in captionTypes"
                :key="type"
                :value="type"
              >
                {{ i18n[`captionTypes.${type}`] }}
              </b-select-option>
            </b-select>
          </div>
          <!-- caption label -->
          <div class="col">
            <label
              :for="`label-input-${i}`"
              class="form-check-label sr-only"
            >
              {{ i18n['layaPlyr.captions.label'] }}
            </label>
            <input
              :id="`label-input-${i}`"
              v-model="track.label"
              class="form-control"
              type="text"
              :placeholder="i18n['layaPlyr.captions.label']"
            >
          </div>
          <!-- caption language -->
          <div class="col-1">
            <label
              :for="`srclang-input-${i}`"
              class="form-check-label sr-only"
            >
              {{ i18n['layaPlyr.captions.lang'] }}
            </label>
            <input
              :id="`srclang-input-${i}`"
              v-model="track.srclang"
              class="form-control"
              type="text"
              :placeholder="i18n['layaPlyr.captions.lang']"
            >
          </div>
          <!-- caption source -->
          <div class="col">
            <label
              :for="`src-input-${i}`"
              class="form-check-label sr-only"
            >
              {{ i18n['layaPlyr.captions.src'] }}
            </label>
            <input
              :id="`src-input-${i}`"
              v-model="track.src"
              class="form-control"
              type="text"
              :placeholder="i18n['layaPlyr.captions.src']"
            >
          </div>
          <!-- caption default -->
          <div class="col-1">
            <label
              :for="`default-check-${i}`"
              class="col-form-label sr-only"
            >
              {{ i18n['layaPlyr.captions.default'] }}
            </label>
            <input
              :id="`default-check-${i}`"
              class="ml-auto mr-auto"
              type="radio"
              :checked="captions.default === i"
              @click="makeDefault(i)"
            >
          </div>
          <!-- delete button -->
          <div class="col-1">
            <b-button
              :id="`delete-button-${i}`"
              v-b-tooltip.auto
              class="m-auto"
              variant="danger"
              :title="i18n['delete']"
              @click.prevent="removeCaption(i)"
            >
              <i class="fas fa-times-circle"></i>
              <span class="sr-only">
                {{ i18n['delete'] }}
              </span>
            </b-button>
          </div>
        </div>
        <!-- table footer -->
        <div
          id="caption-input-footer"
          class="row mt-3"
        >
          <b-button
            id="add-caption"
            variant="success"
            class="m-auto"
            @click.prevent="addCaption"
          >
            <i class="fas fa-plus-circle"></i>
            {{ i18n['layaPlyr.captions.add'] }}
          </b-button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import { locale, tooltipIcon } from '@/mixins'
import { v4 as uuidv4 } from 'uuid'
import captionTypes from '@/misc/caption-types'

export default {
  name: 'LayaPlyrNew',

  mixins: [
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
      }
    }
  },

  computed: {

    /**
     * urlMsg: return warning if URL is not supported
     *
     * Author: cmc
     *
     * Last Updated: April 1, 2022
     */
    urlMsg () {
      if (!this.correctURL && this.validUrl) {
        return this.i18n['layaPlyr.wrongPlatform']
      } else if (!this.correctURL) {
        const choices = {
          upload: this.i18n['layaPlyr.wrongURL'],
          vimeo: this.i18n['layaPlyr.wrongVimeoId'],
          youtube: this.i18n['layaPlyr.wrongYoutubeId']
        }
        return choices[this.host]
      } else if (this.host === 'upload' && (this.validYtUrl || this.validVimeoUrl)) {
        return this.i18n['layaPlyr.wrongPlatform']
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
      return captionTypes
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
     * function validYtUrl: check if URL contains vimeo or consists of Numbers
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
    this.title.id = uuidv4()
    this.videoFlag.id = uuidv4()
  },

  methods: {
    // /**
    //  * function checkURL: check if video is from youtube or vimeo
    //  *
    //  * Author: cmc
    //  *
    //  * Last Updated: January 17, 2021
    //  */
    // checkURL () {
    //   (this.correctURL && this.src.includes('youtube'))
    //     ? this.youtube = true
    //     : this.youtube = false
    // },
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
  #questionmark {
  float: end;
  cursor: pointer;
  }
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

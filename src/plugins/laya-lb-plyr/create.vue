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
          v-b-tooltip.left
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
            id="platform-self-hosted"
            :checked="host === 'self-hosted'"
            class="form-check-input"
            :class="langIsAr ? 'mr-3' : 'ml-3'"
            type="radio"
            name="platform"
            @click="setHost('self-hosted')"
          >
          <label
            for="platform-self-hosted"
            class="form-check-label"
            :class="langIsAr ? 'ml-3' : 'mr-3'"
          >
            {{ i18n['layaPlyr.selfHosted'] }}
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

        <div
          v-if="!correctURL"
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
        v-if="host === 'self-hosted'"
        id="caption-input"
        class="form-group"
      >
        <h4 class="mb-4 mt-4">
          {{ i18n['captionTypes.captions'] }}
        </h4>
        <div
          v-for="(track, i) in captions"
          :key="`track-${i}`"
          class="row"
        >
          <!-- caption type -->
          <div class="col">
            <label
              class="form-check-label"
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
          <div class="col">
            <label
              :for="`label-input-${i}`"
              class="form-check-label"
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
          <div class="col"></div>
          <div class="col"></div>
          <div class="col"></div>
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
      captions: [{
        kind: null,
        label: '',
        srclang: '',
        src: ''
      }],
      captionTypes: captionTypes
    }
  },

  computed: {

    /**
     * urlMsg: return warning if URL is not supported
     *
     * Author: cmc
     *
     * Last Updated: January 17, 2021
     */
    urlMsg () {
      return this.correctURL
        ? ''
        : this.i18n['layaPlyr.wrongURL']
    },

    /**
     * correctURL: checks if video is on yt or vimeo
     *
     * Author: cmc
     *
     * Last Updated: January 17, 2021
     */
    correctURL () {
      if (this.host === 'self-hosted') {
        return this.validUrl(this.src)
      } else if (this.host === 'vimeo') {
        return this.validVimeoUrl()
      } else if (this.host === 'youtube') {
        return this.validYtUrl()
      } else { // no input set yet
        return true
      }
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
     * function setHost: set host variable to val
     *
     * Author: cmc
     *
     * Last Updated: March 31, 2022
     * @param {string} str one of 'youtube', 'vimeo' or 'self-hosted'
     */
    setHost (str) {
      this.host = str
    },
    /**
     * function validUrl: check if string is a valid URL according to RFC 3886
     *
     * Author: cmc
     *
     * Last Updated: March 31, 2022
     * @param {string} str string that needs to be checked
     */
    validUrl (str) {
      let url
      try {
        // eslint-disable-next-line prefer-const
        url = new URL(str)
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
      return (this.validUrl(this.src))
        ? this.src.includes('vimeo')
        : /^\d+$/.test(this.src)
    },

    /**
     * function validYtUrl: check if URL contains vimeo or consists of Numbers
     *
     * Author: cmc
     *
     * Last Updated: March 31, 2022
     */
    validYtUrl () {
      return (this.validUrl(this.src))
        ? this.src.includes('youtu')
        : (/^([0-9a-zA-Z]|-)+$/.test(this.src) && this.src.length === 11) // matcher for yt URLs
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

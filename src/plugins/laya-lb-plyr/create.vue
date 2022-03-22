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
        <p>
          {{ i18n['layaPlyr.tooltip'] }}
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
            @blur="checkURL"
          >
        </div>
      </div>

      <!-- video props -->
      <div class="form-group row">
        <label
          for="platform-vimeo"
          class="col-2 col-form-label"
        >
          {{ i18n['layaPlyr.platform'] }}
        </label>

        <div class="col-2 form-check form-check-inline align-text-top">
          <input
            id="platform-vimeo"
            :checked="!youtube"
            class="form-check-input"
            type="radio"
            name="platform"
            disabled
          >
          <label
            for="platform-vimeo"
            class="form-check-label"
          >
            {{ i18n['layaPlyr.vimeo'] }}
          </label>
        </div>
        <div class="col-2 form-check form-check-inline align-text-top">
          <input
            id="platform-yt"
            :checked="youtube"
            class="form-check-input"
            type="radio"
            name="platform"
            disabled
          >
          <label
            for="platform-yt"
            class="form-check-label"
          >
            {{ i18n['layaPlyr.youtube'] }}
          </label>
        </div>

        <div class="col form-check form-check-inline align-text-top">
          <span class="text-danger form-control-plaintext text-right"> {{ urlMsg }}</span>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import { locale, tooltipIcon } from '@/mixins'
import { v4 as uuidv4 } from 'uuid'

export default {
  name: 'LayaPlyrNew',

  mixins: [
    locale,
    tooltipIcon
  ],

  data () {
    return {
      src: '',
      youtube: false,
      title: {
        text: '',
        flagged: false,
        show: false,
        id: ''
      },
      videoFlag: {
        flagged: false,
        id: ''
      }
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
      return this.correctURL ? '' : this.i18n['layaPlyr.wrongURL']
    },

    /**
     * correctURL: checks if video is on yt or vimeo
     *
     * Author: cmc
     *
     * Last Updated: January 17, 2021
     */
    correctURL () {
      return (this.src.includes('youtube') || this.src.includes('vimeo'))
    }
  },

  created () {
    this.title.id = uuidv4()
    this.videoFlag.id = uuidv4()
  },

  methods: {

    /**
     * function checkURL: check if video is from youtube or vimeo
     *
     * Author: cmc
     *
     * Last Updated: January 17, 2021
     */
    checkURL () {
      (this.correctURL && this.src.includes('youtube'))
        ? this.youtube = true
        : this.youtube = false
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

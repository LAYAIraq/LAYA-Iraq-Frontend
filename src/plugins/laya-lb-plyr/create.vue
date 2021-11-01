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
          class="fas fa-question-circle" 
          @click="toggleTip" 
          :title="i18n['showTip']" 
          v-b-tooltip.left
        ></i>
      </div>

        <b-jumbotron 
            v-if="tooltipOn"
            :header="i18n['layaPlyr.name']" 
            :lead="i18n['tipHeadline']">
          <hr class="my-4">
          <p v-html="i18n['layaPlyr.tooltip']"></p>

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
              type="text"
              v-model="title.text"
              class="form-control"
              :placeholder="i18n['titlePlaceholder']"
            >
          </div>
          <div class="form-group col" id="show-title-button">
            <label
              for="show-title-tick"
              class="col col-form-label"
            >
              {{ i18n['showTitle'] }}
              <input
                id="show-title-tick"
                type="checkbox"
                v-model="title.show"
              >
            </label>
          </div>

          </div>
        <div
          class="row"
          v-if="courseSimple"
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
              type="text"
              v-model="title.simple"
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
            type="text"
            v-model="src"
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
            class="form-check-input"
            type="radio"
            name="platform"
            :value="false"
            v-model="youtube"
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
            class="form-check-input"
            type="radio"
            name="platform"
            :value="true"
            v-model="youtube"
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
  name: 'laya-plyr-new',

  mixins: [
    locale,
    tooltipIcon
  ],

  computed: {

    /**
     * urlMsg: return warning if URL is not supported
     * 
     * Author: cmc
     * 
     * Last Updated: January 17, 2021
     */
    urlMsg () {
      return this.correctURL? '' : this.i18n['layaPlyr.wrongURL']
    },

    /**
     * correctURL: checks if video is on yt or vimeo
     * 
     * Author: cmc
     * 
     * Last Updated: January 17, 2021
     */
    correctURL() {
      return (this.src.includes('youtube') || this.src.includes('vimeo') )
    }
  },

  data() {
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
  
  methods: {

    /**
     * function checkURL: check if video is from youtube or vimeo
     * 
     * Author: cmc
     * 
     * Last Updated: January 17, 2021
     */
    checkURL() {
      (this.correctURL && this.src.includes('youtube')) ?
          this.youtube = true :
          this.youtube = false
    }
  },

  created() {
    this.title.id = uuidv4()
    this.videoFlag.id = uuidv4()
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

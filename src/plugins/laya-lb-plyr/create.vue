<!--
Filename: create.vue 
Use: Create new Plyr content block
Creator: cmc
Date: January 17, 2021
Dependencies: @/mixins/locale.vue
-->

<template>

  <div 
    class="laya-plyr-create"
    :class="langIsAr? 'text-right' : 'text-left'"
  >

    <form>
      <div class="form-group">
        <label for="vid-id">
          <h4>
            {{ i18n['layaPlyr.name'] }}
          </h4>
        </label> 
        <i 
          id="questionmark" 
          class="fas fa-question-circle" 
          @click="toggleTip" 
          :title="i18n['showTip']" 
          v-b-tooltip.left
        ></i>

        <b-jumbotron 
            v-if="tooltipOn"
            :header="i18n['layaPlyr.name']" 
            :lead="i18n['tipHeadline']">
          <hr class="my-4">
          <p v-html="i18n['layaPlyr.tooltip']"></p>

        </b-jumbotron>

        <div class="form-group row">  
          <div class="form-group col-10"> 
            <label 
              for="laya-plyr-title" 
            >
              {{ i18n['title'] }}
            </label>
            
            <input 
              id="laya-plyr-title"
              type="text"
              v-model="title"
              class="form-control"
              :placeholder="i18n['titlePlaceholder']"
            >
          </div>
          <div class="form-group col" id="show-title-button">
            <div style="height: calc(1.5em + .75rem + 2px);"></div>
            <label
              for="show-title-tick"
              class="col"
            >
              {{ i18n['showTitle'] }}
              <input
                id="show-title-tick"
                type="checkbox"
                v-model="showTitle"
              >
            </label>
              
            
          </div>
        </div>

        
        <div class="form-group-row">
          <input id="vid-id"
              type="text"
              v-model="src"
              class="form-control"
              :placeholder="i18n['layaPlyr.placeholder']"
              @blur="checkURL"
              >
        </div>


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
        
      </div>

    </form>
      
  </div>

</template>

<script>
import { locale, tooltipIcon } from '@/mixins'

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
      title: '',
      showTitle: false
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
      if (this.correctURL && this.src.includes('youtube')) this.youtube = true
      else this.youtube = false
    }
  },
}
</script>

<style scoped>
  #questionmark {
  float: inline-end;
  cursor: pointer;
  }
  .helptext {
    border: 1px;
    border-color: green;
    padding: 5px;
  }
  .helptext i {
    float: inline-start;
    margin-right: 10px;
  }
  .form-check-input[disabled] ~ .form-check-label{
    color: #212529 !important;
  }
</style>

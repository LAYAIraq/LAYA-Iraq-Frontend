<!--
Filename: create.vue 
Use: Create new Plyr content block
Creator: cmc
Date: January 17, 2021
Dependencies: @/i18n/plugins/misc/laya-plyr
-->

<template>

  <div class="laya-plyr-create">

    <form>
      <div class="form-group">
        <label for="vid-id"><h4>{{ i18n.video }}</h4></label> 
        <i id="questionmark" class="fas fa-question-circle" @click="toggleTip" 
          :title="i18n.showTip" v-b-tooltip.left></i>
       <!--  <div class="helptext" v-if="tooltipOn">
          <i class="far fa-clipboard"></i><h4>{{ i18n.tipHeadline }}</h4>
          <p  v-html="i18n.tooltip"></p>
        </div> -->
        <b-jumbotron 
            v-if="tooltipOn"
            :header="i18n.video" :lead="i18n.tipHeadline">
          <hr class="my-4">
          <p v-html="i18n.tooltip"></p>

        </b-jumbotron>
          <div class="form-group-row">
            <input id="vid-id"
                type="text"
                v-model="src"
                class="form-control"
                :placeholder="i18n.placeholder"
                @blur="checkURL"
                >
          </div>


          <div class="form-group row">
            <label for="platform-vimeo" class="col-2 col-form-label">{{ i18n.platform }}</label>
            
            <div class="col-2 form-check form-check-inline align-text-top">
              <input id="platform-vimeo"
                    class="form-check-input"
                    type="radio"
                    name="platform"
                    :value="false"
                    v-model="youtube"
                    disabled
                    >
              <label for="platform-vimeo" class="form-check-label">{{ i18n.vimeo }}</label>
            </div>
            <div class="col-2 form-check form-check-inline align-text-top">
              <input id="platform-yt"
                    class="form-check-input"
                    type="radio"
                    name="platform"
                    :value="true"
                    v-model="youtube"
                    disabled
                    >
              <label for="platform-yt" class="form-check-label">{{ i18n.youtube }}</label>
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
import * as i18n from '@/i18n/plugins/misc/laya-plyr'

export default {
  name: 'laya-plyr-new',
  data() {
    return {
      src: '',
      tooltipOn: false,
      youtube: false
    }
  },
  computed: {

    /**
     * i18n: Load translation files depending on user langugage
     * 
     * Author: cmc
     * 
     * Last updated: March 20, 2021
     * 
     */
    i18n() {
      return i18n[this.$store.state.profile.lang]
    },

    /**
     * urlMsg: return warning if URL is not supported
     * 
     * Author: cmc
     * 
     * Last Updated: January 17, 2021
     */
    urlMsg () {
      return this.correctURL? '' : this.i18n.wrongURL
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
  methods: {

    /**
     * Function toggleTip: toggle tooltipOn boolean
     * 
     * Author: cmc
     * 
     * Last updated: unknown
     */
    toggleTip() {
      this.tooltipOn = !this.tooltipOn
    },

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

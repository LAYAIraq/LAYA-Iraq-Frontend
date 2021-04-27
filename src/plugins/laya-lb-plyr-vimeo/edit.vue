<!--
Filename: edit.vue
Use: Edit VimeoPlyr content block
Creator: core
Date: unknown
Dependencies: @/i18n/plugins/laya-lb-plyr-vimeo
-->

<template>

  <div class="laya-lb-plyr-vimeo-edit">

    <form>
      <div class="form-group">
        <label for="vimeo-vid-id"><h4>{{ i18n.video }}</h4></label> 
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

        <input id="vimeo-vid-id"
               type="text"
               v-model="url"
               class="form-control"
               :placeholder="i18n.placeholder">
      </div>

    </form>
      
  </div>

</template>

<script>
import * as i18n from '@/i18n/plugins/laya-lb-plyr-vimeo'

export default {
  name: 'laya-lb-plyr-vimeo-edit',
  data() {
    return {
      tooltipOn: false
    }
  },
  mounted() {
    this.$attrs.url = this.url
  },
  props: {
    url: String
  },
  computed: {

    /**
     * i18n: Load translation files depending on user language
     * 
     * Author: cmc
     * 
     * Last updated: March 19, 2021
     * 
     */
    i18n() {
      return i18n[this.$store.state.profile.lang]
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
</style>

<!--
Filename: edit.vue
Use: Edit Ableplayer content block
Creator: core
Date: unknown
Dependencies: 
  vuex,
  @/i18n/plugins/misc/laya-ableplayer
-->

<template>
  <div class="laya-ableplayer-edit">

    <label><h4>{{ i18n.title }}</h4></label><i id ="questionmark" class="fas fa-question-circle" @click="tooltipOn = !tooltipOn" 
          :title="i18n.showTip" v-b-tooltip.left></i>
    <b-jumbotron 
            v-if="tooltipOn"
            :header="i18n.title" :lead="i18n.tipHeadline">
          <hr class="my-4">
          <span v-html="i18n.tooltip"></span>

    </b-jumbotron>
    <hr>

    <form>
      <div class="form-group">
        <label for="able-src-id">{{ i18n.vidURL }}</label>
        <input id="able-src-id"
               type="text"
               v-model="src"
               class="form-control"
               :placeholder="i18n.vidPlaceholder">
      </div>

      <div class="form-group">
        <label for="able-sign-id">{{ i18n.signVidURL }} </label>
        <input id="able-sign-id"
               type="text"
               v-model="sign"
               class="form-control"
               :placeholder="i18n.signVidPlaceholder">
      </div>

      <div class="form-group">
        <label for="able-sub-id">{{ i18n.subtitle }}</label>
        <input id="able-sub-id"
               type="text"
               v-model="sub"
               class="form-control"
               :placeholder="i18n.subtitlePlaceholder">
      </div>
    </form>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import * as i18n from '@/i18n/plugins/misc/laya-ableplayer'

export default {
  name: 'laya-ableplayer-edit',
  data() {
    return {
      src: '',
      sign: '',
      sub: '',
      tooltipOn: false
    }
  },
  created() {
    this.fetchData()
  },
  computed: {
    ...mapGetters(['content', 'profileLang']),

    /**
     * i18n: Load translation files depending on user langugage
     * 
     * Author: cmc
     * 
     * Last updated: March 19, 2021
     * 
     */
    i18n() {
      return i18n[this.profileLang]
    }
  },
  methods: {

    /**
     * Function fetchData: fetch data from vuex and make data property
     * 
     * Author: cmc
     * 
     * Last Updated: March 19, 2021
     */
    fetchData() {
      let idx = this.$route.params.step - 1
      const preData = JSON.parse(JSON.stringify(this.hasContent[idx].input))
      this.src = preData.src
      this.sign = preData.sign
      this.sub = preData.sub
    }
  }
}
</script>

<style>
#questionmark {
  float: inline-end;
  cursor: pointer;
}
</style>

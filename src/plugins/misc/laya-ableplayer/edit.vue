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
import * as i18n from "@/i18n/plugins/misc/laya-ableplayer"

export default {
  name: "laya-lb-plyr-vimeo-edit",
  data() {
    if(Object.entries(this.$attrs).length > 0)
      return {...this.$attrs, 
        tooltipOn: false}
    return {
      src: "",
      sign: "",
      sub: "",
      tooltipOn: false
    }
  },
  computed: {
    i18n() {
      return i18n[this.$store.state.profile.lang]
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

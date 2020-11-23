<template>

  <div class="laya-plyr-edit">

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

        <input id="vid-id"
               type="text"
               v-model="src"
               class="form-control"
               :placeholder="i18n.placeholder">
      </div>

    </form>
      
  </div>

</template>

<script>
import * as i18n from "@/i18n/plugins/misc/laya-plyr"
import { BJumbotron, BTooltip } from "bootstrap-vue"

export default {
  name: "laya-lb-plyr-edit",
  data() {
    return {
      src: "",
      tooltipOn: false
    }
  },
  mounted() {
    if(this.$attrs.src) this.src = this.$attrs.src
  },
  computed: {
    i18n() {
      return i18n[this.$store.state.profile.lang]
    }
  },
  methods: {
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

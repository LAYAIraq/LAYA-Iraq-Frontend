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
          <div class="form-group-row">
            <input id="vid-id"
                type="text"
                v-model="src"
                class="form-control"
                :placeholder="i18n.placeholder"
                @blur="checkPlatform">
          </div>


          <div class="form-group row">
            <label for="platform-vimeo" class="col-2 col-form-label">{{ i18n.platform }}</label>
            <div class="col-10">
              <div class="form-check form-check-inline align-text-top">
                <input id="platform-vimeo"
                      class="form-check-input"
                      type="radio"
                      :value="false"
                      v-model="youtube">
                <label for="platform-vimeo" class="form-check-label">{{ i18n.vimeo }}</label>
              </div>
              <div class="form-check form-check-inline align-text-top">
                <input id="platform-yt"
                      class="form-check-input"
                      type="radio"
                      name="youtube"
                      :value="true"
                      v-model="youtube">
                <label for="platform-yt" class="form-check-label">{{ i18n.youtube }}</label>
              </div>

              <div class="form-check form-check-inline align-text-top">
                <span class="text-danger form-control-plaintext text-right"> {{ urlMsg }}</span>
              </div>

            </div>
          </div>
        
      </div>

    </form>
      
  </div>

</template>

<script>
import * as i18n from "@/i18n/plugins/misc/laya-plyr"
import { BJumbotron, BTooltip } from "bootstrap-vue"

export default {
  name: "laya-plyr-edit",
  data() {
    return {
      src: "",
      msg: "",
      tooltipOn: false,
      youtube: false,
      correctURL: null
    }
  },
  mounted() {
    // if(this.$attrs.src) this.src = this.$attrs.src
  },
  computed: {
    i18n() {
      return i18n[this.$store.state.profile.lang]
    },
    urlMsg () {
      if (this.correctURL!=null) return correctURL? "" : this.i18n.wrongURL
      else return ""
    }
  },
  methods: {
    toggleTip() {
      this.tooltipOn = !this.tooltipOn
    },
    checkPlatform() {
      console.log("Checking plattform...")
      let src = this.src
      if (src.includes("youtube")) {
        console.log("IS YOUTUBE URL")
        this.youtube = true
        this.correctURL = true
      }
      else if (src.includes("vimeo")) {
        console.log("IS VIMEO URL")
        this.youtube = false
        this.correctURL = true
      }
      else {
        console.log("IS NO URL")
        this.correctURL = false
      } 
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

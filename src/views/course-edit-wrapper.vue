<template>
  <div class="laya-la-lb-wrapper">
    <div class="container">
      <div class="row">
        <div class="col">
          <!-- preview -->
          <div v-if="preview" :is="comps.view" v-bind="stepData"></div>

          <!-- editing view -->
          <div v-show="!preview">
            <component v-if="!editContent" :is="comps.new" ref="new"></component>
            <component v-else :is="comps.edit" ref="edit"></component>
          </div>
          <hr>

          <div class="d-flex justify-content-between">
            <button type="button"
                    class="btn btn-secondary"
                    :class="{active: preview}"
                    @click="preview = !preview">
              <span v-if="preview">{{ i18n.edit }}</span> 
              <span v-else> {{ i18n.preview }} </span>
            </button>
            <button type="button" class="btn btn-primary" @click="save">
              <i class="fas fa-check"></i> {{ i18n.save }}
            </button>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as i18n from "@/i18n/course-wrapper"
import { mapGetters, mapState } from "vuex"


export default {
  name: "course-edit-wrapper",
  data() {
    return {
      preview: false,
    }
  },
  props: {
    name: String,
    step: String,
  },
  computed: {
    ...mapGetters(["hasContent"]),
    ...mapState(["edit"]),
    cid() {
      return this.$route.params.type || this.hasContent[this.step-1].name //why not always use $route.params.type?
    },
    comps() {
      const la = this.$laya.la[this.cid]
      return la ? la.components : this.$laya.lb[this.cid].components
    },
    editContent() {
      return this.step <= this.hasContent.length
    },
    i18n() {
      return i18n[this.$store.state.profile.lang];
    },
    stepData() {
      let input = {}
      const data = this.editContent? this.$refs.edit.$data: this.$refs.new.$data
      for (let prop in data) {
        if(!/^[$_]/.test(prop)) {
          input[prop] = data[prop]
        }
      }
      return input
    }
  },
  mounted() {
    if(!this.cid && !this.hasContent) // data not passed -> go back
      this.$router.back()
  },
  methods: {
    save() {
      let step = this.step -1 // to comply to array indexing in store
      const newInput = this.stepData
      console.log(newInput)
      const changedInput = (({tooltipOn, ...o}) => o) (newInput) //remove "tooltipOn" boolean from data
      console.log(changedInput)
      const updatedStep = {
        name: this.cid,
        nextStep: null,
        input: changedInput
      }
      console.log(updatedStep)
      console.log(this.hasContent.length, step)
      if(!this.editContent){
        console.log("if hand: new content")
        this.$store.commit("appendContent", updatedStep)
      }
      else{
        console.log("else hand: update content", updatedStep)
        this.$store.commit("updateStep", { step, updatedStep })
      }
      this.$emit("saved")
    }
  },
  beforeDestroy() {
    this.$store.dispatch("storeCourse")
  }
}
</script>

<style scoped></style>

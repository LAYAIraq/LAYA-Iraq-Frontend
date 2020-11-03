<template>
  <div class="laya-la-lb-wrapper">
    <div class="container">
      <div class="row">
        <div class="col">
          <!-- preview -->
          <div v-if="preview" :is="comps.view" v-bind="dataFromEdit"></div>

          <!-- editing view -->
          <div v-show="!preview" :is="comps.edit" v-bind="init" ref="edit"></div>

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
    type: String,
  
    onsave: Function
  },
  computed: {
    ...mapGetters(["hasContent"]),
    ...mapState(["edit"]),
    cid() {
      return this.type || this.hasContent[this.step-1].name
    },
    comps() {
      const la = this.$laya.la[this.cid]
      return la ? la.components : this.$laya.lb[this.cid].components
    },
    dataFromEdit() {
      let input = {}
      const data = this.$refs.edit.$data
      for (let prop in data) {
        if(!/^[$_]/.test(prop)) {
          input[prop] = data[prop]
        }
      }
      return input
    },
    i18n() {
      return i18n[this.$store.state.profile.lang];
    },
    init() {
      return this.hasContent.len == this.step ? this.hasContent[this.step-1].input : null
      
    }
  },
  mounted() {
    if(!this.cid && !this.hasContent) // data not passed -> go back
      this.$router.back()
  },
  methods: {
    save() {
      let step = this.step-1
      const newInput = this.dataFromEdit
      console.log(newInput)
      const changedStep = {
        name: this.type,
        nextStep: null,
        input:  newInput
      }
      console.log(changedStep)
      console.log(this.hasContent.length, step)
      if(this.hasContent.length < this.step ){
        console.log("id hand")
        this.$store.commit("appendContent", changedStep)
      }
      else{
        console.log("else hand")
        this.$store.commit("updateStep", { step, changedStep })
      }
      
        
    }
  },
  beforeDestroy() {
    this.$store.dispatch("storeCourse")
  }
}
</script>

<style scoped></style>

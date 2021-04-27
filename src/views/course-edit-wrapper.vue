<!--
Filename: course-edit-wrapper.vue 
Use: wrap components needed for course editing
Creator: core
Date: unknown
Dependencies: 
  vuex, 
  @/i18n/course-wrapper
-->

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

          <hr>
          <laya-upload-file-list v-if="!preview"></laya-upload-file-list>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as i18n from '@/i18n/course-wrapper'
import { mapGetters, mapState } from 'vuex'
import LayaUploadFileList from '@/plugins/misc/laya-upload-file-list/file-list.vue'


export default {
  name: 'course-edit-wrapper',
  components: {
    LayaUploadFileList
  },
  data() {
    return {
      preview: false,
    }
  },
  props: {
    name: String,
    step: String,
    type: String
  },
  computed: {
    ...mapGetters(['content', 'profileLang']),
    ...mapState(['edit']),

    /**
     * cid: returns the type of content
     * 
     * Author: core
     * 
     * Last Updated: January 20, 2021
     */
    cid() {
      return this.type || this.content[this.step-1].name //why not always use $route.params.type?
    },

    /**
     * comps: return create, edit, view components for given content type
     * 
     * Author: core
     * 
     * Last Updated: January 20, 2021
     */
    comps() {
      const la = this.$laya.la[this.cid]
      return la ? la.components : this.$laya.lb[this.cid].components
    },

    /**
     * editContent: returns true if it's editing an existing content
     * 
     * Author: cmc
     * 
     * Last Updated: January 20, 2021
     */
    editContent() {
      return this.step <= this.content.length
    },

    /**
     * i18n: Load translation files depending on user language
     * 
     * Author: cmc
     * 
     * Last updated: March 21, 2021
     * 
     */
    i18n() {
      return i18n[this.profileLang];
    },

    /**
     * stepData: return input data for content
     * 
     * Author: cmc
     * 
     * Last Updated: January 20, 2021
     */
    stepData() {
      let input = {}
      const data = this.editContent? this.$refs.edit.$data: this.$refs.new.$data
      for (let prop in data) {
        if(!/^[$_]/.test(prop)) {
          input[prop] = data[prop]
        }
      }
      return (({tooltipOn, ...o}) => o) (input) //strip tooltipOn var from data
    }
  },
  mounted() {
    if(!this.cid && !this.content) // data not passed -> go back
      this.$router.back()
  },
  methods: {

    /**
     * Function save: write changes to content to store
     * 
     * Author: cmc
     * 
     * Last Updated: January 20, 2021
     */
    save() {
      let step = this.step -1 // to comply to array indexing in store
      const newInput = this.stepData
      const updatedStep = {
        name: this.cid,
        nextStep: null,
        input: newInput
      }
      
      // choose way depending on new or existing content
      if(!this.editContent){
        this.$store.commit('appendContent', updatedStep)
      }
      else{
        this.$store.commit('updateStep', { step, updatedStep })
      }
      this.$emit('saved')
    }
  },
  beforeDestroy() {
    // persist changes in database
    this.save()
    this.$store.dispatch('storeCourse')
  }
}
</script>

<style scoped></style>

<!--
Filename: course-edit-wrapper.vue
Use: wrap components needed for course editing
Creator: core
Date: unknown
Dependencies:
  vuex,
  @/mixins/locale.vue
-->

<template>
  <div class="laya-la-lb-wrapper">
    <div class="container">
      <div class="row">
        <div class="col">
          <!-- preview -->
          <div
            :is="comps.view"
            v-if="preview"
            :preview-data="stepData"
          ></div>

          <!-- editing view -->
          <div v-else>
            <component
              :is="comps.new"
              v-if="!editContent"
              ref="new"
            ></component>
            <component
              :is="comps.edit"
              v-else
              ref="edit"
            ></component>
          </div>
          <hr>

          <div class="d-flex justify-content-between">
            <button
              type="button"
              class="btn btn-secondary"
              :class="{ active: preview }"
              @click="preview = !preview"
            >
              <span v-if="preview">
                <i class="fas fa-edit"></i>
                {{ y18n('courseWrapper.edit') }}
              </span>
              <span v-else>
                <i class="fas fa-eye"></i>
                {{ y18n('courseWrapper.preview') }}
              </span>
            </button>
            <button
              type="button"
              class="btn btn-primary"
              @click="save"
            >
              <i class="fas fa-save"></i> {{ y18n('save') }}
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
import { locale, routeProps } from '@/mixins'
import { mapGetters } from 'vuex'
import LayaUploadFileList from '@/plugins/misc/laya-upload-file-list/file-list'

export default {
  name: 'CourseEditWrapper',

  components: {
    LayaUploadFileList
  },

  mixins: [
    locale,
    routeProps
  ],

  props: {
    type: {
      type: String,
      default () {
        return ''
      }
    }
  },

  data () {
    return {
      preview: false
    }
  },

  computed: {
    ...mapGetters(['content']),

    /**
     * cid: returns the type of content
     *
     * Author: core
     *
     * Last Updated: January 20, 2021
     */
    cid () {
      return this.type || this.content[this.step - 1].name // why not always use $route.params.type?
    },

    /**
     * comps: return create, edit, view components for given content type
     *
     * Author: core
     *
     * Last Updated: January 20, 2021
     */
    comps () {
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
    editContent () {
      return this.step <= this.content.length
    },

    /**
     * stepData: return input data for content
     *
     * Author: cmc
     *
     * Last Updated: January 20, 2021
     */
    stepData () {
      const input = {}
      const data = this.editContent ? this.$refs.edit.$data : this.$refs.new.$data
      for (const prop in data) {
        if (!/^[$_]/.test(prop)) {
          input[prop] = data[prop]
        }
      }
      // eslint-disable-next-line
      return (({tooltipOn, ...o}) => o) (input) //strip tooltipOn var from data
    }
  },

  beforeDestroy () {
    // persist changes in database
    if (this.editContent) {
      this.save()
      this.$store.dispatch('storeCourse')
    }
  },

  mounted () {
    if (!this.cid && !this.content) { // data not passed -> go back
      this.$router.back()
    }
  },

  methods: {

    /**
     * Function save: write changes to content to store
     *
     * Author: cmc
     *
     * Last Updated: January 11, 2022
     */
    save () {
      const step = this.step - 1 // to comply to array indexing in store
      // deep copy to get rid of store references
      const newInput = JSON.parse(JSON.stringify(this.stepData))
      const updatedStep = {
        name: this.cid,
        input: newInput
      }

      // choose way depending on new or existing content
      if (!this.editContent) {
        this.$store.commit('appendContent', { ...updatedStep, nextStep: null })
      } else {
        this.$store.commit('updateStep', { step, updatedStep })
      }
      // set courseUpdated to trigger watchers
      this.$store.commit('setCourseUpdated')
      this.$emit('saved')
    }
  }

}
</script>

<style scoped></style>

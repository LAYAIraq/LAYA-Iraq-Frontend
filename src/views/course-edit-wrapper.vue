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
            :view-data="stepData"
            :edit-preview="true"
          ></div>

          <!-- editing view -->
          <div v-show="!preview">
            <component
              :is="comps.new"
              v-if="!editContent"
              ref="new"
              :course-path="coursePath"
            ></component>
            <component
              :is="comps.edit"
              v-else
              ref="edit"
              :course-path="coursePath"
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
import { stripKey } from '@/misc/utils'

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
    },
    saveChanges: {
      type: Boolean,
      default () {
        return false
      }
    }
  },

  data () {
    return {
      preview: false
    }
  },

  computed: {
    ...mapGetters(['courseContent']),

    /**
     * cid: returns the type of content
     *
     * Author: core
     *
     * Last Updated: January 20, 2021
     */
    cid () {
      return this.type || this.courseContent[this.pathId].name // why not always use $route.params.type?
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
      return (this.$route.path.slice(-4) === 'edit')
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
      return stripKey('tooltipOn', input)
    }
  },

  watch: {
    saveChanges (val) {
      if (val) {
        this.save()
      }
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
     * Last Updated: November 22, 2022 by cmc
     */
    save () {
      const updatedStep = {
        name: this.cid,
        ...JSON.parse(JSON.stringify(this.stepData)) // deep copy to get rid of store references
      }

      // choose way depending on new or existing content
      if (!this.editContent) {
        this.$store.commit('courseContentAdd', updatedStep)
      } else {
        this.$store.commit('courseContentSet', { ...updatedStep, id: this.pathId })
      }
      // set courseUpdated to trigger watchers
      this.$store.commit('setCourseUpdated')
      this.$emit('saved')
    }
  }

}
</script>

<style scoped></style>

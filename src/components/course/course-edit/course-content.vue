<!--
  Filename: course-content.vue
  Use: wrap components needed for content editing
  Creator: core
  Since 1.0.0
-->

<template>
  <div class="course-content">
    <div class="container">
      <div class="row">
        <div class="col">
          <!-- preview -->
          <component
            :is="comps.view"
            v-if="preview"
            :view-data="stepData"
            :edit-preview="true"
          ></component>

          <!-- editing view -->
          <div v-show="!preview">
            <component
              :is="comps.edit"
              ref="edit"
              :edit="editContent"
              :course-path="coursePath"
            ></component>
          </div>
          <hr>

          <div class="d-flex justify-content-between">
            <button
              type="button"
              class="btn btn-primary"
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
              v-if="editContent"
              class="btn btn-primary"
              @click="$router.push({ name: 'content-follow-edit', params: { coursePath, contentId: pathId, follow: courseContentFollowMap[pathId] } })"
            >
              <i class="fas fa-edit"></i>
              {{ y18n('courseNavEdit.followEdit') }}
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
          <course-files v-if="!preview"></course-files>
        </div>
      </div>
    </div>
    <b-modal
      id="empty-title"
      :title="y18n('save.warning.emptyTitle.header')"
      header-bg-variant="danger"
      :ok-title="y18n('save.warning.notPossible')"
      ok-variant="danger"
      cancel-variant="primary"
      static
      centered
    >
      {{ y18n("save.warning.emptyTitle") }}
    </b-modal>
  </div>
</template>

<script>
import CourseFiles from '@/components/course/course-edit/course-files.vue'
import { courseContentBlockToNavItemTransform } from '@/mixins/general/course-structure'
import { deepCopy, stripKey } from '@/mixins/general/helpers'
import { locale, routes } from '@/mixins'
import { mapGetters } from 'vuex'
import { slugify } from '@/mixins/general/slugs'
import { v4 as uuidv4 } from 'uuid'

export default {
  name: 'CourseContent',

  components: {
    CourseFiles
  },

  mixins: [
    locale,
    routes
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
    ...mapGetters(['courseContent', 'courseContentFollowMap']),

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
      const plugins = { ...this.$laya.organization, ...this.$laya.assessments, ...this.$laya.blocks }
      return plugins[this.cid].components
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
      const input = {
        id: uuidv4()
      }
      for (const prop in this.$refs.edit.$data) {
        if (!/^[$_]/.test(prop)) {
          input[prop] = this.$refs.edit.$data[prop]
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
      this.$store.dispatch('courseUpdate')
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
        ...deepCopy(this.stepData) // deep copy to get rid of store references
      }
      if (!this.stepData.title.text) {
        this.$bvModal.show('empty-title')
      } else {
        // choose way depending on new or existing content
        if (!this.editContent) {
          this.$store.commit('courseContentAdd', updatedStep)
          this.$store.commit('courseChapterAdd', courseContentBlockToNavItemTransform(updatedStep))
          this.$store.commit('courseRoutesUpdate')
          this.$router.replace({
            name: 'course-content-edit',
            params: { coursePath: [slugify(this.stepData.title.text)] }
          })
        } else {
          this.$store.commit('courseContentSet', { ...updatedStep, id: this.pathId })
          this.$store.commit('courseRoutesUpdate')
        }
        // set courseUpdated to trigger watchers
        this.$store.commit('courseUpdatedSet', true)
        this.$emit('saved')
      }
    }
  }

}
</script>

<style scoped></style>

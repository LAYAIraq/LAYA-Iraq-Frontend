<!--
Filename: free-text-edit.vue
Use: Edit free text content block
Creator: core
Since: v1.0.0
-->

<template>
  <div :class="langIsAr ? 'text-right' : 'text-left'">
    <div
      v-if="title.show"
      :id="title.id"
      class="flaggable row"
    >
      <h2>{{ courseSimple ? title.simple : title.text }}</h2>
      <flag-icon
        v-if="!editPreview"
        :ref-data="title"
        @flagged="title.flagged = true"
      ></flag-icon>
    </div>
    <div
      class="free-text-edit bg-light"
      :class="langIsAr ? 'text-right' : 'text-left'"
    >
      <span class="p-3"> {{ y18n('content') }} </span> <!-- unnötig -->
      <div id="free-text-editor"></div>
    </div>
    <b-button block variant="primary" @click="commit">
      <p>Save</p>
    </b-button>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Quill from 'quill'
import { locale, pluginView, routes, storeHandler } from '@/mixins'

export default {
  name: 'FreeTextQuestionView',

  mixins: [
    locale,
    pluginView,
    routes,
    storeHandler
  ],

  data () {
    return { ...this.viewData }
  },

  computed: {
    ...mapGetters(['courseContent', 'courseSimple', 'content', 'courseCreator', 'courseFlags', 'userId'])
  },

  watch: {
  },

  created () {
    if (this.edit) {
      this.fetchData()
    }
  },

  async mounted () {
    await this.$store.dispatch('taskFetch', { studentId: this.$store.state.profile.id, assessmentId: this.viewData.id })
    await this.$store.dispatch('taskUpdate')
    this.initQuill()
  },

  methods: {

    /**
     */
    async commit () {
      await this.$store.dispatch('getSpecificTask', { studentId: this.$store.state.profile.id, assessmentId: this.viewData.id })
      await this.$store.commit('freetextAdd', this.contents)
      this.$store.dispatch('enrollmentUpdate')
      this.$store.dispatch('taskUpdate')
      await this.$store.dispatch('taskFetch', { studentId: this.$store.state.profile.id, assessmentId: this.viewData.id })
    },

    /**
     * Function fetchData: fetch data from vuex and make data property
     *
     */
    fetchData () {
    },

    /**
     * Function initQuill: initialize wysiwyg editor
     *
     */
    async initQuill () {
      const quill = new Quill('#free-text-editor', {
        theme: 'snow',
        placeholder: this.y18n('freeText.placeholder'),
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline'],
            [{ size: ['small', false, 'large', 'huge'] }],
            [{ color: [] }],
            [{ align: [] }],
            ['clean']
          ]
        }
      })
      quill.on('text-change', (delta, oldDelta, source) => {
        if (source === 'user') { this.contents = quill.getContents() }
        this.$forceUpdate()
      })
      // await this.$store.commit('taskSet', this.$store.state.task)
      if (this.$store.state.task.task) {
        quill.setContents(this.$store.state.task.task.freetext)
        this.$forceUpdate()
      }
    }

  }
}
</script>

<style>
.free-text-edit {
  margin-top: 1rem;
  font-size: 1.2rem;
}

.free-text-edit .ql-active {
  color: whitesmoke !important;
  border-radius: 2px;
  background-color: #06c !important;
}

.free-text-edit .ql-active .ql-stroke {
  stroke: whitesmoke !important;
}

.free-text-edit .ql-active .ql-fill {
  fill: whitesmoke !important;
}

.free-text-edit .ql-formats button {
  margin-right: 2px;
}

.free-text-edit .ql-formats button:last-child {
  margin-right: 0;
}

.ql-container.ql-snow {
  min-height: 200px;
  font-size: 18px;
}
</style>

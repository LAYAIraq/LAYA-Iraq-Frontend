<!--
Filename: view.vue
Use: View Freetext content block
Creator: core
Date: unknown
Dependencies:
  vuex,
  quill,
  @/mixins/locale.vue
-->

<template>
  <div class="laya-wysiwyg-view">
    <div
      v-if="title.show"
      :id="title.id"
      class="flaggable row"
    >
      <h2>{{ courseSimple? title.simple : title.text }}</h2>
      <laya-flag-icon
        v-if="!previewData"
        :ref-data="title"
        @flagged="title.flagged = true"
      ></laya-flag-icon>
    </div>
    <div :id="editorId"></div>
    <div class="row">
      <button
        type="button"
        class="btn btn-primary mt-3 d-block"
        :class="langIsAr? 'float-left mr-auto': 'float-right ml-auto'"
        @click="onFinish[0]() || {}"
      >
        {{ y18n('nextContent') }}
        <i
          :class="langIsAr?
            'fas fa-arrow-left':
            'fas fa-arrow-right'"
        ></i>
      </button>
    </div>
  </div>
</template>

<script>
import 'quill/dist/quill.snow.css'
import Quill from 'quill'
import { locale, viewPluginProps, watchContent } from '@/mixins'
import { mapGetters } from 'vuex'
import '@/styles/flaggables.css'

export default {
  name: 'LayaWysiwyg',

  mixins: [
    locale,
    viewPluginProps,
    watchContent
  ],

  data () {
    if (this.previewData) { // preview
      return { ...this.previewData }
    }
    return {
      contents: null,
      title: {}
    }
  },

  computed: {
    ...mapGetters(['content', 'courseSimple']),

    /**
     * editorId: return id for html element
     *
     * Author: core
     *
     * Last Updated: unknown
     */
    editorId () {
      return `laya-wysiwyg-readonly-${Date.now()}`
    }
  },

  created () {
    if (!this.previewData) this.fetchData()
  },

  mounted () {
    this.fetchContent()
  },

  methods: {

    /**
     * Function fetchData: fetch data from vuex and make data property
     *
     * Author: cmc
     *
     * Last Updated: March 20, 2021
     */
    fetchData () {
      const idx = this.$route.params.step - 1
      const preData = JSON.parse(JSON.stringify(this.content[idx].input))
      this.contents = preData.contents
      this.title = preData.title
    },
    /**
     * Function fetchContent: fetch contents from quill
     *
     * Author: core
     *
     * Last Updated: March 20, 2021
     */
    fetchContent () {
      const quill = new Quill(`#${this.editorId}`, {
        theme: 'snow',
        readOnly: true
      })
      quill.setContents(this.contents)
    }
  }
}
</script>

<style>
.laya-wysiwyg-view .ql-toolbar {
  display: none;
}
.laya-wysiwyg-view .ql-container {
  border: none;
}
</style>

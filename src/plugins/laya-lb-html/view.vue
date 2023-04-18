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
      <flag-icon
        v-if="!viewData"
        :ref-data="title"
        @flagged="title.flagged = true"
      ></flag-icon>
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
import { locale, pluginView } from '@/mixins'
import '@/assets/styles/flaggables.css'
import FlagIcon from '@/components/course/flag/flag-icon.vue'

export default {
  name: 'LayaWysiwyg',
  components: { FlagIcon },

  mixins: [
    locale,
    pluginView
  ],

  data () {
    return { ...this.viewData }
  },

  computed: {

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

  mounted () {
    this.fetchContent()
  },

  methods: {

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
.laya-wysiwyg-view {
  font-size: 18px;
}
.laya-wysiwyg-view .ql-toolbar {
  display: none;
}
.laya-wysiwyg-view .ql-container {
  border: none;
}

</style>

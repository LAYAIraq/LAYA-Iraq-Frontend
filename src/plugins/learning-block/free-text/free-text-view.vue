<!--
Filename: free-text-view.vue
Use: View Freetext content block
Creator: core
Since: v1.0.0
-->

<template>
  <fieldset
    class="free-text-view"
    :class="courseLangIsAr? 'text-right' : 'text-left'"
  >
    <div>
      <div
        v-if="title.show"
        :id="title.id"
        class="flaggable row"
      >
        <h2>{{ courseSimple? title.simple : title.text }}</h2>
        <flag-icon
          v-if="!editPreview"
          :ref-data="title"
          @flagged="title.flagged = true"
        ></flag-icon>
      </div>
      <div id="free-text-viewer"></div>
      <div class="row">
        <button-next-content
          v-if="!lastContentBlock"
          :cid="id"
        ></button-next-content>
      </div>
    </div>
  </fieldset>
</template>

<script>
import 'quill/dist/quill.snow.css'
import Quill from 'quill'
import { locale, pluginView } from '@/mixins'
import '@/assets/styles/flaggables.css'
import FlagIcon from '@/components/course/flag/flag-icon.vue'
import ButtonNextContent from '@/components/helpers/button-next-content.vue'

export default {
  name: 'FreeTextView',
  components: { ButtonNextContent, FlagIcon },

  mixins: [
    locale,
    pluginView
  ],

  data () {
    return { ...this.viewData }
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
      const quill = new Quill('#free-text-viewer', {
        theme: 'snow',
        readOnly: true
      })
      quill.setContents(this.contents)
    }
  }
}
</script>

<style>
.free-text-view {
  font-size: 18px;
}
.free-text-view .ql-toolbar {
  display: none;
}
.free-text-view .ql-container {
  border: none;
}

</style>

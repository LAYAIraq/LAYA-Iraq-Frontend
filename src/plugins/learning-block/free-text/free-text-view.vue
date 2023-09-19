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
  </fieldset>
</template>

<script>
import 'quill/dist/quill.snow.css'
import Quill from 'quill'
import { locale, pluginView } from '@/mixins'
import '@/assets/styles/flaggables.css'
import FlagIcon from '@/components/course/flag/flag-icon.vue'

export default {
  name: 'FreeTextView',
  components: { FlagIcon },

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

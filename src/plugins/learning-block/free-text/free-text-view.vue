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
    <div
      :id="title.id"
      :class="courseLangIsAr? 'flaggable-ar row' : 'flaggable-en row'"
    >
      <div
        :class="courseLangIsAr? 'text-right' : 'text-left'"
      >
        <h1 class="pb-3">
          {{ courseSimple? title.simple : title.text }}
        </h1>
        <a>
          <flag-icon
            v-if="!editPreview"
            :ref-data="title"
            @flagged="title.flagged = true"
          ></flag-icon>
        </a>
      </div>
    </div>
    <div :id="editPreview? 'free-text-preview': 'free-text-viewer'"></div>
    <div class="row mt-3">
      <navigation-buttons
        :cid="id"
      ></navigation-buttons>
    </div>
  </fieldset>
</template>

<script>
import 'quill/dist/quill.snow.css'
import Quill from 'quill'
import { locale, pluginView } from '@/mixins'
import '@/assets/styles/flaggables.css'
import FlagIcon from '@/components/course/flag/flag-icon.vue'
import NavigationButtons from '@/components/helpers/navigation-buttons.vue'

export default {
  name: 'FreeTextView',
  components: { NavigationButtons, FlagIcon },

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
      const targetId = this.editPreview ? '#free-text-preview' : '#free-text-viewer' // avoid duplicate quill id when content is shown and previewed
      const quill = new Quill(targetId, {
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

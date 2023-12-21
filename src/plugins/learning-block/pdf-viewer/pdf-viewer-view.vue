<!--
Filename: pdf-viewer-view.vue
Use: View pdf viewer content block
Creator: nv
Since: v1.3.0
-->
<template>
  <fieldset
    class="pdf-viewer-view"
    :class="courseLangIsAr? 'text-right' : 'text-left'"
  >
    <!-- render title -->
    <div
      :id="title.id"
      :class="courseLangIsAr? 'flaggable-ar row' : 'flaggable-en row'"
    >
      <div
        style="width:100%"
      >
        <h1 class="pb-3">
          {{ courseSimple? title.simple : title.text }}
        </h1>
      </div>

      <a>
        <flag-icon
          v-if="!editPreview"
          :ref-data="title"
          @flagged="title.flagged = true"
        ></flag-icon>
      </a>
    </div>
    <div class="pdf-viewer-style">
      <pdf-viewer
        v-if="url !== null && url !== ''"
        :url="url"
      >
      </pdf-viewer>
    </div>
    <div class="centering">
      <b-button
        @click="downloadPdf"
      >
        {{ y18n("pdfViewer.download") }}
      </b-button>
    </div>

    <div class="row mt-3">
      <navigation-buttons
        :cid="id"
      ></navigation-buttons>
    </div>
  </fieldset>
</template>

<script>
import { locale, pluginView } from '@/mixins'
import '@/assets/styles/flaggables.css'
import FlagIcon from '@/components/course/flag/flag-icon.vue'
import PdfViewer from '@/components/helpers/pdf-viewer.vue'
import NavigationButtons from '@/components/helpers/navigation-buttons.vue'

export default {
  name: 'PdfViewerView',
  components: {
    FlagIcon,
    NavigationButtons,
    PdfViewer
  },
  mixins: [
    locale,
    pluginView
  ],

  data () {
    return {
      ...this.viewData
    }
  },
  methods: {
    /**
     * Function downloadPdf: downloads the displayed pdf
     * Author: nv
     * Since: v1.3.0
     */
    downloadPdf () {
      fetch(this.url)
        .then(response => response.blob())
        .then(blob => {
          const objectUrl = window.URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.href = objectUrl
          link.download = this.url.split('/').pop()
          document.body.appendChild(link)
          link.click()
          window.URL.revokeObjectURL(objectUrl)
        })
    }
  }
}
</script>

<style>
.pdf-viewer-style {
  height:500px;
  width:100%;
  overflow-y:auto;
}
.centering {
  display: flex;
  align-items: center;
  justify-content: center;
}
@media (max-width: 768px) {
  .pdf-viewer-style {
    height:400px;
    width:100%;
    overflow-y:auto;
    overflow-x:auto;
  }
}
</style>

<!--
Filename: pdf-viewer-view.vue
Use: View pdf viewer content block
Creator: nv
Since: v1.3.0
-->
<template>
  <div
    class="pdf-viewer-view"
    :class="langIsAr? 'text-right' : 'text-left'"
  >
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
import { locale, pluginView } from '@/mixins'
import '@/assets/styles/flaggables.css'
import FlagIcon from '@/components/course/flag/flag-icon.vue'
import PdfViewer from '@/components/helpers/pdf-viewer.vue'

export default {
  name: 'PdfViewerView',
  components: {
    FlagIcon,
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

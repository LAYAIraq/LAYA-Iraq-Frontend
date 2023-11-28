<!--
Filename: pdf-viewer.vue
Use: initializes pdf viewer
Creator: nv
Since: v1.3.0
-->

<template>
  <div class="centering">
  </div>
</template>

<script>
import { getDocument, GlobalWorkerOptions as pdfworkerOpts } from 'pdfjs-dist/legacy/build/pdf'
import { locale } from '@/mixins'

export default {
  name: 'PdfViewer',

  mixins: [
    locale
  ],
  props: {
    url: {
      type: String,
      default: 'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf'
    }
  },

  data () {
    return {

    }
  },

  created () {
  },

  mounted () {
    pdfworkerOpts.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.js'

    console.log('pdfUrl ' + this.url)
    const loadingTask = getDocument({
      url: this.url
    })
    loadingTask.promise.then(pdf => {
      console.log('PDF loaded')

      // Render each page
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        pdf.getPage(pageNum).then(page => {
          const scale = 1.5
          const viewport = page.getViewport({ scale: scale })

          // Prepare canvas for each page
          const canvas = document.createElement('canvas')
          const context = canvas.getContext('2d')
          canvas.height = viewport.height
          canvas.width = viewport.width

          // Append canvas to the component
          this.$el.appendChild(canvas)

          // Render page into canvas
          const renderContext = {
            canvasContext: context,
            viewport: viewport
          }
          page.render(renderContext).promise.then(() => {
            console.log(`Page ${pageNum} rendered`)
          })
        })
      }
    }, reason => {
      console.error(reason)
    })
  },

  methods: {

  }
}
</script>

<style>
.centering {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>

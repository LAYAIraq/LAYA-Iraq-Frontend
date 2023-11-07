<template>
  <div>
    <div id="pageContainer">
      <div
        id="viewer"
        class="pdfViewer"
      ></div>
    </div>
  </div>
</template>

<script>

import pdfjsLib from 'pdfjs-dist/build/pdf'
import { PDFViewer } from 'pdfjs-dist/web/pdf_viewer'
// import 'pdfjs-dist/web/pdf_viewer.css'

pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@2.0.943/build/pdf.worker.min.js'

export default {
  name: 'PdfViewer',
  props: {
    path: {
      type: String,
      default: ''
    }
  },

  mounted () {
    this.getPDF()
  },
  methods: {
    async getPdf () {
      const container = document.getElementById('pageContainer')
      const pdfViewer = new PDFViewer({
        container: container
      })
      const loadingTask = pdfjsLib.getDocument('./pdf-sample.pdf')
      const pdf = await loadingTask.promise
      pdfViewer.setDocument(pdf)
    }
  }
}
</script>

<style>
#pageContainer {
  margin: auto;
  width: 80%;
}

div.page {
  display: inline-block;
}
</style>

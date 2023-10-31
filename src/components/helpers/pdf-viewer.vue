<template>
  <div>
    <iframe
      height="300"
      width="600"
      :src="`${getFilePath}`"
    ></iframe>
  </div>
</template>

<script>

export default {
  name: 'PdfViewer',
  props: {
    fileName: {
      type: String,
      default: 'Test_PDF.pdf'
    },
    path: {
      type: String,
      default: 'lib/pdfjs-3.11.174-dist/web/viewer.html'
    }
  },
  computed: {
    getFilePath () {
      if (this.fileName !== '') {
        console.log(this.path + '?file=' + this.fileName)
        return this.path + '?file=' + this.fileName
      }
      return this.path
    }
  }
}
</script>
<style scoped>
div {
  width: 50%;
  height: 79vh;
  min-width: 400px;
}
</style>

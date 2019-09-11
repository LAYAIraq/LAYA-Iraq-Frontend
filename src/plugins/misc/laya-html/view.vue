<template>
  <div class="laya-wysiwyg-view">
    <div :id="editorId"></div>
  </div>
</template>

<script>
import "quill/dist/quill.snow.css"
import Quill from "quill"

export default {
  name: "laya-wysiwyg",
  data() {
    return {
    }
  },
  mounted() {
    const quill = new Quill(`#${this.editorId}`, {
      theme: "snow",
      readOnly: true
    })
    quill.setContents(this.contents)
  },
  props: {
    contents: Object
  },
  computed: {
    editorId() {
      return `laya-wysiwyg-readonly-${Date.now()}`
    }
  },
  methods: {
  },
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

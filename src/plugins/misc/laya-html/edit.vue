<template>
  <div class="laya-wysiwyg-edit bg-light">
    <div :id="editorId"></div>
  </div>
</template>

<script>
import "quill/dist/quill.snow.css"
import Quill from "quill"

export default {
  name: "laya-wysiwyg-edit",
  data() {
    if(Object.entries(this.$attrs).length > 0)
      return {...this.$attrs}
    return {
      contents: null
    }
  },
  mounted() {
    const self = this
    const quill = new Quill(`#${self.editorId}`, {
      theme: "snow",
      placeholder: "Hier Freitext, Links etc. schreiben...",
      modules: {
        toolbar: [
          ['bold', 'italic', 'underline'],
          ['blockquote', 'link', 'image'],
          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
          [{ 'size': ['small', false, 'large', 'huge'] }],
          [{ 'color': [] }, { 'background': [] }],
          [{ 'align': [] }],
          ['clean']
        ]
      }
    })
    quill.on("text-change", function(delta, oldDelta, source) {
      if (source === "user")
        self.contents = quill.getContents()
    })
    quill.setContents(self.contents)
  },
  computed: {
    editorId() {
      return `laya-wysiwyg-${Date.now()}`
    }
  },
}
</script>

<style>
.laya-wysiwyg-edit .ql-active {
  color: whitesmoke !important;
  border-radius: 2px;
  background-color: #06c !important;
}
.laya-wysiwyg-edit .ql-active .ql-stroke {
  stroke: whitesmoke !important;
}
.laya-wysiwyg-edit .ql-active .ql-fill {
  fill: whitesmoke !important;
}

.laya-wysiwyg-edit .ql-formats button {
  margin-right: 2px;
}
.laya-wysiwyg-edit .ql-formats button:last-child {
  margin-right: 0px;
}
</style>

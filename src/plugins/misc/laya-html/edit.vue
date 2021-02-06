<template>

  <div class="laya-wysiwyg-edit bg-light">  
    <div :id="editorId"></div>
    <div>
      <file-upload
        ref="upload"
        v-model="files"
        post-action="/post.method"
        put-action="/put.method"
        @input-file="inputFile"
        @input-filter="inputFilter"
      >
        Upload file
      </file-upload>
      <button v-show="!$refs.upload || !$refs.upload.active" @click.prevent="$refs.upload.active = true" type="button">Start upload</button>
      <button v-show="$refs.upload && $refs.upload.active" @click.prevent="$refs.upload.active = false" type="button">Stop upload</button>
    </div>
  </div>

</template>

<script>
import { mapGetters } from "vuex"
import "quill/dist/quill.snow.css"
import Quill from "quill"
import VueUploadComponent from "vue-upload-component"
import * as i18n from "@/i18n/plugins/misc/laya-html"

export default {
  name: "laya-wysiwyg-edit",
  components: {
    fileUpload: VueUploadComponent
  },
  data() {
    return {
      contents: null,
      files: []
    }
  },
  created() {
    let idx = this.$route.params.step -1
    const preData = JSON.parse(JSON.stringify(this.hasContent[idx].input))
    this.contents = preData.contents
  },
  mounted() {
    const self = this
    const quill = new Quill(`#${self.editorId}`, {
      theme: "snow",
      placeholder: self.i18n.placeholder,
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
        self.$forceUpdate
    })
    quill.setContents(self.contents)
  },
  computed: {
    ...mapGetters(["hasContent"]),
    editorId() {
      return `laya-wysiwyg-${Date.now()}`
    },
    i18n() {
      return i18n[this.$store.state.profile.lang]
    }
  },
  methods: {
    inputFile(newFile, oldFile) {
      if (newFile && oldFile && !newFile.active && oldFile.active) {
        // Get response data
        console.log('response', newFile.response)
        if (newFile.xhr) {
          //  Get the response status code
          console.log('status', newFile.xhr.status)
        }
      }
    },
    inputFilter: function (newFile, oldFile, prevent) {
      if (newFile && !oldFile) {
        // Filter non-image file
        if (!/\.(jpeg|jpe|jpg|gif|png|webp)$/i.test(newFile.name)) {
          return prevent()
        }
      }

      // Create a blob field
      newFile.blob = ''
      let URL = window.URL || window.webkitURL
      if (URL && URL.createObjectURL) {
        newFile.blob = URL.createObjectURL(newFile.file)
      }
    }
  }
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
.ql-container.ql-snow {
 min-height: 200px;
}

</style>

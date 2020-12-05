<template>
  <div class="laya-wysiwyg-view">
    <div :id="editorId"></div>
    <button type="button"
            class="btn btn-primary mt-3 d-block ml-auto"
            @click="onFinish[0]() || {}">
      {{ i18n.nextContent }}<i class="fas fa-arrow-right"></i>
    </button>
  </div>

  

</template>

<script>
import "quill/dist/quill.snow.css"
import Quill from "quill"
import * as i18n from "@/i18n/plugins/misc/laya-html"

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
    contents: Object,
    onFinish: Array
  },
  computed: {
    editorId() {
      return `laya-wysiwyg-readonly-${Date.now()}`
    },
    i18n() {
      return i18n[this.$store.state.profile.lang]
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

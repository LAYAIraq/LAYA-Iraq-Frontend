<!--
Filename: edit.vue 
Use: Edit WYSIWYG content block
Creator: core
Date: unknown
Dependencies:
  vuex,
  quill,
  @/i18n/plugins/misc/laya-html
-->

<template>

  <div class="laya-wysiwyg-edit bg-light">  
    <div :id="editorId"></div>
  </div>

</template>

<script>
import { mapGetters } from 'vuex'
import 'quill/dist/quill.snow.css'
import Quill from 'quill'
import * as i18n from '@/i18n/plugins/misc/laya-html'

export default {
  name: 'laya-wysiwyg-edit',
  data() {
    return {
      contents: null
    }
  },
  created() {
    this.fetchData()
  },
  mounted() {
    this.initQuill()
  },
  computed: {
    ...mapGetters(['hasContent', 'profileLang']),

    /**
     * editorId: return ID for html element
     * 
     * Author: core
     * 
     * Last Updated: unknown
     */
    editorId() {
      return `laya-wysiwyg-${Date.now()}`
    },

    /**
     * i18n: Load translation files depending on user langugage
     * 
     * Author: cmc
     * 
     * Last updated: March 20, 2021
     * 
     */
    i18n() {
      return i18n[this.profileLang]
    }
  },
  methods: {

    /**
     * Function fetchData: fetch data from vuex and make data property
     * 
     * Author: cmc
     * 
     * Last Updated: March 20, 2021
     */
    fetchData() {
      let idx = this.$route.params.step -1
      const preData = JSON.parse(JSON.stringify(this.hasContent[idx].input))
      this.contents = preData.contents
    },

    /**
     * Function initQuill: initialize wysiwyg editor
     * 
     * Author: core
     * 
     * Last Updated: March 20, 2021
     */
    initQuill() {
      const self = this
      const quill = new Quill(`#${self.editorId}`, {
        theme: 'snow',
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
      quill.on('text-change', (delta, oldDelta, source) => {
        if (source === 'user')
          self.contents = quill.getContents()
          self.$forceUpdate
      })
      quill.setContents(self.contents)
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

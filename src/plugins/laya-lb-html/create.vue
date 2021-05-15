<!--
Filename: create.vue 
Use: Create a new WYSIWYG content block
Creator: cmc
Date: January 19, 2021
Dependencies: 
  quill,
  @/mixins/locale.vue
-->

<template>

  <div class="laya-wysiwyg-edit bg-light">  
    <div :id="editorId"></div>
  </div>

</template>

<script>
import 'quill/dist/quill.snow.css'
import Quill from 'quill'
import { locale } from '@/mixins'

export default {
  name: 'laya-wysiwyg-edit',

  mixins: [
    locale
  ],

  computed: {

    /**
     * editorId: return id for html element
     * 
     * Author: core
     * 
     * Last Updated: unknown
     */
    editorId() {
      return `laya-wysiwyg-${Date.now()}`
    }
  },

  data() {
    return {
      contents: null
    }
  },

  mounted() {
    this.initQuill()
  },

  methods: {

    /**
     * Function initQuill: Initialize editor for wysiwyg
     * 
     * Author: core
     * 
     * Last Updated: March 20, 2021
     */
    initQuill() {
      const self = this
      const quill = new Quill(`#${self.editorId}`, {
        theme: 'snow',
        placeholder: self.i18n['layaHtml.placeholder'],
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

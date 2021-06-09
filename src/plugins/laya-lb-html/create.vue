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

  <div
    id="laya-wysiwyg-create"
    :class="langIsAr? 'text-right' : 'text-left'"
  >
    <form>
      <div class="form-group row">  
        <div class="form-group col-10"> 
          <label 
            for="laya-wysiwyg-title" 
          >
            {{ i18n['title'] }}
          </label>
          
          <input 
            id="laya-wysiwyg-title"
            type="text"
            v-model="title"
            class="form-control"
            :placeholder="i18n['titlePlaceholder']"
          >
        </div>
        <div class="form-group col" id="show-title-button">
          <div style="height: calc(1.5em + .75rem + 2px);"></div>
          <label
            for="show-title-tick"
            class="col"
          >
            {{ i18n['showTitle'] }}
            <input
              id="show-title-tick"
              type="checkbox"
              v-model="showTitle"
            >
          </label>
            
          
        </div>
      </div>
    </form>
    <div 
      class="laya-wysiwyg-edit bg-light"
     :class="langIsAr? 'text-right' : 'text-left'"
    >
      <label :for="editorId"> {{ i18n['content'] }} </label>
      <div :id="editorId"></div>
    </div>
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
      contents: null,
      title: '',
      showTitle: false
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

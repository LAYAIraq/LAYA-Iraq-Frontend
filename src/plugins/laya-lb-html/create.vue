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
    :class="langIsAr? 'text-right' : 'text-left'"
  >
    <form>
      <div class="form-group">
        <div class="row">
          <!-- title -->
          <label
            for="laya-wysiwyg-title"
            class="col-2 col-form-label"
          >
            {{ i18n['title'] }}
          </label>
          <div class="col-8">
            <input
              id="laya-wysiwyg-title"
              type="text"
              v-model="title.text"
              class="form-control"
              :placeholder="i18n['titlePlaceholder']"
            >
          </div>
          <!-- show title button -->
          <div class="form-group col">
            <label
              for="show-title-tick"
              class="col-form-label"
            >
              {{ i18n['showTitle'] }}
              <input
                id="show-title-tick"
                type="checkbox"
                v-model="title.show"
              >
            </label>
          </div>
        </div>
        <div
          class="row"
          v-if="courseSimple"
        >
          <!-- simple title -->
          <label
            for="laya-wysiwyg-title-simple"
            class="col-2 col-form-label"
          >
            <span class="sr-only">
              {{ i18n['simpleAlt'] }}
            </span>
          </label>
          <div class="col-8">
            <input
              id="laya-wysiwyg-title-simple"
              type="text"
              v-model="title.simple"
              class="form-control"
              :placeholder="i18n['simpleAlt']"
            >
          </div>
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
import { v4 as uuidv4 } from 'uuid'
import { mapGetters } from 'vuex'
import { locale } from '@/mixins'

export default {
  name: 'laya-wysiwyg-edit',

  mixins: [
    locale
  ],

  computed: {
    ...mapGetters(['courseSimple']),

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
      title: {
        text: '',
        id: '',
        show: false,
        flagged: false
      }
    }
  },

  created() {
    this.title.id = uuidv4()
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
  margin-right: 0;
}

.ql-container.ql-snow {
 min-height: 200px;
}

</style>

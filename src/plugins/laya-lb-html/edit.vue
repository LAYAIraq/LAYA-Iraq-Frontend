<!--
Filename: edit.vue
Use: Edit WYSIWYG content block
Creator: core
Date: unknown
Dependencies:
  vuex,
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
            {{ y18n('title') }}
          </label>
          <div class="col-8">
            <input
              id="laya-wysiwyg-title"
              v-model="title.text"
              type="text"
              class="form-control"
              :placeholder="y18n('titlePlaceholder')"
            >
          </div>
          <!-- show title button -->
          <div class="form-group col">
            <label
              for="show-title-tick"
              class="col-form-label"
            >
              {{ y18n('showTitle') }}
              <input
                id="show-title-tick"
                v-model="title.show"
                type="checkbox"
              >
            </label>
          </div>
        </div>
        <div
          v-if="courseSimple"
          class="row"
        >
          <!-- simple title -->
          <label
            for="laya-wysiwyg-title-simple"
            class="col-2 col-form-label"
          >
            <span class="sr-only">
              {{ y18n('simpleAlt') }}
            </span>
          </label>
          <div class="col-8">
            <input
              id="laya-wysiwyg-title-simple"
              v-model="title.simple"
              type="text"
              class="form-control"
              :placeholder="y18n('simpleAlt')"
            >
          </div>
        </div>
      </div>
    </form>
    <div
      class="laya-wysiwyg-edit bg-light"
      :class="langIsAr? 'text-right' : 'text-left'"
    >
      <label :for="editorId"> {{ y18n('content') }} </label>
      <div :id="editorId"></div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import 'quill/dist/quill.snow.css'
import Quill from 'quill'
import { locale } from '@/mixins'

export default {
  name: 'LayaWysiwygEdit',

  mixins: [
    locale
  ],

  data () {
    return {
      contents: null,
      title: { }
    }
  },

  computed: {
    ...mapGetters(['content', 'courseSimple']),

    /**
     * editorId: return ID for html element
     *
     * Author: core
     *
     * Last Updated: unknown
     */
    editorId () {
      return `laya-wysiwyg-${Date.now()}`
    }
  },

  created () {
    this.fetchData()
  },

  mounted () {
    this.initQuill()
  },

  methods: {

    /**
     * Function fetchData: fetch data from vuex and make data property
     *
     * Author: cmc
     *
     * Last Updated: March 20, 2021
     */
    fetchData () {
      const idx = this.$route.params.step - 1
      const preData = JSON.parse(JSON.stringify(this.content[idx].input))
      this.contents = preData.contents
      this.title = preData.title
    },

    /**
     * Function initQuill: initialize wysiwyg editor
     *
     * Author: core
     *
     * Last Updated: March 20, 2021
     */
    initQuill () {
      const self = this
      const quill = new Quill(`#${self.editorId}`, {
        theme: 'snow',
        placeholder: self.y18n('layaHtml.placeholder'),
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline'],
            ['blockquote', 'link', 'image'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ size: ['small', false, 'large', 'huge'] }],
            [{ color: [] }, { background: [] }],
            [{ align: [] }],
            ['clean']
          ]
        }
      })
      quill.on('text-change', (delta, oldDelta, source) => {
        if (source === 'user') { self.contents = quill.getContents() }
        self.$forceUpdate()
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

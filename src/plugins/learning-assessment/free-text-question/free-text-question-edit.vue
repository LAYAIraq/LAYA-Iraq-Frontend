<!--
Filename: free-text-edit.vue
Use: Edit free text content block
Creator: core
Since: v1.0.0
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
            for="free-text-title"
            class="col-2 col-form-label"
          >
            {{ y18n('title') }}
          </label>
          <div class="col-8">
            <input
              id="free-text-title"
              v-model="title.text"
              type="text"
              class="form-control"
              :placeholder="y18n('titlePlaceholder')"
            >
          </div>
        </div>
        <div
          v-if="courseSimple"
          class="row"
        >
          <!-- simple title -->
          <label
            for="free-text-title-simple"
            class="col-2 col-form-label"
          >
            <span class="sr-only">
              {{ y18n('simpleAlt') }}
            </span>
          </label>
          <div class="col-8">
            <input
              id="free-text-title-simple"
              v-model="title.simple"
              type="text"
              class="form-control"
              :placeholder="y18n('simpleAlt')"
            >
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Quill from 'quill'
import { locale, pluginEdit, routes } from '@/mixins'

export default {
  name: 'FreeTextQuestionEdit',

  mixins: [
    locale,
    pluginEdit,
    routes
  ],

  data () {
    return {
      contents: null,
      title: {}
    }
  },

  computed: {
    ...mapGetters(['courseContent', 'courseSimple'])
  },

  created () {
    if (this.edit) {
      this.fetchData()
    } else {
      this.taskTitlePopulate()
    }
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
      const preData = JSON.parse(JSON.stringify(this.courseContent[this.pathId]))
      this.contents = preData.contents
      this.title = preData.title
      this.title.show = true
    },

    /**
     * Function initQuill: initialize wysiwyg editor
     *
     * Author: core
     *
     * Last Updated: March 20, 2021
     */
    initQuill () {
      const quill = new Quill('#free-text-editor', {
        theme: 'snow',
        placeholder: this.y18n('freeText.placeholder'),
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
        if (source === 'user') { this.contents = quill.getContents() }
        this.$forceUpdate()
      })
      quill.setContents(this.contents)
    }

  }
}
</script>

<style>
.free-text-edit {
  margin-top: 1rem;
  font-size: 1.2rem;
}
.free-text-edit .ql-active {
  color: whitesmoke !important;
  border-radius: 2px;
  background-color: #06c !important;
}
.free-text-edit .ql-active .ql-stroke {
  stroke: whitesmoke !important;
}
.free-text-edit .ql-active .ql-fill {
  fill: whitesmoke !important;
}

.free-text-edit .ql-formats button {
  margin-right: 2px;
}
.free-text-edit .ql-formats button:last-child {
  margin-right: 0;
}
.ql-container.ql-snow {
  min-height: 200px;
  font-size: 18px;
}

</style>

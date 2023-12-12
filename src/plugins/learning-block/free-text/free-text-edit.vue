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
    <div class="row">
      <div class="col">
        <h4 class="d-inline-block mr-auto">
          {{ y18n('freeText.name') }}
        </h4>
        <i
          id="questionmark"
          v-b-tooltip.auto
          class="fas fa-question-circle"
          :title="y18n('showTip')"
          aria-labelledby="tooltipText"
          aria-live="polite"
          @click="toggleTip"
        ></i>
      </div>
    </div>

    <b-jumbotron
      v-if="tooltipOn"
      id="tooltipText"
      :header="y18n('freeText.name')"
      :lead="y18n('tipHeadline')"
    >
      <hr class="my-4">
      <p
        v-for="str in y18n('freeText.tooltip').split(';')"
        :key="str.length"
      >
        <!-- eslint-disable-next-line vue/no-v-html --> <!-- TODO: find a way to avoid v-html -->
        <span v-html="replacePattern(str, /###([\w\s\-]+)###([A-Z0-9a-z\/.:#]+)###/, linkReplacement(true))"></span>
      </p>
    </b-jumbotron>

    <!-- title -->
    <content-title-edit
      :title="title"
      @set-title="title = $event"
    >
    </content-title-edit>
    <div
      class="free-text-edit bg-light"
      :class="langIsAr? 'text-right' : 'text-left'"
    >
      <span
        class="p-3"
      > {{ y18n('content') }} </span>
      <div id="free-text-editor"></div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Quill from 'quill'
import { locale, pluginEdit, routes, tooltipIcon } from '@/mixins'
import ContentTitleEdit from '@/components/helpers/content-title-edit'

export default {
  name: 'FreeTextEdit',
  components: { ContentTitleEdit },
  mixins: [
    locale,
    pluginEdit,
    routes,
    tooltipIcon
  ],

  data () {
    return {
      contents: null,
      title: { }
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

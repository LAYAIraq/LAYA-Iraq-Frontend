<!--
Filename: free-text-edit.vue
Use: Edit free text content block
Creator: core
Since: v1.0.0
-->

<template>
  <div :class="langIsAr ? 'text-right' : 'text-left'">
    <div
      v-if="title.show"
      :id="title.id"
      class="flaggable row"
    >
      <h2>{{ courseSimple ? title.simple : title.text }}</h2>
      <flag-icon
        v-if="!editPreview"
        :ref-data="title"
        @flagged="title.flagged = true"
      ></flag-icon>
    </div>
    <div class="free-text-edit bg-light" :class="langIsAr ? 'text-right' : 'text-left'">
      <span class="p-3"> {{ y18n('content') }} </span> <!-- unnötig -->
      <div id="free-text-editor"></div>
    </div>
    <button
      type="button"
      @click="commit"
    >Save
    </button>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Quill from 'quill'
import { locale, pluginView, routes, storeHandler } from '@/mixins'

export default {
  name: 'FreeTextQuestionView',

  mixins: [
    locale,
    pluginView,
    routes,
    storeHandler
  ],

  data () {
    return { ...this.viewData }
  },

  computed: {
    ...mapGetters(['courseContent', 'courseSimple', 'content', 'courseCreator', 'courseFlags', 'userId'])
  },

  created () {
    if (this.edit) {
      this.fetchData()
    }
  },

  mounted () {
    this.initQuill()
  },

  methods: {

    /**
     */
    async commit () {
      console.log(`this.contents -- ${JSON.stringify(this.contents)}`) //content des freitexts
      // console.log(this.contents) //content object des freitexts
      console.log('---------------------')
      // console.log(this.courseContent[this.pathId]) // dieses Assignment
      // console.log(this.$store.getters.course.courseId)
      // console.log(this.$store.getters) // funktionen zum callen
      // console.log(await this.$store.dispatch('enrollmentFetch', this.$store.getters.course.courseId)) //check for enrollement
      // console.log(this.$store.state.enrollment) //getEnrolement
      this.$store.state.enrollment['free-text'] = this.contents
      this.$store.dispatch('enrollmentUpdate')
      // console.log(this.enrollmentFetch())
      console.log('---------------------')
      // console.log(await this.courseFetch(this.name)) // g et course
      // this.$store.commit('FreetextAdd', { freetext: this.contents, id: 4285762394 })
      // this.$forceUpdate()
    },

    /**
     * Function fetchData: fetch data from vuex and make data property
     *
     * Author: cmc
     *
     * Last Updated: March 20, 2021
     */
    fetchData () {
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
        console.log(this.contents)
        this.$forceUpdate()
      })
      console.log('ssssssssssssss')
      if (this.$store.state.enrollment['free-text']) {
        quill.setContents(this.$store.state.enrollment['free-text'])
      }
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

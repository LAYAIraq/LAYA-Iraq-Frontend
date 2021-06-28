<!--
Filename: view.vue 
Use: View Freetext content block
Creator: core
Date: unknown
Dependencies: 
  vuex,
  quill,
  @/mixins/locale.vue
-->

<template>
  <div class="laya-wysiwyg-view">
    <div class="row" :id="title.id">
      <h4 v-if="title.show">{{ title.text }}</h4>
      <laya-flag v-if="title.flagged"></laya-flag>
    </div>
    <div :id="editorId"></div>
    <div class="row">
      <button 
        type="button"
        class="btn btn-primary mt-3 d-block ml-auto"
        :class="langIsAr? 'float-right': 'float-left'"
        @click="onFinish[0]() || {}">
        {{ i18n['nextContent'] }}
        <i 
          :class="langIsAr? 
            'fas fa-arrow-left': 
            'fas fa-arrow-right'"
        ></i>
      </button>
    </div>
  </div>

  

</template>

<script>
import 'quill/dist/quill.snow.css'
import Quill from 'quill'
import { locale } from '@/mixins'
import { mapGetters } from 'vuex'

export default {
  name: 'laya-wysiwyg',

  mixins: [
    locale
  ],

  data() {
    if(this.previewData) //for preview
      return {...this.previewData}
    return {
      contents: null
    }
  },
  created() {
    if (!this.previewData) this.fetchData()
  },
  mounted() {
    this.fetchContent()
  },
  computed: {
    ...mapGetters(['content']),

    /**
     * editorId: return id for html element
     * 
     * Author: core
     * 
     * Last Updated: unknown
     */
    editorId() {
      return `laya-wysiwyg-readonly-${Date.now()}`
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
      const preData = JSON.parse(JSON.stringify(this.content[idx].input))
      this.contents = preData.contents
      this.title = preData.title
      this.showTitle = preData.showTitle
    },
    /**
     * Function fetchContent: fetch contents from quill
     * 
     * Author: core
     * 
     * Last Updated: March 20, 2021
     */
    fetchContent() {
      const quill = new Quill(`#${this.editorId}`, {
        theme: 'snow',
        readOnly: true
      })
      quill.setContents(this.contents)
    }
  },
  props: {
    onFinish: Array,
    previewData: Object
  }
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

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
    <h4 v-if="showTitle">{{ title }}</h4>
    <div :id="editorId"></div>
    <button 
      type="button"
      class="btn btn-primary mt-3 d-block ml-auto"
      @click="onFinish[0]() || {}">
      {{ i18n['nextContent'] }}
      <i class="fas fa-arrow-right"></i>
    </button>
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
    if(Object.entries(this.$attrs).length === 3) //for preview
      return {...this.$attrs}
    return {
      contents: null
    }
  },
  created() {
    this.fetchData()
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
    onFinish: Array
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

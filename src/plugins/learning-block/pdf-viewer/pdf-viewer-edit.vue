<!--
Filename: pdf-viewer-edit.vue
Use: Edit pdf viewer content block
Creator: nv
Since: v1.3.0
-->

<template>
  <div
    :class="langIsAr? 'text-right' : 'text-left'"
    class="pdf-viewer-edit"
  >
    <div class="d-flex">
      <h2
        class="d-inline-block"
        :class="langIsAr? 'ml-auto' : 'mr-auto'"
      >
        {{ y18n('pdfViewer.name') }}
      </h2>
      <i
        id="questionmark"
        v-b-tooltip.left
        class="fas fa-question-circle"
        :title="y18n('showTip')"
        aria-labelledby="tooltipText"
        aria-live="polite"
        @click="toggleTip"
      ></i>
    </div>
    <b-jumbotron
      v-if="tooltipOn"
      id="tooltipText"
      :header="y18n('pdfViewer.name')"
      :lead="y18n('tipHeadline')"
    >
      <hr class="my-4">
      <span>
        {{ y18n('pdfViewer.tooltip') }}
      </span>
    </b-jumbotron>
    <hr>

    <form>
      <!-- title -->
      <content-title-edit
        :title="title"
        @set-title="title = $event"
      >
      </content-title-edit>
      <!-- pdf url -->
      <div class="form-group row">
        <label
          for="pdf-id"
          class="col-2 col-form-label"
        >
          {{ y18n('pdfViewer.url') }}
        </label>
        <div class="col-8">
          <input
            id="pdf-id"
            v-model="url"
            type="text"
            class="form-control"
            :placeholder="y18n('pdfViewer.placeholder')"
          >
        </div>
        <!-- URL warning -->
        <div
          v-if="urlMsg"
          id="url-hint"
          class="col form-check form-check-inline align-text-top"
        >
          <span class="text-danger form-control-plaintext text-right">
            {{ urlMsg }}
          </span>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { locale, pluginEdit, routes, tooltipIcon } from '@/mixins'
import { deepCopy } from '@/mixins/general/helpers'
import ContentTitleEdit from '@/components/helpers/content-title-edit'

export default {
  name: 'PdfViewerEdit',

  components: { ContentTitleEdit },

  mixins: [
    locale,
    pluginEdit,
    routes,
    tooltipIcon
  ],

  data () {
    return {
      url: '',
      title: {
        text: '',
        id: '',
        flagged: false
      }
    }
  },

  computed: {
    ...mapGetters(['courseContent', 'courseSimple']),

    /**
     * urlMsg: return warning if URL is not supported
     * Author: cmc
     * Since: v1.3.0 by nv
     */
    urlMsg () {
      if (!this.validUrl) {
        return this.y18n('pdfViewer.invalidUrl')
      } else {
        return null
      }
    },

    /**
     * function validUrl: check if string is a valid URL according to RFC 3886
     * Author: cmc
     * Since: v1.3.0 by nv
     */
    validUrl () {
      if (this.url === '') return false
      let url
      try {
        // eslint-disable-next-line prefer-const
        url = new URL(this.url)
      } catch (_) {
        return false
      }
      return url.protocol === 'http:' || url.protocol === 'https:'
    }
  },

  created () {
    if (this.edit) {
      this.fetchData()
    }
  },

  methods: {

    /**
     * Function fetchData: fetch data from vuex and make data property
     * Author: cmc
     * Since: v1.3.0 by nv
     */
    fetchData () {
      const preData = deepCopy(this.courseContent[this.pathId])
      this.title = preData.title
      this.url = preData.url
    }

  }
}
</script>

<style>

</style>

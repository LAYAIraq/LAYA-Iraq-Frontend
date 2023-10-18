<!--
Filename: pdf-text-edit.vue
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
        {{ y18n('pdf-viewer.name') }}
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
      :header="y18n('pdf-viewer.name')"
      :lead="y18n('tipHeadline')"
    >
      <hr class="my-4">
      <span>
        {{ y18n('pdf-viewer.tooltip') }}
      </span>
    </b-jumbotron>
    <hr>

    <form>
      <div class="form-group">
        <div class="row">
          <!-- title -->
          <label
            for="pdf-viewer-title"
            class="col-2 col-form-label"
          >
            {{ y18n('title') }}
          </label>
          <div class="col-10">
            <input
              id="pdf-viewer-title"
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
            for="pdf-viewer-title-simple"
            class="col-2 col-form-label'
l"
          >
            <span class="sr-only">
              {{ y18n('simpleAlt') }}
            </span>
          </label>
          <div class="col-8">
            <input
              id="pdf-viewer-title-simple"
              v-model="title.simple"
              type="text"
              class="form-control"
              :placeholder="y18n('simpleAlt')"
            >
          </div>
        </div>
      </div>
      <!-- pdf url -->
      <div class="form-group row">
        <label
          for="pdf-id"
          class="col-2 col-form-label"
        >
          {{ y18n('pdf-viewer.url') }}
        </label>
        <div class="col">
          <input
            id="pdf-id"
            v-model="src"
            type="text"
            class="form-control"
            :placeholder="y18n('pdf-viewer.placeholder')"
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

export default {
  name: 'PdfViewerEdit',

  mixins: [
    locale,
    pluginEdit,
    routes,
    tooltipIcon
  ],

  data () {
    return {
      src: '',
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
     * Last Updated: 04.08.23 by nv
     */
    urlMsg () {
      if (!this.validUrl) {
        return this.y18n('pdf-viewer.invalidUrl')
      } else {
        return null
      }
    },

    /**
     * function validUrl: check if string is a valid URL according to RFC 3886
     * Author: cmc
     * Last Updated: 04.08.23 by nv
     */
    validUrl () {
      if (this.src === '') return false
      let url
      try {
        // eslint-disable-next-line prefer-const
        url = new URL(this.src)
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
     * Last Updated: 04.08.23 by nv
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

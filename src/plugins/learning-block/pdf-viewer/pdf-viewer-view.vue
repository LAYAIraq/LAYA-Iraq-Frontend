<!--
Filename: pdf-text-view.vue
Use: View pdf viewer content block
Creator: nv
Since: v1.3.0
-->
<template>
  <div
    class="pdf-viewer-view"
    :class="langIsAr? 'text-right' : 'text-left'"
  >
    <div
      v-if="title.show"
      :id="title.id"
      class="flaggable row"
    >
      <h2>{{ courseSimple? title.simple : title.text }}</h2>
      <flag-icon
        v-if="!editPreview"
        :ref-data="title"
        @flagged="title.flagged = true"
      ></flag-icon>
    </div>
    <div>
      <vue-pdf-embed
        :source="src"
      >
      </vue-pdf-embed>
    </div>
    <div class="row">
      <button
        type="button"
        class="btn btn-primary mt-3 d-block"
        :class="langIsAr? 'float-left mr-auto': 'float-right ml-auto'"
        @click="onFinish[0]() || {}"
      >
        {{ y18n('nextContent') }}
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
import { locale, pluginView } from '@/mixins'
import '@/assets/styles/flaggables.css'
import FlagIcon from '@/components/course/flag/flag-icon.vue'
import VuePdfEmbed from 'vue-pdf-embed/dist/vue2-pdf-embed'

export default {
  name: 'PdfViewerView',
  components: {
    FlagIcon,
    VuePdfEmbed
  },
  mixins: [
    locale,
    pluginView
  ],

  data () {
    return {
      ...this.viewData,
      src: '/home/dozhpiven/Downloads/transaktion.pdf'
    }
  }
}
</script>

<style>
.vue-pdf-embed > div {
  margin-bottom: 8px;
  box-shadow: 0 2px 8px 4px rgba(0, 0, 0, 0.1);
}
</style>

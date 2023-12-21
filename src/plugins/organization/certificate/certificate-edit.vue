<!--
Filename: certificate-edit.vue
Use: Edit certificate content block
Creator: nv
Since: v1.3.0
-->

<template>
  <div
    :class="langIsAr? 'text-right' : 'text-left'"
  >
    <div class="row">
      <div class="col">
        <h1 class="d-inline-block mr-auto">
          {{ y18n('certificate.name') }}
        </h1>

        <i
          id="questionmark"
          v-b-tooltip.left
          class="fas fa-question-circle"
          :class="langIsAr? 'mr-auto' : 'ml-auto'"
          :title="y18n('showTip')"
          aria-labelledby="tooltipText"
          aria-live="polite"
          @click="toggleTip"
        ></i>
      </div>
    </div>

    <hr>

    <b-jumbotron
      v-if="tooltipOn"
      id="tooltipText"
      :header="y18n('certificate.name')"
      :lead="y18n('tipHeadline')"
    >
      <hr class="my-4">
      <span>
        {{ y18n('certificate.tooltip') }}
      </span>
    </b-jumbotron>

    <form>
      <div class="form-group">
        <!-- title -->
        <content-title-edit
          :title="title"
          @set-title="title = $event"
        >
        </content-title-edit>
        <!-- signature
        <div class="row">
          <label
            for="signature"
            class="col-2 col-form-label"
          >
            {{ y18n('certificate.signature') }}
          </label>
          <div class="col-10">
            <textarea
              id="signature"
              v-model="signature.image"
              class="w-100"
              :placeholder="y18n('certificate.optional')"
            ></textarea>
          </div>
        </div>
        -->
      </div>
    </form>
  </div>
</template>

<script>
import { locale, pluginEdit, routes, tooltipIcon } from '@/mixins'
import { mapGetters } from 'vuex'
import { deepCopy } from '@/mixins/general/helpers'
import ContentTitleEdit from '@/components/helpers/content-title-edit'

export default {
  name: 'CertificateEdit',

  components: { ContentTitleEdit },

  mixins: [
    locale,
    pluginEdit,
    tooltipIcon,
    routes
  ],

  data () {
    return {
      signature: '',
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

  methods: {
    /**
     * Function fetchData: Fetch data from vuex and make data property
     *
     * Author: cmc
     *
     * Last Updated: March 19, 2021
     */
    fetchData () {
      // create deep copy of store object to manipulate in vue instance
      const preData = deepCopy(this.courseContent[this.pathId])
      this.signature = preData.signature
      this.title = preData.title
    }
  }
}
</script>

<style scoped>

</style>

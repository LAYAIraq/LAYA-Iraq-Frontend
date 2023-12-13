<!--
  Filename: content-title-edit.vue
  Use: title and simple title field for edit components
  Author: nv
  Since: v1.3.0
-->

<template>
  <form>
    <div class="form-group">
      <div class="row">
        <!-- title -->
        <label
          for="title"
          class="col-2 col-form-label"
        >
          {{ y18n('title') }}
        </label>
        <div class="col-8">
          <input
            id="title"
            v-model="titleLocal.text"
            type="text"
            class="form-control"
            :placeholder="y18n('titlePlaceholder')"
          >
          <p
            v-if="titleEmpty"
            id="title-empty"
          >
            {{ y18n('contentTitleEdit.warning.titleEmpty') }}
          </p>
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
              v-model="titleLocal.show"
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
          for="title-simple"
          class="col-2 col-form-label"
        >
          <span class="sr-only">
            {{ y18n('simpleAlt') }}
          </span>
        </label>
        <div class="col-8">
          <input
            id="title-simple"
            v-model="titleLocal.simple"
            type="text"
            class="form-control"
            :placeholder="y18n('simpleAlt')"
          >
          <p
            v-if="missing"
            id="missing-simple-language"
          >
            {{ y18n('simpleAlt.missing') }}
          </p>
        </div>
      </div>
    </div>
  </form>
</template>

<script>
import { mapGetters } from 'vuex'
import { locale } from '@/mixins'
import { deepCopy } from '@/mixins/general/helpers'

export default {
  name: 'ContentTitleEdit',

  mixins: [
    locale
  ],

  props: {
    title: {
      type: Object,
      required: true
    }
  },

  data () {
    return {
      titleLocal: deepCopy(this.title)
    }
  },

  computed: {
    ...mapGetters(['courseSimple']),
    titleEmpty () {
      return !this.titleLocal.text
    },
    missing () {
      return !this.titleLocal.simple
    }
  },
  watch: {
    titleLocal: {
      handler () {
        this.titleSet()
      },
      deep: true
    }
  },

  methods: {
    titleSet () {
      this.$emit('set-title', this.titleLocal)
    }
  }
}

</script>

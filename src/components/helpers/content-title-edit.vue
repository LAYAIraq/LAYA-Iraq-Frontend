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
            v-model="title.text"
            type="text"
            class="form-control"
            :placeholder="y18n('titlePlaceholder')"
            @input="titleEmpty = false"
          >
          <p
            v-if="titleEmpty || title.text === ''"
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
              v-model="title.show"
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
            v-model="title.simple"
            type="text"
            class="form-control"
            :placeholder="y18n('simpleAlt')"
          >
        </div>
      </div>
    </div>
  </form>
</template>

<script>

import { locale } from '@/mixins'

export default {
  name: 'ContentTitleEdit',

  mixins: [
    locale
  ],

  data () {
    return {
      title: { },
      titleEmpty: true
    }
  },

  computed: {
    ...mapGetters(['courseSimple'])
  },
  watch: {
    titleLocal: {
      handler () {
        console.log('title changed!!!!')
        this.titleSet()
      },
      deep: true
    }
  },

  methods: {

    logInput () {
      console.log('input!!!!')
      this.titleEmpty = false
    },

    titleSet () {
      console.log('show title ' + this.title)
      this.$emit('set-title', this.titleLocal)
    }
  }
}

</script>

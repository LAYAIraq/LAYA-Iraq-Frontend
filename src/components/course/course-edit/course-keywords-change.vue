<!--
Filename: course-keywords-change.vue
Use: Change course keywords
Author: nv
Since: v1.3.0
-->

<template>
  <div class="row mt-3">
    <div class="col">
      <b-button
        size="sm"
        class="w-50"
        variant="warning"
        :class="langIsAr? 'float-left' : 'float-right'"
        @click="$bvModal.show('author-change-keywords-confirm')"
      >
        <i class="fas fa-exclamation-circle"></i> {{ y18n('changeKeywords') }}
      </b-button>
    </div>

    <div class="col text-dark">
      {{ y18n('changeKeywords.tip') }}
    </div>

    <b-modal
      id="author-change-keywords-confirm"
      :title="y18n('changeKeywords')"
      header-bg-variant="warning"
      ok-variant="success"
      cancel-variant="primary"
      :ok-title="y18n('save')"
      :cancel-title="y18n('cancel')"
      centered
      static
      :aria-label="y18n('popupwarning')"
      @ok="changeCourseKeywords"
    >
      <p>
        {{ y18n('changeKeywords') }}
        <input
          v-model="newKeywords"
          type="text"
          class="form-control"
          :class="'border border-danger'"
          :placeholder="y18n('changeKeywords.new')"
          :aria-label="y18n('changeKeywords.new')"
        >
      </p>
    </b-modal>
    <div
      id="openPopup"
      style="display:none"
    >
      {{ y18n('popupwarning') }}
    </div>
  </div>
</template>

<script>
import { locale } from '@/mixins'
import { mapGetters } from 'vuex'

export default {
  name: 'CourseKeywordsChange',

  mixins: [
    locale
  ],

  data () {
    return {
      newKeywords: ''
    }
  },

  computed: {
    ...mapGetters(['course'])

  },

  methods: {

    /**
     * Function changeCourseKeywords: change course keywords
     * Author: nv
     * Since: v1.3.0
     */
    changeCourseKeywords (e) {
      e.preventDefault()
      if (this.newKeywords !== this.course.keywords) {
        this.$nextTick(() => {
          this.$bvModal.hide('author-change-keywords-confirm')
        })
        this.$store.commit('courseKeywordsChange')
        this.$store.dispatch('courseUpdate')
          .then(() => {
            this.$store.dispatch('courseListFetch')
            this.$emit('changedKeywords')
          })
          .catch(err => console.error(err))
      }
    }
  }
}
</script>

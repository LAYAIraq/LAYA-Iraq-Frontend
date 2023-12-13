<!--
Filename: course-abstract-change.vue
Use: Change course abstract
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
        @click="$bvModal.show('author-change-abstract-confirm')"
      >
        <i class="fas fa-exclamation-circle"></i> {{ y18n('changeAbstract') }}
      </b-button>
    </div>

    <div class="col text-dark">
      {{ y18n('changeAbstract.tip') }}
    </div>

    <b-modal
      id="author-change-abstract-confirm"
      :title="y18n('changeAbstract')"
      header-bg-variant="warning"
      ok-variant="success"
      cancel-variant="primary"
      :ok-title="y18n('save')"
      :cancel-title="y18n('cancel')"
      centered
      static
      :aria-label="y18n('popupwarning')"
      @ok="changeCourseabstract"
    >
      <p>
        {{ y18n('changeAbstract') }}
        <input
          v-model="newAbstract"
          type="text"
          class="form-control"
          :class="'border border-danger'"
          :placeholder="y18n('changeAbstract.new')"
          :aria-label="y18n('changeAbstract.new')"
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
  name: 'CourseAbstractChange',

  mixins: [
    locale
  ],

  data () {
    return {
      newAbstract: ''
    }
  },

  computed: {
    ...mapGetters(['course'])
  },

  methods: {

    /**
     * Function changeCourseAbstract: change course Abstract
     * Author: nv
     * Since: v1.3.0
     */
    changeCourseabstract (e) {
      e.preventDefault()
      if (this.newAbstract !== this.course.abstract) {
        this.$nextTick(() => {
          this.$bvModal.hide('author-change-abstract-confirm')
        })
        this.$store.commit('courseAbstractChange')
        this.$store.dispatch('courseUpdate')
          .then(() => {
            this.$store.dispatch('courseListFetch')
            this.$emit('changedAbstract')
          })
          .catch(err => console.error(err))
      }
    }
  }
}
</script>

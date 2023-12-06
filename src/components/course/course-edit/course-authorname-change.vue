<!--
Filename: course-authorname-change.vue
Use: Change course author name
Author: nv
Since: v1.3.0
-->

<template>
  <div class="row mt-3">
    <div class="col">
      <b-button
        size="sm"
        variant="warning"
        :class="langIsAr? 'float-left' : 'float-right'"
        @click="$bvModal.show('author-change-authorname-confirm')"
      >
        <i class="fas fa-exclamation-circle"></i> {{ y18n('changeAuthorName') }}
      </b-button>
    </div>

    <div class="col text-dark">
      {{ y18n('changeAuthorName.tip') }}
    </div>

    <b-modal
      id="author-change-authorname-confirm"
      :title="y18n('changeAuthorName')"
      header-bg-variant="warning"
      ok-variant="success"
      cancel-variant="primary"
      :ok-title="y18n('save')"
      :cancel-title="y18n('cancel')"
      centered
      static
      :aria-label="y18n('popupwarning')"
      @ok="changeCourseAuthorName"
    >
      <p>
        {{ y18n('changeAuthorName') }}
        <input
          v-model="newAuthorName"
          type="text"
          class="form-control"
          :class="'border border-danger'"
          :placeholder="y18n('changeAuthorName.new')"
          :aria-label="y18n('changeAuthorName.new')"
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
  name: 'CourseAuthorNameChange',

  mixins: [
    locale
  ],

  data () {
    return {
      newAuthorName: ''
    }
  },

  computed: {
    ...mapGetters(['course'])

  },

  methods: {

    /**
     * Function changeCourseAuthorName: change course author name
     * Author: nv
     * Since: v1.3.0
     */
    changeCourseAuthorName (e) {
      e.preventDefault()
      if (this.newAuthorName !== this.course.authorName) {
        this.$nextTick(() => {
          this.$bvModal.hide('author-change-authorname-confirm')
        })
        this.$store.commit('courseAuthorNameChange', this.newAuthorName)
        console.log('authornamechange')
        this.$store.dispatch('courseUpdate')
          .then(() => {
            this.$store.dispatch('courseListFetch')
            this.$emit('changedAuthorName')
          })
          .catch(err => console.error(err))
      }
    }
  }
}
</script>

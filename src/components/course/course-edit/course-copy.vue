<!--
Filename: course-copy.vue
Use: Provide tools for copying a course
Creator: cmc
Date: October 27, 2020
Dependencies:
  axios,
  vuex,
@/mixins/locale.vue
-->

<template>
  <!-- Copy Course -->
  <div class="row mt-3">
    <div class="col">
      <b-button
        size="sm"
        variant="warning"
        :class="langIsAr? 'float-left' : 'float-right'"
        aria-describedby="openPopup"
        @click="$bvModal.show('author-copyCourse-confirm')"
      >
        <i class="fas fa-exclamation-circle"></i> {{ y18n('copyCourse') }}
      </b-button>
    </div>

    <div class="col text-dark">
      {{ y18n('copy.copyCourseTip') }}
    </div>

    <b-modal
      id="author-copyCourse-confirm"
      :title="y18n('copyCourse')"
      header-bg-variant="warning"
      ok-variant="warning"
      :ok-title="y18n('copy.modal.ok')"
      :cancel-title="y18n('cancel')"
      :aria-label="y18n('popupwarning')"
      centered
      @ok="copyCourse"
    >
      <p>
        {{ y18n('copy.modal.text') }}
        <input
          v-model="copy"
          type="text"
          class="form-control"
          :placeholder="y18n('placeholder')"
          :aria-label="y18n('placeholder')"
        >
      </p>
    </b-modal>
    <div
      id="openPopup"
      style="display:none"
    >
      {{ y18n('popupwarning') }}
    </div>

    <b-toast
      id="name-exists"
      :title="y18n('authorTools')"
      static
      variant="danger"
      auto-hide-delay="1500"
      class="author-toast"
    >
      {{ y18n('copy.toast.text') }}
    </b-toast>

    <b-toast
      id="copy-success"
      :title="y18n('authorTools')"
      static
      variant="success"
      auto-hide-delay="1500"
      class="author-toast"
    >
      {{ y18n('copy.toast.copySuccess') }}
    </b-toast>
  </div>
</template>

<script>
import http from 'axios'
import { locale } from '@/mixins'
import { mapGetters } from 'vuex'

export default {
  name: 'CourseCopy',

  mixins: [
    locale
  ],

  data () {
    return {
      copy: ''
    }
  },

  computed: {
    ...mapGetters(['course'])
  },

  methods: {

    /**
     * Function copyCourse: copy course if no course with that name
     *  already exists
     *
     * Author: cmc
     *
     * Last Updated: October 27, 2020
     */
    copyCourse () {
      if (!this.copy) return
      console.log('new copy', this.copy)
      http.head(`courses/${this.copy}`)
        .then(() => {
        // course name already exists
          this.$bvToast.show('name-exists')
        })
        .catch(() => {
          // course name does not exist
          this.$store.dispatch('courseCopy', this.copy)
            .then(() => this.$bvToast.show('copy-success'))
            .catch(err => alert(err))
        })
    }
  }
}
</script>

<style scoped>
.name-exists {
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 11005;
}
</style>

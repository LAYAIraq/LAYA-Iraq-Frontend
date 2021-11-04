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
      <b-button size="sm"
        variant="warning"
        :class="langIsAr? 'float-left' : 'float-right'"
        @click="$bvModal.show('author-copyCourse-confirm')"
      aria-describedby="openPopup">
        <i class="fas fa-exclamation-circle"></i> {{ i18n['copyCourse'] }}
      </b-button>
    </div>

    <div class="col text-dark">
      {{ i18n['copy.copyCourseTip'] }}
    </div>

    <b-modal id="author-copyCourse-confirm"
      :title="i18n['copyCourse']"
      header-bg-variant="warning"
      ok-variant="warning"
      :ok-title="i18n['copy.modal.ok']"
      :cancel-title="i18n['cancel']"
      @ok="copyCourse"
             :aria-label="i18n['popupwarning']"
      centered>
      <p>
        {{ i18n['copy.modal.text'] }}
        <input
          type="text"
          v-model="copy"
          class="form-control"
          :placeholder="i18n['placeholder']"
          :aria-label="i18n['placeholder']">
      </p>
    </b-modal>
    <div id="openPopup" style="display:none" >{{ i18n['popupwarning'] }}</div>

    <b-toast id="name-exists"
      :title="i18n['authorTools']"
      static
      variant="danger"
      auto-hide-delay="1500"
      class="author-toast">
      {{ i18n['copy.toast.text'] }}
    </b-toast>

    <b-toast id="copy-success"
      :title="i18n['authorTools']"
      static
      variant="success"
      auto-hide-delay="1500"
      class="author-toast">
      {{ i18n['copy.toast.copySuccess'] }}
    </b-toast>

	</div>
</template>

<script>
import http from 'axios'
import { locale } from '@/mixins'
import { mapGetters } from 'vuex'

export default {
  name: 'course-copy',
  mixins: [
    locale
  ],
  computed: {
    ...mapGetters(['course']),
  },
  data() {
    return{
      copy: ''
    }
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
    copyCourse() {
      if(!this.copy) return
      console.log('new copy', this.copy)
      http.head(`courses/${this.copy}`)
        .then( () => {
        // course name already exists
          this.$bvToast.show('name-exists')
        })
        .catch( () => {
          // course name does not exist
          this.$store.dispatch('copyCourse', this.copy)
            .then( () => this.$bvToast.show('copy-success'))
            .catch( err => alert(err))
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
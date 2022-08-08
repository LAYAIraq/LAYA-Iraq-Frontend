<!--
Filename: course-rename.vue
Use: Rename whole course
Author: cmc
Date: October 27, 2020
Dependencies:
  vuex,
  @/mixins/locale.vue
-->

<template>
  <div class="row mt-3">
    <div class="col">
      <b-button
        size="sm"
        variant="warning"
        :class="langIsAr? 'float-left' : 'float-right'"
        @click="$bvModal.show('author-change-category-confirm')"
      >
        <i class="fas fa-exclamation-circle"></i> {{ y18n('changeCategory') }}
      </b-button>
    </div>

    <div class="col text-dark">
      {{ y18n('changeCategory.tip') }}
    </div>

    <b-modal
      id="author-change-category-confirm"
      :title="y18n('changeCategory')"
      header-bg-variant="warning"
      ok-variant="warning"
      :ok-title="y18n('rename.modal.ok')"
      :cancel-title="y18n('cancel')"
      centered
      :aria-label="y18n('popupwarning')"
      @ok="changeCourseCategory"
    >
      <p>
        {{ y18n('copy.modal.text') }}
        <input
          v-model="newCategory"
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
  </div>
</template>

<script>
import { locale } from '@/mixins'
import { mapGetters } from 'vuex'

export default {
  name: 'CourseChangeCategory',

  mixins: [
    locale
  ],

  data () {
    return {
      newCategory: '',
      oldCategory: ''
    }
  },

  computed: {
    ...mapGetters(['course'])
  },

  methods: {

    /**
     * Function renameCourse: rename Course, change route to new name
     *
     * Author: cmc
     *
     * Last Updated: March 24, 2021
     */
    changeCourseCategory () {
      if (!this.newCategory) return
      this.$store.commit('changeCourseCategory', this.newCategory)
      this.$store.dispatch('updateCourse', this.course)
        .then(() => this.$emit('changedCategory'))
        .catch(err => console.error(err))
    }
  }
}
</script>

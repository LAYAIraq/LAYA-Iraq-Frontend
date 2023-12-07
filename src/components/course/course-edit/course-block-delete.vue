<!--
Filename: course-block-delete.vue
Use: Provides tool to delete content block
Creator: cmc
Date: October 27, 2020
Dependencies:
  vuex,
  @/mixins/locale.vue
-->

<template>
  <div
    v-if="contentToDisplay"
    id="delete-content"
    class="row mt-5"
  >
    <div
      class="col"
    >
      <b-button
        size="sm"
        variant="danger"
        :class="langIsAr? 'float-left' : 'float-right'"
        @click="$bvModal.show('author-delContent-confirm')"
      >
        <i class="fas fa-exclamation-circle"></i> {{ y18n('deleteContent') }}
      </b-button>
    </div>

    <div class="col text-dark">
      {{ y18n('deleteBlock.deleteContentTip') }}
    </div>

    <b-modal
      id="author-delContent-confirm"
      :title="y18n('deleteContent')"
      header-bg-variant="danger"
      ok-variant="danger"
      :ok-title="y18n('delete')"
      :cancel-title="y18n('cancel')"
      centered
      static
      @ok="delContent"
    >
      <p>
        {{ y18n('deleteBlock.modal.text') }}
      </p>
    </b-modal>
  </div>
</template>

<script>
import { locale, routes } from '@/mixins'

export default {
  name: 'CourseBlockDelete',

  mixins: [
    locale,
    routes
  ],

  methods: {

    /**
     * Function delContent: remove current content block in store
     *
     * Author: cmc
     *
     * Last Updated: October 27, 2020
     */
    delContent () {
      this.$store.commit('courseContentRemove', this.pathId)
      this.$store.commit('courseChaptersContentRemove', this.pathId)
      this.$store.commit('courseRoutesUpdate')
      this.$store.dispatch('courseUpdate')
    }
  }
}
</script>

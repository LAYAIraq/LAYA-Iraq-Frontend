<!--
Filename: course-delete-block.vue
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
    class="row mt-5"
  >
    <div class="col">
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
      @ok="delContent"
    >
      <p>
        {{ y18n('deleteBlock.modal.text') }}
      </p>
    </b-modal>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { locale, routeProps } from '@/mixins'

export default {
  name: 'CourseDeleteBlock',

  mixins: [
    locale,
    routeProps
  ],

  computed: {
    ...mapGetters(['content']),
    ...mapState(['edit'])
  },

  methods: {

    /**
     * Function contentToDisplay: return current content block
     *
     * Author: cmc
     *
     * Last Updated: March 24, 2021
     */
    contentToDisplay () {
      return this.content[this.step - 1]
    },

    /**
     * Function delContent: remove current content block in store
     *
     * Author: cmc
     *
     * Last Updated: October 27, 2020
     */
    delContent () {
      this.$store.commit('delContent', this.step - 1)
      this.$store.dispatch('storeCourse')
    }

  }
}
</script>

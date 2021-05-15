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
  <div class="row mt-5" v-if="contentToDisplay">

    <div class="col">
      <b-button size="sm"
          variant="danger"
          class="float-right"
          @click="$bvModal.show('author-delContent-confirm')">
        <i class="fas fa-exclamation-circle"></i> {{ i18n['deleteContent'] }}
      </b-button>
    </div>

    <div class="col text-dark">
      {{ i18n['deleteBlock.deleteContentTip'] }}
    </div>

    <b-modal id="author-delContent-confirm"
        :title="i18n['deleteContent']"
        header-bg-variant="danger"
        ok-variant="danger"
        :ok-title="i18n['delete']"
        :cancel-title="i18n['cancel']"
        @ok="delContent"
        centered>
      <p>
        {{ i18n['deleteBlock.modal.text'] }}
      </p>
    </b-modal>

  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { locale } from '@/mixins'

export default {
  name: 'course-delete-block',
  mixins: [
    locale
  ],
  computed: {
    ...mapGetters(['content']),
    ...mapState(['edit'])
  },

  props: {
    name: String,
    step: String
  },

  methods: {

    /**
     * Function contentToDisplay: return current content block
     * 
     * Author: cmc
     * 
     * Last Updated: March 24, 2021
     */
    contentToDisplay() {
      return this.content[this.step-1]
    },

    /**
     * Function delContent: remove current content block in store
     * 
     * Author: cmc
     * 
     * Last Updated: October 27, 2020
     */
    delContent() {
      this.$store.commit('delContent', this.step-1) 
      this.$store.dispatch('storeCourse')
    }
    
  }
}
</script>
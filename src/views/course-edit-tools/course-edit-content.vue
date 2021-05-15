<!--
Filename: course-edit-content.vue 
Use: Reroute to edit content block
Creator: cmc
Date: October 27, 2020
Dependencies: 
  vuex,
  @/mixins/locale.vue
-->

<template>
    <div class="row mb-2" v-if="contentToDisplay">
        <div class="col">
            <b-button variant="primary" block append
                    :to="{path: 'edit', params: {type: contentToDisplay.name}}">
            <i class="fas fa-edit"></i> {{ i18n['content.editContent'] }}
            </b-button>
        </div>

        <div class="col text-dark">
            {{ i18n['content.editContentTip'].replace('{step}', this.step) }}
        </div>
    </div>

</template>

<script>
import { locale } from '@/mixins'
import { mapGetters } from 'vuex'

export default {
  name: 'course-edit-content',

  mixins: [
    locale 
  ],

  computed: {
    ...mapGetters(['content']),

    /**
     * contentToDisplay: return current content object
     * 
     * Author: cmc
     * 
     * Last Updated: October 27, 2020
     */
    contentToDisplay() {
      return this.content[this.step-1]
    }
  },

  props: {
    name: String,
    step: String
  }

}
</script>
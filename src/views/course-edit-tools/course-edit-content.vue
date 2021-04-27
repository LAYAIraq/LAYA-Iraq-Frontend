<!--
Filename: course-edit-content.vue 
Use: Reroute to edit content block
Creator: cmc
Date: October 27, 2020
Dependencies: 
  vuex,
  @/i18n/course-edit/content
-->

<template>
    <div class="row mb-2" v-if="contentToDisplay">
        <div class="col">
            <b-button variant="primary" block append
                    :to="{path: 'edit', params: {type: contentToDisplay.name}}">
            <i class="fas fa-edit"></i> {{ i18n.editContent }}
            </b-button>
        </div>

        <div class="col text-dark">
            {{ i18n.editContentTip.replace('{step}', this.step) }}
        </div>
    </div>

</template>

<script>
import * as i18n from '@/i18n/course-edit/content'
import { mapGetters } from 'vuex'

export default {
  name: 'course-edit-content',

  props: {
    name: String,
    step: String
  },

  computed: {
    ...mapGetters(['profileLang', 'content']),

    /**
     * contentToDisplay: return current content object
     * 
     * Author: cmc
     * 
     * Last Updated: October 27, 2020
     */
    contentToDisplay() {
      return this.content[this.step-1]
    },

    /**
   * i18n: Load translation files depending on user language
   * 
   * Author: cmc
   * 
   * Last updated: March 20, 2021
   * 
   */
    i18n() {
      return i18n[this.profileLang]
    }
  }

}
</script>
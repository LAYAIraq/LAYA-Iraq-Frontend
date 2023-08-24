<!--
Filename: course-language-change.vue
Use: Change course language
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
        @click="$bvModal.show('author-change-language-confirm')"
      >
        <i class="fas fa-exclamation-circle"></i> {{ y18n('changeCourseLanguage') }}
      </b-button>
    </div>

    <div class="col text-dark">
      {{ y18n('changeCourseLanguage.tip') }}
    </div>

    <b-modal
      id="author-change-language-confirm"
      :title="y18n('changeCourseLanguage')"
      header-bg-variant="warning"
      ok-variant="warning"
      :ok-title="y18n('save')"
      :cancel-title="y18n('cancel')"
      centered
      static
      :aria-label="y18n('popupwarning')"
      @ok="changeCourseLanguage"
    >
      <p>
        {{ y18n('changeCourseLanguage') }}
        <b-form-select
          v-model="newLanguage"
          :aria-label="y18n('changeCourseLanguage.new')"
        >
          <b-form-select-option
            v-for="opt in languageChoose"
            :key="opt"
            :value="opt"
          >
            {{ y18n(`profile.language.${opt}`) }}
          </b-form-select-option>
        </b-form-select>
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
import languages from '@/options/languages'

export default {
  name: 'CourseLanguageChange',

  mixins: [
    locale
  ],

  data () {
    return {
      newLanguage: ''
    }
  },

  computed: {
    ...mapGetters(['course']),

    /**
     * languageChoose(): add laguage
     * Author: nv
     * Since: v1.3.0
     */
    languageChoose () {
      return [
        ...languages
      ]
    }
  },

  methods: {

    /**
     * Function changeCourseLanguage: change course language
     * Author: nv
     * Since: v1.3.0
     */
    changeCourseLanguage (e) {
      e.preventDefault()
      this.$nextTick(() => {
        this.$bvModal.hide('author-change-language-confirm')
      })
      this.$store.commit('courseLanguageChange', this.newLanguage)
      this.$store.dispatch('courseUpdate')
        .then(() => {
          this.$store.dispatch('courseListFetch')
          this.$emit('changedLanguage')
        })
        .catch(err => console.error(err))
      // }
    }
  }
}
</script>

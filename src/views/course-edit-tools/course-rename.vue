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
        @click="$bvModal.show('author-renameCourse-confirm')"
      >
        <i class="fas fa-exclamation-circle"></i> {{ i18n['renameCourse'] }}
      </b-button>
    </div>

    <div class="col text-dark">
      {{ i18n['rename.renameCourseTip'] }}
    </div>

    <b-modal
      id="author-renameCourse-confirm"
      :title="i18n['renameCourse']"
      header-bg-variant="warning"
      ok-variant="warning"
      :ok-title="i18n['rename.modal.ok']"
      :cancel-title="i18n['cancel']"
      centered
      :aria-label="i18n['popupwarning']"
      @ok="renameCourse"
    >
      <p>
        {{ i18n['copy.modal.text'] }}
        <input
          v-model="rename"
          type="text"
          class="form-control"
          :placeholder="i18n['placeholder']"
          :aria-label="i18n['placeholder']"
        >
      </p>
    </b-modal>
    <div
      id="openPopup"
      style="display:none"
    >
      {{ i18n['popupwarning'] }}
    </div>
  </div>
</template>

<script>
import { locale } from '@/mixins'
import { mapGetters } from 'vuex'

export default {
  name: 'CourseRename',

  mixins: [
    locale
  ],

  data () {
    return {
      rename: '',
      oldName: ''
    }
  },

  computed: {
    ...mapGetters(['course'])
  },

  methods: {

    /**
     * Function duplicateCheck: check if rename already exists,
     *  call renameCourse() if it doesn't
     *
     * Author: cmc
     *
     * Last Updated: March 24, 2021
     */

    duplicateCheck (click) {
      click.preventDefault()
      if (!this.rename) {
        this.$nextTick(() => {
          this.$bvModal.hide('author-rename-course-confirm')
        })
        return
      }
      if (!this.courseList) this.$store.dispatch('fetchCourseList')
      if (this.courseList.some(e => e.name === this.rename)) {
        this.dupeName = true
      } else {
        this.dupeName = false
        this.renameCourse()
      }
    },

    /**
     * Function renameCourse: rename Course, change route to new name
     *
     * Author: cmc
     *
     * Last Updated: March 24, 2021
     */
    renameCourse () {
      if (!this.rename) return
      const newName = this.rename
      const step = this.$route.params.step
      this.$store.commit('renameCourse', newName)
      const renamed = this.$store.dispatch('updateRenamedCourse')

      renamed.then(() => {
        this.$router.replace(`/courses/${newName}/${step}`)
        console.log('Renaming successful!')
        this.$emit('renamed')
      })
        .catch(err => {
          console.error(err)
          console.log('Renaming failed!')
        })
    }
  }
}
</script>

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
        class="w-50"
        variant="warning"
        :class="langIsAr? 'float-left' : 'float-right'"
        @click="$bvModal.show('author-rename-course-confirm')"
      >
        <i class="fas fa-exclamation-circle"></i> {{ y18n('renameCourse') }}
      </b-button>
    </div>

    <div class="col text-dark">
      {{ y18n('rename.renameCourseTip') }}
    </div>

    <b-modal
      id="author-rename-course-confirm"
      :title="y18n('renameCourse')"
      header-bg-variant="warning"
      ok-variant="success"
      cancel-variant="primary"
      :ok-title="y18n('save')"
      :cancel-title="y18n('cancel')"
      centered
      static
      :aria-label="y18n('popupwarning')"
      :ok-disabled="rename === course.name"
      @ok="handleOk"
    >
      <p>
        {{ y18n('copy.modal.text') }}
        <input
          v-model="rename"
          type="text"
          class="form-control"
          :class="{ 'border-danger': !renameOk }"
          :placeholder="y18n('placeholder')"
          :aria-label="y18n('placeholder')"
          @keyup.enter="handleOk"
        >
      </p>
      <p
        v-if="dupeName"
        id="duplicate-name-error"
      >
        {{ y18n('rename.modal.dupeName') }}
      </p>
      <p
        v-if="noName"
        id="no-input-error"
      >
        {{ y18n('rename.modal.noName') }}
      </p>
      <p
        v-if="rename === course.name"
        id="same-name-error"
      >
        {{ y18n('rename.modal.sameName') }}
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
import { slugify } from '@/mixins/general/slugs'

export default {
  name: 'CourseRename',

  mixins: [
    locale
  ],

  data () {
    return {
      dupeName: false,
      noName: false,
      rename: '',
      oldName: ''
    }
  },

  computed: {
    ...mapGetters(['course', 'courseList']),

    renameOk () {
      return this.rename !== '' &&
        !this.dupeName &&
        !this.noName &&
        this.rename !== this.course.name
    }
  },

  watch: {
    noName (val) { // reset dupeName if noName is true
      if (val) {
        this.dupeName = false
      }
    },
    rename () { // reset dupeName when input changes
      if (this.dupeName) {
        this.dupeName = false
      }
    }
  },

  methods: {

    /**
     * Function duplicateCheck: check if rename already exists,
     *  call renameCourse() if it doesn't
     *
     * Author: cmc
     *
     * Last Updated: November 7, 2022
     */

    duplicateCheck () {
      if (this.courseList.length === 0) this.$store.dispatch('courseListFetch')
      if (this.courseList.some(e => e.name === this.rename)) {
        this.dupeName = true
      } else {
        this.dupeName = false
        this.renameCourse()
      }
    },

    /**
     * Function handleOk: trigger validation of rename
     *
     * Author: cmc
     *
     * Last Updated: November 7, 2022
     */
    handleOk (e) {
      e.preventDefault()
      if (!this.rename) { // no input
        this.noName = true
      } else { // input, check for duplicate
        this.noName = false
        this.duplicateCheck()
      }
    },

    /**
     * Function renameCourse: rename Course, change route to new name
     *
     * Author: cmc
     *
     * Last Updated: November 7, 2022 by cmc
     */
    renameCourse () {
      this.$nextTick(() => {
        this.$bvModal.hide('author-rename-course-confirm')
      })
      const newName = this.rename.trim()
      this.oldName = this.course.name
      this.$store.commit('courseRename', newName)
      this.$store.dispatch('courseUpdateRename')
        .then(() => {
          this.$router.replace({
            name: 'course',
            params: { name: slugify(newName) }
          })
          this.$emit('renamed')
        })
        .catch(err => {
          console.error(err)
        })
    }
  }
}
</script>

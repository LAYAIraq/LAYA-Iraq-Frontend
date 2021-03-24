<!--
Filename: course-rename.vue 
Use: Rename whole course
Author: cmc
Date: October 27, 2020
Dependencies: 
  vuex,
  @/i18n/course-edit/rename/
-->

<template>
    
  <div class="row mt-3">

    <div class="col">
      <b-button size="sm"
        variant="warning"
        class="float-right"
        @click="$bvModal.show('author-renameCourse-confirm')"
      >
        <i class="fas fa-exclamation-circle"></i> {{ i18n.renameCourse }}
      </b-button>
    </div>

    <div class="col text-dark">
      {{ i18n.renameCourseTip }}
    </div>

    <b-modal id="author-renameCourse-confirm"
      :title="i18n.modal.title"
      header-bg-variant="warning"
      ok-variant="warning"
      :ok-title="i18n.modal.ok"
      :cancel-title="i18n.modal.cancel"
      @ok="renameCourse"
      centered
    >
      <p>
        {{ i18n.modal.text }}
        <input
        type="text"
        v-model="rename"
        class="form-control"
        :placeholder="i18n.modal.placeholder"
        >
      </p>

    </b-modal>
  </div>

</template>

<script>
import * as i18n from '@/i18n/course-edit/rename/'
import { mapGetters, mapState } from 'vuex'

export default {
  name: 'courseRename',

  data() {
    return {
      rename: '',
      oldName: ''        
    }
  },

  computed: {
    ...mapGetters(['course', 'profileLang']),

    /**
     * i18n: Load translation files depending on user langugage
     * 
     * Author: cmc
     * 
     * Last updated: March 20, 2021
     * 
     */
    i18n()  {
      return i18n[this.profileLang]
    }

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

    duplicateCheck(click) {
      click.preventDefault()
      if(!this.rename) {
        this.$nextTick( () => {
          this.$bvModal.hide('author-rename-course-confirm')
        })
        return
      }
      if(!this.courseList) this.$store.dispatch('fetchCourseList')
      if(this.courseList.some( e => e.name == this.rename)) {
        this.dupeName = true
      }
      else {
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
    renameCourse() {
      if(!this.rename) return
      let newName = this.rename
      let step = this.$route.params.step
      this.$store.commit('renameCourse', newName)
      let renamed = this.$store.dispatch('updateRenamedCourse')
      
      renamed.then( () => {
        this.$router.replace(`/courses/${newName}/${step}`)
        console.log('Renaming successful!')
        this.$emit('renamed')
      })
      .catch(err => {
        console.err(err)
        console.log('Renaming failed!')
      })
    
    }
  }
}
</script>

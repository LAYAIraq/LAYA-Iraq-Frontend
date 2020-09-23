<template>
  <div class="laya-course-new-view">
    <h3> {{ i18n.createCourse }}</h3>
    <hr>
    <form class="mt-3">
      <div class="form-group row">
        <label for="new-course-name" class="col-3 col-form-label">
          {{ i18n.courseName }}
        </label>
        <div class="col">
          <input id="new-course-name"
                 type="text"
                 class="form-control"
                 v-model="newCourse.name"
                 :placeholder="i18n.courseName">
        </div>
      </div>     
      <div class="form-group row">
        <label for="new-course-category" class="col-3 col-form-label">
          {{ i18n.category }}
        </label>
        <div class="col">
          <input id="new-course-category"
                 type="text"
                 class="form-control"
                 v-model="newCourse.category"
                 :placeholder="i18n.category">
        </div>
      </div>
      <div class="form-group row">
        <label for="new-course-enrollment" class="col-3 col-form-label">
          {{ i18n.enrollment }}
        </label>
        <div class="col">
          <input id="new-course-enrollment"
                 type="checkbox"
                 class="form-control"
                 ref="enrollmentRequired"
                 >
        </div>
      </div>
      <div class="form-group row">
        <div class="col">
          <span class="text-danger form-control-plaintext text-right">
            {{msg}}
          </span>
        </div>
        <div class="col-4">
          <button type="submit"
                  class="btn btn-block btn-primary"
                  :disabled="!formValid"
                  @click="storeNewCourse">
            <i class="fas fa-check"></i> {{ i18n.save }}
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import http from "axios";
import * as i18n from "@/i18n/course-update";

export default {
  data() {
    return {
      msg: "",
      newCourse: {
        name: "",
        category: ""
      },
    }
  },
  computed: {
    ...mapState(["note", "auth"]),

    formValid() {
      return !!this.newCourse.name && !!this.newCourse.category
    },

    i18n () {
      return i18n[this.$store.state.profile.lang];
    },

    needsEnrollment() {
      return this.$refs.enrollmentRequired.checked
    }

  },
  methods: {
    
    storeNewCourse() {
      
      const self = this
      const {$store, newCourse, auth} = this;

      /* check if course exists */
      http.head(`courses/${newCourse.name}`)
        .then(function() {
          self.msg = "Ein Kurs mit diesem Namen existiert bereits"
        }).catch(function() {
          let enrBool = self.needsEnrollment
          /* create course */
          http.post("courses", {
            ...newCourse,
            authorId: auth.userId,
            needsEnrollment: enrBool
          }).then(function() {
            self.$router.push(`/courses/${newCourse.name}/1`)
          }).catch((err) => {
            console.log(err)
            self.msg = "Beim Speichern ist ein Fehler aufgetreten"
          })

          /* create storage */
          http.post("storage", {
            name: newCourse.name,
          }).then(() => console.log(`New Storage: ${newCourse.name}`))
            .catch((err) => console.error(err));
        })
    }
  }
}
</script>

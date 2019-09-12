<template>
  <div class="laya-course-new-view">
    <h3>Neuen Kurs erstellen</h3>
    <hr>
    <form class="mt-3">
      <div class="form-group row">
        <label for="new-course-name" class="col-3 col-form-label">
          Kursname
        </label>
        <div class="col">
          <input id="new-course-name"
                 type="text"
                 class="form-control"
                 v-model="newCourse.name"
                 placeholder="Kursname">
        </div>
      </div>     
      <div class="form-group row">
        <label for="new-course-category" class="col-3 col-form-label">
          Kategorie
        </label>
        <div class="col">
          <input id="new-course-category"
                 type="text"
                 class="form-control"
                 v-model="newCourse.category"
                 placeholder="Kategorie">
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
            <i class="fas fa-check"></i> Speichern
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";

import http from "axios";

export default {
  data() {
    return {
      msg: "",
      newCourse: {},
    }
  },
  computed: {
    ...mapState(["note", "auth"]),

    formValid() {
      return !!this.newCourse.name && !!this.newCourse.category
    }
  },
  methods: {

    storeNewCourse() {
      const self = this
      const {$store, newCourse, auth} = this;

      /* check if course exists */
      http.head(`courses/${newCourse.name}`)
        .then(function() {
          self.msg = "Ein Kurs mit diesem Name existiert bereits"
        }).catch(function() {

          /* create course */
          http.post("courses", {
            ...newCourse,
            authorId: auth.userId,
          }).then(function() {
            self.$router.push(`/courses/${newCourse.name}/1`)
          }).catch((err) => {
            console.log(err)
            self.msg = "Beim Speicher ist ein Fehler aufgetreten"
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

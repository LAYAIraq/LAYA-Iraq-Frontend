<template>
  <div class="container">
    <div class="row">
      <div class="col">
        <!-- create new course -->
        <div class="card">
          <div class="card-header text-white bg-primary">
            <i class="fas fa-plus"></i> Neuer Kurs
          </div>
          <div class="card-body">
            <form>
              <div class="form-row mb-2">
                <div class="col">
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Name"
                    v-model="newCourse.name"
                  >
                </div>
                <div class="col">
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Kategorie"
                    v-model="newCourse.category"
                  >
                </div>
              </div>
              <div class="form-row mb-2">
                <div class="col">
                  <textarea
                    class="form-control"
                    placeholder="Abstrakt"
                    v-model="newCourse.abstract"
                  ></textarea>
                </div>
              </div>
              <div class="form-row">
                <div class="form-group col">
                  <label>Startdatum</label>
                  <input type="date" class="form-control" v-model="newCourse.startDate">
                </div>
                <div class="form-group col">
                  <label>Enddatum</label>
                  <input type="date" class="form-control" v-model="newCourse.endDate">
                </div>
              </div>
              <div class="form-row">
                <div class="col">
                  <div class="form-check">
                    <label class="form-check-label">
                      <input
                        type="checkbox"
                        class="form-check-input"
                        placeholder="Kategorie"
                        v-model="newCourse.locked"
                      >
                      Kurs sperren
                    </label>
                  </div>
                </div>
                <div class="col">
                  <button @click="storeNewCourse" type="submit" class="btn btn-block btn-primary">
                    <i class="fas fa-check"></i> Speichern
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapState, mapGetters } from "vuex";

import http from "axios";

import utils from "../../misc/utils.js";

export default Vue.extend({
  data() {
    return {
      ...mapState(["note", "auth"]),

      newCourse: {},
    };
  },
  methods: {
    ...utils,

    storeNewCourse() {
      const { $store, newCourse, auth, fetchCourses } = this;
      $store.commit("setBusy", true);
      /*
       * create course */
      http
        .post("courses", {
          ...newCourse,
          authorId: auth.userId,
        })
        .then(({ data }) => {
          fetchCourses();
        })
        .catch((err) => {
          console.log(err);
        })
        .then(() => $store.commit("setBusy", false));
      /*
       * create storage */
      http
        .post("storage", {
          name: newCourse.name,
        })
        .then(() => console.log(`New Storage: ${newCourse.name}`))
        .catch((err) => console.error(err));
    },
  },
});
</script>

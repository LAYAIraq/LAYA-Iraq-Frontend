<template>
  <div class="laya-course-list">

    <div class="container-fluid">

      <div class="row">
        <div class="col">
          <h3 v-show="filtered.length === 0" class="text-center text-muted">
            Keine Kurse gefunden
          </h3>
        </div>
      </div>

      <div class="row header" v-if="filtered.length > 0">
        <div class="col">
          <h4>Name</h4>
        </div>
        <div class="col">
          <h4>Kategorie</h4>
        </div>
        <div class="col-3">
        </div>
      </div>

      <div v-for="course in filtered"
           :key="course.category+'-'+course.name"
           class="row py-3 course">

        <div class="col">
          {{ course.name }}
        </div>

        <div class="col">
          {{ course.category }}
        </div>

        <div class="col-3">
          <router-link
            :to="'/courses/'+course.name+'/1'"
            class="text-dark px-2 py-1"
            style="border: 2px solid black">
            Beginnen <i class="fas fa-arrow-right"></i>
          </router-link>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: "laya-course-list",
  data() {
    return {
    };
  },
  props: {
    courses: Array,
    filter: String,
  },
  computed: {
    filtered: function() {
      if (!this.filter) return this.courses;

      const filterByCourseName = new RegExp(this.filter, "i");
      return this.courses.filter(course => filterByCourseName.test(course.name))
    }
  },
  methods: {
  }
}
</script>

<style scoped>
*:focus {
  outline-offset: 5px;
  outline: 2px dashed deepskyblue;
}

.header {
  border-bottom: 2px solid black;
}

.course {
  border-bottom: 1px dashed black;
}

.course > div {
  font-size: 120%;
}
</style>

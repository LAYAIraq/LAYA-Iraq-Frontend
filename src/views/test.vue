<template>
  <div class="mt-5">
    <div class="ly-bg-grey">
      <div class="container">
        <div class="row">
          <div class="col">
            <laya-course-table :courses="courses">
            </laya-course-table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "test-view",
  data() {
    return {
      courses: [
        {name: "Schwerhörigkeit", category: "Inclusion Journeys"},
        {name: "Autismus", category: "Inclusion Journeys"},
        {name: "Algebra", category: "Mathe"},
        {name: "Analysis", category: "Mathe"},
      ]
    };
  },
  computed: {},
  methods: {},
  components: {
  }
};
</script>

<style scoped></style>

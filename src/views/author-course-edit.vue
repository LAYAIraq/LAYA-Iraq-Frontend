<template>
  <div class="author-course-edit-view ly-bg-author py-4">

    <div class="container">

      <div class="row">
        <div class="col">
          <router-view :course="course"></router-view>
        </div>
      </div>

      <div class="row" v-if="isAuthor && $route.name === 'course-detail-view'">
        <div class="col">

          <b-button variant="primary" block
                    :to="{name: 'new-learning-block', params: {id: course.name}}">
            <i class="fas fa-puzzle-piece"></i> Lernbaustein hinzufügen
          </b-button>

          <b-button variant="primary" block
                    :to="{name: 'new-learning-assessment', params: {id: course.name}}">
            <i class="fas fa-pencil-alt"></i> Lernüberprüfung hinzufügen
          </b-button>

        </div>
        <div class="col">

          <b-button block
                    variant="primary"
                    :to="{name: 'edit-course-nav-view', params: {id: course.name}}">
            <i class="fas fa-project-diagram"></i> Kursführung bearbeiten
          </b-button>

        </div>
      </div> <!-- row -->

    </div> <!-- container -->

  </div>
</template>

<script>
export default {
  name: "author-course-edit",
  props: {
    course: Object
  }
}
</script>

<style>
</style>


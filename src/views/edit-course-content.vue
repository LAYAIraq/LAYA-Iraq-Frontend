<template>
  <div class="edit-course-content-view">

    <div class="container">
      <div class="row">
        <div class="col">

          <comp-edit-wrapper
            :cid="_type"
            v-bind="content"
            :onsave="onupdate">
          </comp-edit-wrapper>

        </div>
      </div>
    </div>

  </div>
</template>

<script>
import compEditWrapper from "@/components/laya-la-lb-wrapper"

export default {
  name: "edit-course-content-view",
  props: {
    type: String,
    content: Object,
    onupdate: Function
  },
  mounted() {
    if(!this.type && !this.content) // data not passed -> go back
      this.$router.back()
  },
  computed: {
    _type() {
      return this.type || this.content.name
    }
  },
  components: {
    compEditWrapper
  }
}
</script>

<style>
</style>


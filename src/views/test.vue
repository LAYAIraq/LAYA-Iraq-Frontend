<template>
  <div class="mt-5">
    <div class="ly-bg-author p-3">
      <div class="container">
        <div class="row">
          <div class="col">

            <laya-wrapper :data="{asd:1}" cid="laya-quiz-relate"></laya-wrapper>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import layaWrapper from "@/components/laya-la-lb-wrapper"

export default {
  name: "test-view",
  data() {
    return {
    }
  },
  computed: {},
  methods: {
  },
  components: {
    layaWrapper
  }
}
</script>

<style scoped></style>

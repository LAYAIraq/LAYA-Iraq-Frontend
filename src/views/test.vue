<template>
  <div class="mt-5">
    <div class="ly-bg-author p-3">
      <div class="container">
        <div class="row">
          <div class="col">

            <laya-wrapper cid="laya-dialog"></laya-wrapper>

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

      cin: {
        title: "SMChoice",
        task: "asdasda",
        options: ['A', 'B', 'C'],
        solutions: [0]
      }

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

<template>
  <div class="mt-5">
    <div class="ly-bg-grey">
      <div class="container">
        <div class="row">
          <div class="col">

            <div :is="$laya.la['laya-multiple-choice'].components['view']"
              v-bind="cin">
            </div>

            <div :is="$laya.la['laya-multiple-choice'].components['edit']"
              v-bind="cin" :onedit="updateInput">
            </div>

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
    updateInput: function(cin) {
      this.cin = {...cin}
    }
  },
  components: {
  }
}
</script>

<style scoped></style>

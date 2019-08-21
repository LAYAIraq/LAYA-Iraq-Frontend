<template>
  <div class="laya-dialog">
    <img class="bg" v-if="bg" :src="bg_" alt="">

    <div class="dialog-text">
      <div class="question">{{ question }}</div>
      <div class="answers d-flex justify-content-around">
        <button v-for="(answer,i) in answers"
                :key="i"
                type="button"
                class="btn btn-info btn-lg"
                @click="onFinish[i]">
          {{ answer }}
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue"

export default Vue.extend({
  name: "laya-dialog",
  data() {
    return {
      bg_: ""
    }
  },
  mounted() {
    this.bg_ = this.bg ? this.bg : "red"
  },
  props: {
    question: String,
    answers: Array,
    bg: String,
    onFinish: Array
  },
  computed: {
  },
  methods: {
  },
})
</script>

<style scoped>
.laya-dialog {
  position: relative;
}

.bg {
  width: 100%;
}

.dialog-text {
  position: absolute;
  bottom: 0px;
  left: 0px;
  
  /* height: 50%; */
  width: stretch;

  /* background-color: #ffffffd9; */
  margin: 1rem;
}

.question {
  font-size: 2rem;
  margin-top: 1rem;
  margin-bottom: 1rem;
  padding: 5px;
  text-align: center;
}

.answers > button {
  border: 1px solid #222;
  margin-right: 1rem;
  font-size: 90%;
  /* background-color: white; */
}
.answers > button:last-child {
  margin-right: 0;
}

</style>

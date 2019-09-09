<template>
  <div class="laya-dialog">
    <img v-if="bg" class="bg" :src="bg" alt="">
    <div v-else class="bg-fallback">
      Wähle eine Antwort
    </div>

    <div class="dialog-text">
      <div class="question">{{ question }}</div>
      <div class="answers d-flex justify-content-around">
        <button v-for="(answer,i) in answers"
                :key="i"
                type="button"
                class="btn btn-info btn-lg"
                @click="onFinish[i]() || dummy">
          {{ answer }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "laya-dialog",
  data() {
    return {
    }
  },
  mounted() {
  },
  props: {
    question: String,
    answers: Array,
    bg: String,
    onFinish: Array
  },
  methods: {
    dummy() {
      // Do not delete
    }
  },
}
</script>

<style scoped>
.laya-dialog {
  position: relative;
}

.bg {
  width: 100%;
}
.bg-fallback {
  min-height: 10rem;
  border: 1px solid grey;
  text-align: center;
  padding-top: 1rem;
  background: linear-gradient(#e66465, #9198e5);
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

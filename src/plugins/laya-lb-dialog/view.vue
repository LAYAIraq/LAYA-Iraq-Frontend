<template>
  <div class="laya-dialog">
    <img v-if="bg" class="bg" :src="bg" alt="">
    <div v-else class="bg-fallback"></div>

    <div class="dialog-text" :class="
     { absolute: bg }
    ">
      <div class="question">{{ question }}</div>
      <div class="answers ">
        <div class="d-flex justify-content-around">
          <button v-for="(answer,i) in answers"
                  :key="i"
                  type="button"
                  class="btn btn-info btn-lg"
                  @click="onFinish[i]()">
            {{ answer }}
          </button>
        </div>
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
  
}
</script>

<style scoped>
.laya-dialog {
  position: relative;
  /* min-height: 20rem; */
  border: 1px solid grey;
}

.bg {
  width: 100%;
}
.bg-fallback {
  /* min-height: 10em; */
  
  text-align: center;
  padding-top: 1rem;
  /* background: linear-gradient(#e66465, #9198e5); */
}

.dialog-text {
  
  width: stretch;
  /* height: max-content; */
  /* background-color: #ffffffd9; */
  margin: 1rem;
}

.dialog-text.absolute {
  position: absolute;
  bottom: 0px;
  left: 0px;
  top: 0px;
}

.question {
  font-size: 2rem;
  margin-top: 1rem;
  margin-bottom: 1rem;
  padding: 5px;
  text-align: center;
  background-color: #ffffff78;
  border-radius: 3px;
  line-height: 1.5;
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

<template>
  <div class="laya-flag" :class="refData.flagged? 'flagged': 'unflagged'">
    <div
      class="flag-icon"
      v-if="!clicked"
      @click="toggleClicked"
    >
      <i class="fas fa-flag lg"></i>
    </div>
    <div
      class="flag-body"
      v-else
      @blur="toggleClicked"
    >
      I am the flag body!
    </div>
  </div>
</template>

<script>
// import http from 'axios'
import { mapGetters, mapState } from 'vuex'
import { locale } from '@/mixins'

export default {
  name: 'LayaFlag',

  mixins: [
      locale
  ],

  props: {
    refData: Object
  },

  computed: {
    ...mapGetters(['courseFlags']),
    ...mapState(['flags'])
  },

  data() {
    return{
      clicked: false,
    }
  },

  methods: {
    toggleClicked() {
      this.clicked = !this.clicked
    }
  }
}

</script>

<style scoped>
  .laya-flag {
    position: absolute;
    box-sizing: border-box;
    top:0;
    left: 0;
    right: 0;
    bottom: 0;
  }
  .laya-flag.unflagged:hover {
    background-color: rgba(108, 117, 125, 0.25);
    border-radius: 5px;
    width: 100%;
    height: 100%;
  }
  .laya-flag.unflagged:hover>.flag-icon {
    height: 60px;
    width: 60px;
    border-radius: 30px;
    border: 1px solid tomato;
    background-color: tomato;
    margin-left: calc(100% - 15px);
    display: inline-block;
    vertical-align: middle; /* doesn't do anything */
    cursor: pointer;
  }
  .laya-flag.unflagged>.flag-icon {
    display: none;
  }
  .laya-flag.flagged>.flag-icon {
    height: 50px;
    width: 50px;
    border-radius: 25px;
    border: 1px solid fuchsia;
    background-color: #470047;
    margin-left: 100%;
    display: block;
  }
  .flag-icon>i {
    color: whitesmoke;
  }

</style>
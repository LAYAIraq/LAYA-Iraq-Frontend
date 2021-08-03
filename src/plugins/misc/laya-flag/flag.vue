<template>
  <div
    class="laya-flag"
    :class="{
      'flagged': refData.flagged,
      'unflagged': !refData.flagged,
      'no-hov-bg': clicked
    }"
  >
    <div class="flag-interface">
      <div
        class="flag-icon"
        :class="clicked? 'collapsed' : 'expanded'"
        @click="toggleClicked"
      >
        <i class="fas fa-flag"></i>
      </div>
      <div
        class="flag-body"
        :class="clicked? 'expanded' : 'collapsed'"
      >
        <div
          class="set-flag"
          v-if="!refData.flagged"
        >
          <div
              class="close-btn"
              @click="toggleClicked"
          >
            <i class="fas fa-times"></i>
          </div>
        </div>
        <div
          class="pick-up-flag"
          v-else
        >
          <div class="row mt-1">
            <div class="col">
              Flag Title
            </div>
            <div
              class="close-btn"
              @click="toggleClicked"
            >
              <i class="fas fa-times"></i>
            </div>
          </div>
          <div class="mt-1 flag-question">
            <div class="question-text">
              {{ showFlagQuestion() }}
            </div>
            <div class="question-meta">
              By {{ flagAuthor }} at {{ timeSince(currentFlag.created)}}
            </div>
          </div>
          <div class="flag-discussion">
            <div
              class="discussion-post"
              v-for="(answer,i) in currentFlag.answers"
              :key="'answer-'+i"
            >
              {{ answer }}
            </div>
            <div class="add-answer">
              <form @submit.prevent="addAnswer">
                <div class="row">
                  <input
                      id="my-answer"
                      type="text"
                      :class="{
                        'ml-auto': subFocus,
                        'm-auto': !subFocus
                      }"
                      v-model="newAnswer"
                      :disabled="answerSent"
                      @focus="subFocus = true"
                      @blur="subFocus = false"
                      @submit="addAnswer"
                  >
                  <b-button
                    v-if="subFocus"
                    @click="addAnswer"
                    class="mr-auto"
                  >
                  Submit
                  </b-button>
                </div>
                <div class="row">
                  <label
                    for="my-answer"
                    class="m-auto"
                    v-if="subFocus"
                  >
                    Press Enter for submitting
                  </label>
                </div>
              </form>

            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import http from 'axios'
import { mapGetters, mapState } from 'vuex'
import { locale, time } from '@/mixins'

export default {
  name: 'LayaFlag',

  mixins: [
      locale,
      time
  ],

  props: {
    refData: Object
  },

  computed: {
    ...mapGetters(['courseFlags', 'userId']),
    ...mapState(['flags']),
    currentFlag() {
      const myFlagId = new RegExp(this.refData.id, 'i')
      let arr = this.courseFlags
        .filter(flag => myFlagId.test(flag.referenceId))
      if (arr.length === 1) return arr[0]
      else return null
    },
    flagAuthor() {
      if (this.currentFlag) {
        return this.currentFlag.authorId
      } else {
        return 'unknown'
      }
    }
  },

  data() {
    return{
      answerSent: false,
      clicked: false,
      newAnswer: '',
      subFocus: false
    }
  },

  methods: {
    addAnswer() {
      const myAnswer = {
        text: this.newAnswer,
        authorId: this.userId,
        timestamp: Date.now()
      }
      this.$store.commit('appendFlagAnswer', {
        answer: this.newAnswer,
        id: this.currentFlag.referenceId
      })
      this.subFocus = false
      this.newAnswer = ''
      this.answerSent = true
    },
    showFlagQuestion() {
      if (this.currentFlag) {
        return this.currentFlag.question
      } else {
        return 'FAIL!'
      }
    },
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
    font-size: 1rem;
    /*max-height: 100px;*/
  }
  .laya-flag.unflagged:hover {
    background-color: rgba(108, 117, 125, 0.25);
    border-radius: 5px;
    width: 100%;
    height: 100%;
  }
  .laya-flag.no-hov-bg {
    background-color: transparent !important;
  }
  .flag-interface {
    width: 100%;
    height: 100%;
  }
  /*.no-hov-bg:hover>.flag-interface {*/
  /*  margin-top: -54px; !* hack for avoiding 'bouncing box' *!*/
  /*}*/
  .flag-icon {
    cursor: pointer;
  }
 .unflagged:hover>.flag-interface>.flag-icon {
    margin-left: calc(100% - 15px);
    /*margin-top: auto;*/
    border: 1px solid tomato;
    background-color: tomato;
    display: block;
    vertical-align: middle; /* doesn't do anything */
  }
 .unflagged>.flag-interface>.flag-icon {
   display: none;
 }
  .flagged>.flag-interface>.flag-icon {
    height: 60px;
    width: 60px;
    border-radius: 25px;
    border: 1px solid fuchsia;
    background-color: #470047;
    margin-left: 100%;
    display: block;
  }
  .flag-icon>i {
    color: whitesmoke;
    font-size: 2rem;
    padding: 12px;
  }
  .flag-icon.collapsed {
    transform:rotateY(90deg);
    height: 0px;
    width: 0px;
    transition: transform 0.2s ease-out;
    /*display: block !important;*/
  }
  .flag-icon.expanded {
    height: 60px;
    width: 60px;
    border-radius: 30px;
    transform: none;
    transition: transform 0.5s ease-in;
  }
  .flag-body.expanded {
    margin-left: 40vw;
    margin-top: -60px; /* avoid bouncing on hover */
    position: absolute;
    z-index: 13000;
    background-color: darkslateblue;
    border-radius: 5px;
    transform: scaleY(1);
    transition: transform 0.5s ease;
    box-sizing: content-box;
    width: 35vw;
    min-height: 60vh;
  }
  .flag-body.collapsed {
    margin-left: calc(100% - 9vh);
    margin-top: -60px;
    transform: rotateY(90deg);
    transition: transform 0.2s ease;
  }

  .close-btn {
    margin-right: 25px;
    margin-top: 5px;
    margin-left: auto;
    cursor: pointer;
    border: tomato solid 1px;
    border-radius: 25px;
    background-color: firebrick;
    color: antiquewhite;
    width: 30px;
    height: 30px;
  }

</style>
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
        v-if="!isOpen"
        class="flag-icon"
        :class="clicked? 'collapsed' : 'expanded'"
        @click="toggleClicked"
        :title="refData.flagged? i18n['flag.seeDiscussion'] : i18n['flag.title']"
        v-b-tooltip.bottom
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
          <div class="row mt-1">
            <div class="col">
              {{ i18n['flag.title'] }}
            </div>
            <div
                class="close-btn"
                @click="toggleClicked"
            >
              <i class="fas fa-times"></i>
            </div>
          </div>
          <div class="form-group flag-question">
            <form
                @submit="setFlagQuestion()"
            >
              <label
                  for="set-flag-question"
                  class=""
              >
                {{ i18n['flag.typeHere'] }}
              </label>
              <textarea
                class="form-control"
                id="set-flag-question"
                rows="5"
                v-model="question"
                :placeholder="i18n['questionPlaceholder']"
              ></textarea>

<!--              Added if non-anonymous questions are possible-->
<!--              <label-->
<!--                for="anonymous-question"-->
<!--                >-->
<!--                {{ i18n['flag.anonymous'] }}-->
<!--              </label>-->
<!--              <input-->
<!--                id ="anonymous-question"-->
<!--                type="checkbox"-->
<!--                v-model="anonymous"-->
<!--              >-->

              <b-button
                for="set-flag-question"
                type="submit"
              >
                {{ i18n['flag.setQuestion'] }}
              </b-button>
            </form>
          </div>
        </div>
        <div
          class="pick-up-flag"
          v-if="currentFlag"
        >
          <div class="row mt-1">
            <div class="col">
              {{ i18n['flag.title'] }}
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
              <!--              By {{ flagAuthor }} at {{ timeSince(currentFlag.created)}}-->
              {{ timeSince(currentFlag.created) }}
            </div>
          </div>
          <div class="flag-discussion">
            <div
              class="discussion-post"
              v-for="(answer,i) in currentFlag.answers"
              :key="'answer-'+i"
            >
              <div class="text-center">
                {{ answer.text }}
              </div>
              <div
                :class="langIsAr? 'text-left': 'text-right'"
              >
                {{ timeAndDate(answer.timestamp) }}
              </div>
            </div>
            <div class="add-answer">
              <form @submit.prevent="addAnswer">
                <div class="row">
                  <input
                      id="my-answer"
                      type="text"
                      class="ml-auto"
                      v-model="newAnswer"
                      :disabled="answerSent"
                      @focus="subFocus = true"
                      @blur="subFocus = false"
                  >
                  <b-button
                    type="submit"
                    class="mr-auto"
                    :disabled="answerSent"
                    >
                    {{ this.i18n['flag.enterToSubmit'] }}
                  </b-button>

                </div>
                <div class="row">
                  <label
                    for="my-answer"
                    class="m-auto"
                    v-if="subFocus"
                  >
                    {{ i18n['flag.enterToSubmit'] }}
                  </label>
                  <label
                    class="m-auto"
                    v-else-if="answerSent"
                  >
                    {{ i18n['flag.ty'] }}
                  </label>
                  <label
                    v-else
                    class="m-auto"
                    >
                    {{ i18n['flag.postAnswer'] }}
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
import { mapGetters } from 'vuex'
import { locale, time } from '@/mixins'

export default {
  name: 'LayaFlag',

  mixins: [
      locale,
      time
  ],

  props: {
    refData: Object,
    isOpen: Boolean
  },

  computed: {
    ...mapGetters(['courseFlags', 'courseId', 'userId']),
    // ...mapState(['flags']),
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
      // anonymous: false,
      clicked: false,
      newAnswer: '',
      subFocus: false,
      question: ''
    }
  },

  watch: {
    clicked(val) { // avoid multiple open instances
      this.$emit('flagOpen', val)
    }
  },

  created() {
    if (this.currentFlag) { // check if user already answered
      for (const answer of this.currentFlag.answers) {
        if (answer.authorId === this.userId) {
          this.answerSent = true
          break
        }
      }
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
        answer: myAnswer,
        id: this.currentFlag.referenceId
      })
      this.subFocus = false
      this.newAnswer = ''
      this.answerSent = true
    },
    setFlagQuestion() {
      const newFlag = {
        question: this.question,
        referenceId: this.refData.id,
        courseId: this.courseId,
        authorId: this.userId,
        enrollmentId: (this.$store.state.enrollment )?
            this.$store.state.enrollment.id :
            null
      }
      this.$store.commit('setFlag', newFlag)
      this.$store.dispatch('updateCourseFlags')
      this.$emit('flagged')

    },
    showFlagQuestion() {
      if (this.currentFlag) {
        return this.currentFlag.question
      } else {
        return 'FAIL!'
      }
    },
    timeAndDate(timestamp) {
      const time = new Date(timestamp)
      return `${this.locDate(time)}, ${this.locTime(time)}`
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
    text-align: center;
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

  .flag-question {
    padding: 20px;
    border: #4a5464 1px solid;
    background-color: #9fcdff;
  }
  .unflagged:hover>.flag-interface>.flag-icon {
    margin-left: calc(100% - 5px);
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
    margin-left: calc(100% - 5px);
    display: block;
  }
  .flag-icon>i {
    color: whitesmoke;
    font-size: 2rem;
    padding: 12px;
  }
  .flag-icon.collapsed {
    /*transform:rotateY(90deg);*/
    height: 0;
    width: 0;
    /*transition: transform 0.2s ease-out;*/
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
    margin: auto;
    /*margin-top: -60px; !* avoid bouncing on hover *!*/
    position: relative;
    z-index: 11000;
    background-color: darkslateblue;
    border-radius: 5px;
    /*transform: scaleY(1);*/
    /*transition: transform 0.5s ease;*/
    box-sizing: border-box;
    width: 35vw;
    min-height: 60vh;
  }
  .flag-body.collapsed {
    display: none;
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
  #my-answer:disabled {
    background: lightslategrey;
  }

</style>
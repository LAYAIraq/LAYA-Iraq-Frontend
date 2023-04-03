<template>
  <div
    class="laya-flag"
    :class="{
      'flagged': refData.flagged,
      'unflagged': !refData.flagged,
      'no-hov-bg': clicked,
      'interactive': interactive
    }"
  >
    <div class="flag-interface">
      <div
        v-if="!isOpen"
        v-b-tooltip.bottom
        class="flag-icon"
        :class="clicked? 'collapsed' : 'expanded'"
        :title="refData.flagged? y18n('flag.seeDiscussion') : y18n('flag.title')"
        tabindex="0"
        @click="toggleClicked"
        @keypress="toggleClicked"
      >
        <i class="fas fa-flag"></i>
      </div>

      <div
        class="flag-body"
        :class="clicked? 'expanded' : 'collapsed'"
      >
        <div
          v-if="!refData.flagged"
          class="set-flag"
        >
          <div class="flag-title">
            <div class="title-text">
              {{ y18n('flag.title') }}
            </div>
            <div
              class="close-btn"
              tabindex="0"
              @click="toggleClicked"
              @keypress="toggleClicked"
              @keydown.esc="toggleClicked"
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
                {{ y18n('flag.typeHere') }}
              </label>
              <textarea
                id="set-flag-question"
                v-model="question"
                class="form-control"
                rows="5"
                :placeholder="y18n('flag.questionPlaceholder')"
              ></textarea>

              <!--              Added if non-anonymous questions are possible-->
              <!--              <label-->
              <!--                for="anonymous-question"-->
              <!--                >-->
              <!--                {{ y18n('flag.anonymous') }}-->
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
                {{ y18n('flag.setQuestion') }}
              </b-button>
            </form>
          </div>
        </div>
        <div
          v-else-if="currentFlag"
          class="pick-up-flag"
        >
          <div class="flag-title">
            <div class="title-text">
              {{ y18n('flag.provideClarification') }}
            </div>
            <div
              class="close-btn"
              tabindex="0"
              @click="toggleClicked"
              @keypress="toggleClicked"
              @keydown.esc="toggleClicked"
            >
              <i class="fas fa-times"></i>
            </div>
          </div>
          <div class="flag-question">
            <div class="heading">
              {{ y18n('flag.question') }}
            </div>
            <div class="question-text">
              {{ showFlagQuestion() }}
            </div>
            <div class="question-meta">
              <!--              By {{ flagAuthor }} at {{ timeSince(currentFlag.created)}}-->
              {{ timeSince(currentFlag.created) }}
            </div>
          </div>
          <div class="flag-discussion">
            <div class="heading">
              {{ y18n('layaLbDialog.answers') }}
            </div>
            <div
              v-for="(answer,i) in currentFlag.answers"
              :key="'answer-'+i"
              v-b-tooltip.bottom
              class="discussion-post"
              :class="answer.authorId === courseCreator ? 'creator' : ''"
              :title="answer.authorId === courseCreator ?
                y18n('flag.creatorAnswer')
                : ''
              "
            >
              <div class="text-center">
                {{ answer.text }}
              </div>
              <div
                :class="langIsAr? 'text-left': 'text-right'"
              >
                <small>
                  {{ timeAndDate(answer.timestamp) }}
                </small>
              </div>
            </div>
            <div class="add-answer">
              <div class="heading">
                {{ y18n('flag.postAnswer') }}
              </div>
              <form @submit.prevent="addAnswer">
                <div>
                  <input
                    id="my-answer"
                    v-model="newAnswer"
                    type="text"
                    class="ml-auto"
                    :disabled="answerSent || !refData.flagged"
                    @focus="subFocus = true"
                    @blur="subFocus = false"
                  >
                  <b-button
                    type="submit"
                    class="mr-auto"
                    :disabled="answerSent"
                  >
                    {{ y18n('flag.enterToSubmit') }}
                  </b-button>
                </div>
                <div class="answer-hint">
                  <label
                    v-if="subFocus"
                    for="my-answer"
                    class="m-auto"
                  >
                    {{ y18n('flag.enterToSubmit') }}
                  </label>
                  <label
                    v-else-if="answerSent"
                    class="m-auto"
                  >
                    {{ y18n('flag.ty') }}
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
    refData: {
      type: Object,
      default () { return null }
    },
    interactive: {
      type: Boolean,
      default () { return false }
    },
    isOpen: {
      type: Boolean,
      default () { return null }
    }
  },

  data () {
    return {
      answerSent: false,
      // anonymous: false,
      clicked: false,
      filteredFlag: null,
      newFlag: null,
      newAnswer: '',
      subFocus: false,
      question: ''
    }
  },

  computed: {
    ...mapGetters([
      'courseFlags',
      'courseCreator',
      'courseId',
      'userId'
    ]),
    // ...mapState(['flags']),

    /**
     * function currentFlag: returns current flag if any is set
     *
     * Author: cmc
     *
     * Last Updated: September 20, 2021
     * @returns {null|object} current flag
     */
    currentFlag () {
      return this.filteredFlag
        ? this.filteredFlag
        : this.newFlag
    },

    /**
     * function flagAuthor: return ID of flag author
     *
     * Author: cmc
     *
     * Last Updated: September 20, 2021
     * @returns {boolean|number|string|*}
     */
    flagAuthor () {
      return this.currentFlag
        ? this.currentFlag.authorId
        : 'unknown'
    }
  },

  watch: {

    /**
     * watcher clicked: emit flagOpen for parent component
     *  to avoid multiple open windows
     *
     * Author: cmc
     *
     * Last Updated: September 20, 2021
     * @param {boolean} val clicked boolean
     */
    clicked (val) { // avoid multiple open instances
      if (val) {
        this.$emit('flagOpen', this.refData.id)
      } else {
        this.$emit('flagOpen', false)
      }
    },

    /**
     * watcher courseFlags: deep watcher to update currentFlag
     *
     * Author: cmc
     *
     * Last Updated: September 20, 2021
     */
    courseFlags: {
      deep: true,
      handler () {
        this.updateFilteredFlag()
      }
    }
  },

  created () {
    this.updateFilteredFlag()
    this.filteredFlag = this.courseFlags
      .filter(flag => flag.referenceId === this.refData.id)[0] // set flag if exists
    if (this.currentFlag) { // check if user already answered
      for (const answer of this.currentFlag.answers) {
        if (answer.authorId === this.userId) {
          this.answerSent = true
          break
        }
      }
    }
  },

  onUpdate () {
    // this.updateFilteredFlag()
  },

  methods: {

    /**
     * function addAnswer: send answer to store
     *
     * Author: cmc
     *
     * Last Updated: September 20, 2021
     */
    addAnswer () {
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

    /**
     * function updateFilteredFlag: update filteredFlag
     *
     * Author: cmc
     *
     * Last Updated: September 20, 2021
     */
    updateFilteredFlag () {
      const myFlagId = new RegExp(this.refData.id, 'i')
      const arr = this.courseFlags
        .filter(flag => myFlagId.test(flag.referenceId))
      if (arr.length === 1) {
        this.filteredFlag = arr[0]
      }
    },

    /**
     * function setFlagQuestion: bundle flag info and store it
     *
     * Author: cmc
     *
     * Last Updated: September 21, 2021
     */
    setFlagQuestion () {
      if (this.question === '') {
        this.$bvToast.toast(this.y18n('flag.noQuestion'), {
          title: this.y18n('flag.noQuestionTitle'),
          toaster: 'b-toaster-bottom-center',
          variant: 'warning'
        })
      } else {
        const flag = {
          question: this.question,
          referenceId: this.refData.id,
          courseId: this.courseId,
          authorId: this.userId,
          enrollmentId: (this.$store.state.enrollment)
            ? this.$store.state.enrollment.id
            : null
        }
        this.$store.commit('setFlag', flag)
        this.$store.dispatch('saveFlags')
        this.newFlag = {
          ...flag,
          created: Date.now()
        }
        this.$emit('flagged')
      }
    },

    /**
     * function showFlagQuestion: returns the question string if flag is set
     *
     * Author: cmc
     *
     * Last Updated: September 20, 2021
     * @returns {string|*} question
     */
    showFlagQuestion () {
      if (this.currentFlag) {
        return this.currentFlag.question
      } else {
        return 'FAIL!'
      }
    },

    /**
     * function timeAndDate: renders simple timestamp
     *
     * Author: cmc
     *
     * Last Updated: September 20, 2021
     * @param {number} timestamp answer timestamp
     * @returns {string} hh:mm, dd-mm-yyyy
     */
    timeAndDate (timestamp) {
      const time = new Date(timestamp)
      return `${this.dateLocalized(time)}, ${this.timeLocalized(time)}`
    },

    /**
     * function toggleClicked: toggle clicked boolean
     *
     * Author: cmc
     *
     * Last Updated: September 20, 2021
     */
    toggleClicked () {
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
    z-index: 0;
    /*max-height: 100px;*/
  }
  .laya-flag.interactive {
    z-index: -1;
  }

  .laya-flag.unflagged:hover {
    background-color: rgba(108, 117, 125, 0.25);
    border-radius: 5px;
    width: 100%;
    height: 100%;
  }
  .laya-flag.no-hov-bg {
    background-color: transparent !important;
    z-index: 0 !important;
  }
  .flag-interface {
    width: 100%;
    height: 100%;
  }

  .heading {
    margin-bottom: 3vh;
    font-weight: 600;
    font-size: 1.3em;
    color: #46494d;
  }

  .flag-icon {
    cursor: pointer;
  }

  .flag-icon:focus {
    outline: 2px dashed deepskyblue;
    outline-offset: 5px;
  }

  .set-flag {
    height: 100%;
    margin: auto;
    z-index: inherit;
  }
  .set-flag>.form-group.flag-question {
    height: 100% !important;
  }

  .flag-question {
    padding: 20px;
    border: 1px solid #4a5464;
    background-color: #9fcdff;
  }

  .question-text {
    background: #f8f9fa;
    border: 1px solid #4a5464;
    color: #4a5464;
    padding: 20px;
    font-size: 1.5em;
    font-style: italic;
  }

  .question-text:before {
    content: open-quote;
  }

  .question-text:after {
    content: close-quote;
  }

  .question-meta {
    margin-top: 2vh;
  }

  .flag-discussion {
    padding-top: 3vh;
    /*border-top: #4a5464 solid 1px;*/
    background: #d3e8ff;
    border-radius: 0 0 5px 5px;
  }

  .discussion-post {
    padding: 2vh;
    margin: 0 1vw 2vh;
    border: 1px dashed #4a5464;
    background: #8a9eb5;
    border-radius: 3px;
    word-wrap: break-word;
  }

  .discussion-post.creator {
    background: #8ab59d;
    border: 2px dashed #007b37;
  }

  .unflagged:hover>.flag-interface>.flag-icon {
    margin-left: calc(100% - 25px);
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
    border-radius: 30px;
    /*border: 1px solid fuchsia;*/
    background-color: #470047;
    margin-left: calc(100% - 25px);
    display: block;
  }

  .flagged>.flag-interface>.flag-icon:hover,
  .flagged>.flag-interface>.flag-icon:focus {
    /*border: 1px solid fuchsia;*/
    background: #b900b9 ;
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
  .flag-body {
    margin: auto;
    box-shadow: 0 0 3px black;
    /*margin-top: -60px; !* avoid bouncing on hover *!*/
    position: relative;
    z-index: 11000;
    background-color: darkslateblue;
    border-radius: 5px;
    border: 1px #1b1e21;
    /*transform: scaleY(1);*/
    /*transition: transform 0.5s ease;*/
    box-sizing: border-box;
    width: 35vw;
    min-width: 200px;
    min-height: 60vh;
  }
  .flag-body.collapsed {
    display: none;
  }
  .flag-title {
    background: #343a40;
    color: #f8f9fa;
    display: flex;
    flex-wrap: nowrap;
    border-radius: 5px 5px 0 0;
  }

  .title-text {
    text-align: center;
    margin-left: auto;
    padding: 10px;
    font-weight: bolder;
    font-size: 1.5em;
  }
  .close-btn {
    margin-right: 15px;
    margin-top: 10px;
    margin-left: auto;
    cursor: pointer;
    border: tomato solid 1px;
    border-radius: 25px;
    background-color: firebrick;
    color: antiquewhite;
    width: 30px;
    height: 30px;
  }

  .close-btn:focus {
    outline: 2px dashed deepskyblue;
    outline-offset: 5px;
  }

  .close-btn>i {
    padding-top: 4px;
  }

  .add-answer {
    padding: 3vh 3vw;
    border-radius: 0 0 5px 5px;
    border-top: 1px solid #4a5464;
    background: #4479b3;
  }

  .add-answer .heading {
    color: #f8f9fa;
  }

  .answer-hint {
    padding-top: 1vh;
    color: #f8f9fa;
  }

  .tooltip.b-tooltip { /* for correct positition of tooltip */
    z-index: 11000;
  }

  #my-answer:disabled {
    background: lightslategrey;
  }
  #set-flag-question {
    height: 100%;
  }

</style>

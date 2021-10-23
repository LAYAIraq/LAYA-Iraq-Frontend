<template>
  <div
      class="pick-up-flag"
  >
    <div class="flag-title">
      <div class="title-text">
        {{ i18n['flag.provideClarification'] }}
      </div>
    </div>
    <div class="flag-question">
      <div class="heading">
        {{ i18n['flag.question'] }}
      </div>
      <div
        v-if="!editQuestion"
        class="question-text"
      >
        <span class="pre">{{ currentFlag.question }}</span><!-- no indenting b/c of pre-->
      </div>
      <div
        v-else
        class="question-text"
      >
        <label
          for="question-editor"
          class="sr-only">
          {{ i18n['flag.editQuestion'] }}
        </label>
        <textarea
          id="question-editor"
          v-model="question"
          class="w-100"
          rows="5"
        ></textarea>
        <b-button
          @click="saveQuestion"
          @keydown.enter="saveQuestion"
        >
          <i class="fas fa-save"></i>
          {{ i18n['save'] }}
        </b-button>
      </div>
      <div class="question-meta row">
        <div class="col-5" v-if="!anonQuestion || isCourseCreator">{{ i18n['by'] }}
          #{{ showUserName(flagAuthor) }},
          {{ timeSince(currentFlag.created) }}
        </div>
        <div class="col-5" v-else>{{ timeSince(currentFlag.created) }}</div>
        <div class="col-5" v-if="currentFlag.question.edited">
          {{ i18n['edited'] }} {{ timeSince(currentFlag.question.editTime) }}
        </div>
        <div class="col" v-if="userId === currentFlag.authorId">
          <label
            for="edit-question"
            class="sr-only"
          >
            {{ i18n['flag.editQuestion'] }}
          </label>
          <i
            id="edit-question"
            class="fas fa-edit eventful"
            :class="langIsAr? 'float-left': 'float-right'"
            @click="editQuestion = true; $event.target.blur()"
            @keydown.enter="editQuestion = true; $event.target.blur()"
            tabindex="0"
            :title="i18n['flag.editQuestion']"
            v-b-tooltip.bottom
          >
          </i>
        </div>
      </div>
    </div>
    <div
      class="flag-discussion"
      v-if="currentFlag.answers.length !== 0"
    >
      <div
        class="heading"
      >
        {{ i18n['flag.discussion']}}
      </div>
      <div
          class="discussion-post bg-light"
          v-for="(answer,i) in sortedAnswers"
          :class="{
            'creator': answer.authorId === courseCreator,
            'question': answer.isQuestion
          }"
          :key="'answer-'+i"
      >
        <div
          v-if="editAnswer !== answer.id"
          class="row p-3 m-2"
        >
          <div class="col pre">{{ answer.text }}</div>
          <div
            class="col-0 answer-edit"
            v-if="answer.authorId === userId"
          >
            <label
              for="edit-answer"
              class="sr-only">
              {{ i18n['flag.editAnswer'] }}
            </label>
            <i
              id="edit-answer"
              class="fas fa-edit eventful"
              @click="e => prepareAnswerEdit(e, answer)"
              @keydown.enter="e => prepareAnswerEdit(e, answer)"
              :title="i18n['flag.editAnswer']"
              v-b-tooltip.bottom
            ></i>
          </div>
        </div>
        <div
          v-else
          class="form-group"
        >
          <div>
            <label
              for="answer-editor"
              class="sr-only">
              {{ i18n['flag.editQuestion'] }}
            </label>
            <textarea
              id="answer-editor"
              v-model="answerToEdit"
              class="w-100"
              rows="5"
            ></textarea>
          </div>
          <div class="form-group row">
            <div class="col">
              <b-button
                @click="saveAnswer(answer)"
                @keydown.enter="saveAnswer(answer)"
              >
                <i class="fas fa-save"></i>
                {{ i18n['save'] }}
              </b-button>
              <b-button
                :class="langIsAr? 'mr-2': 'ml-2'"
                @click="editAnswer =''"
                @keydown.enter="editAnswer =''"
              >
                {{ i18n['cancel'] }}
              </b-button>
            </div>
            <div class="col">
              <label
                for="answerQuestion2"
                class="form-check-label"
              >
                <strong>{{ i18n['flag.answerQuestion'] }}</strong>
              </label>
              <input
                id="answerQuestion2"
                type="checkbox"
                v-model="editedAnswerIsQuestion"
                :class="langIsAr? 'mr-3': 'ml-3'"
              >
            </div>
          </div>

        </div>
        <div
          class="answer-meta row text-center"
        >
          <div
            class="col answer-author"
            v-if="!anonQuestion || isCourseCreator"
          >
            <label
              for="author-icon"
              class="sr-only"
            >
              {{ i18n['flag.answerAuthor'] }}
            </label>
            <i
              id="author-icon"
              class="fas fa-user ml-2 mr-2"
              :title="i18n['flag.answerAuthor']"
              v-b-tooltip.bottom
            ></i>
            <small>{{ i18n['by'] }} #{{ showUserName(answer.authorId) }}</small>
          </div>
          <div class="answer-edited col-1">
            <span v-if="answer.edited">
              <i
                class="fas fa-pen"
                :title="i18n['flag.editedAnswer']"
                v-b-tooltip.bottom
              ></i>
              <small class="sr-only">
                {{ i18n['flag.editedAnswer']}}
              </small>
            </span>
          </div>
          <div class="answer-timestamp col">
            <label
              for="answer-time"
              class="sr-only"
            >
              {{ i18n['flag.answerTime'] }}
            </label>
            <i
              id="answer-time"
              class="fas fa-clock ml-2 mr-2"
              :title="i18n['flag.answerTime']"
              v-b-tooltip.bottom
            ></i>
            <small>
              {{ timeAndDate(answer.timestamp) }}
            </small>
          </div>
          <div
            class="col-2 answer-vote"
            :class="langIsAr? 'text-left': 'text-right'"
          >
            <label
              for="vote-up"
              class="sr-only"
            >
              {{ i18n['flag.voteUp'] }}
            </label>
            <i
              id="vote-up"
              class="fas fa-arrow-up"
              :class="voted(answer) === 1? 'active' : ''"
              @click="vote(answer, 1); $event.target.blur()"
              @keydown.enter="vote(answer, 1); $event.target.blur()"
              tabindex="0"
              :title="i18n['flag.voteUp']"
              v-b-tooltip.bottomright
            ></i>
            <label
              for="vote-down"
              class="sr-only"
            >
              {{ i18n['flag.voteUp'] }}
            </label>
            <i
              id="vote-down"
              class="fas fa-arrow-down"
              :class="voted(answer) === -1? 'active' : ''"
              @click="vote(answer, -1); $event.target.blur()"
              @keydown.enter="vote(answer, -1); $event.target.blur()"
              tabindex="0"
              :title="i18n['flag.voteDown']"
              v-b-tooltip.bottomright
            ></i>
            {{ answer.score>0 ? '+' : ''}} {{ answer.score }}
          </div>


        </div>
        <div
          v-if="answer.authorId === courseCreator"
          class="answer-icon"
          tabindex="0"
          :title="i18n['flag.creatorAnswer']"
          v-b-tooltip.bottom
        >
          <i class="fas fa-user-graduate">
          </i>
        </div>
        <div
          v-if="answer.isQuestion"
          class="answer-icon"
          tabindex="0"
          :title="i18n['flag.answerIsQuestion']"
          v-b-tooltip.bottom
        >
          <i class="fas fa-question">
          </i>
        </div>
      </div>

    </div>
    <div class="add-answer">
      <div class="heading">
        {{ i18n['flag.postAnswer'] }}
      </div>
      <form @submit.prevent="addAnswer">
        <div class="form-group">
          <div class="form-group row">
            <label
              for="my-answer"
              class="sr-only"
            >
              {{ i18n['flag.typeAnswer'] }}
            </label>

            <textarea
                id="my-answer"
                rows="5"
                v-model="newAnswer"
                class="form-control"
                :placeholder="i18n['flag.typeAnswer']"
                :disabled="answerSent || noNewAnswer"
                @focus="subFocus = true"
                @blur="subFocus = false"
            ></textarea>
          </div>
          <div class="form-group row">
            <div class="col">
              <b-button
                  type="submit"
                  :class="langIsAr? 'ml-auto': 'mr-auto'"
                  :disabled="answerSent || noNewAnswer"
              >
                {{ this.i18n['flag.sendAnswer'] }}
              </b-button>
            </div>
            <div class="col">
              <label
                for="answerQuestion"
                class="form-check-label"
              >
                <strong>{{ i18n['flag.answerQuestion'] }}</strong>
                <i
                  class="fas fa-question-circle"
                  :class="langIsAr? 'mr-2': 'ml-2'"
                  :title="i18n['flag.answerQuestionHint']"
                  v-b-tooltip.bottom
                ></i>
              </label>
              <input
                id="answerQuestion"
                type="checkbox"
                v-model="answerIsQuestion"
                :class="langIsAr? 'mr-3': 'ml-3'"
              >
            </div>

          </div>
        </div>
        <div class="answer-hint">
          <span
            class="m-auto"
          >
            {{ answerHint() }}
          </span>
        </div>
      </form>

    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { v4 as uuidv4 } from 'uuid'
import { locale, time } from '@/mixins'

export default {
  name: 'flag-answer',
  mixins: [
      locale,
      time
  ],
  computed: {
    ...mapGetters(['content', 'courseCreator', 'courseFlags', 'userId']),

    /**
     * function anonQuestion: returns if question was asked anonymously
     *
     * Author: cmc
     *
     * Last Updated: October 21, 2021
     * @returns {boolean}
     */
    anonQuestion() {
      return this.currentFlag? this.currentFlag.anonymous: false
    },

    /**
     * function currentFlag: returns current flag if any is set
     *
     * Author: cmc
     *
     * Last Updated: September 20, 2021
     * @returns {null|object} current flag
     */
    currentFlag() {
      return this.$store.getters.singleFlag(this.$route.params.id)
    },

    /**
     * function flagAuthor: return ID of flag author
     *
     * Author: cmc
     *
     * Last Updated: September 20, 2021
     * @returns {boolean|number|string|*}
     */
    flagAuthor() {
      return this.currentFlag?
        this.currentFlag.authorId :
        'unknown'
    },

    /**
     * function isCourseCreator: returns if user is course creator
     *
     * Author: cmc
     *
     * Last Updated: October 21, 2021
     * @returns {boolean}
     */
    isCourseCreator() {
      return this.courseCreator === this.userId
    }
  },

  watch: {
    currentFlag: {
      deep: true,
      handler() {
        this.question = this.currentFlag.question.text
      }
    }
  },

  data() {
    return {
      answerIsQuestion: false,
      answerSent: false,
      answerToEdit: '',
      // anonymous: false,
      editAnswer: '',
      editedAnswerIsQuestion: false,
      editQuestion: false,
      // filteredFlag: null,
      newAnswer: '',
      newFlag: null,
      noNewAnswer: false,
      sortedAnswers: [],
      subFocus: false,
      question: '',
    }
  },
  created() {
    this.question = this.currentFlag.question.text
    this.checkForNewestAnswer()
    this.updateSortedAnswers()
  },

  methods: {

    /**
     * function addAnswer: send answer to store
     *
     * Author: cmc
     *
     * Last Updated: September 20, 2021
     */
    addAnswer() {
      const myAnswer = {
        text: this.newAnswer,
        authorId: this.userId,
        timestamp: Date.now(),
        score: 1,
        isQuestion: this.answerIsQuestion,
        id: uuidv4()
      }
      this.$store.commit('appendFlagAnswer', {
        answer: myAnswer,
        id: this.currentFlag.referenceId
      })
      this.subFocus = false
      this.newAnswer = ''
      this.answerSent = true
      this.updateSortedAnswers()
    },

    /**
     * function answerHint: returns string depending on answer state
     *
     * Author: cmc
     *
     * Last Updated: September 20, 2021
     * @returns {*|string}
     */
    answerHint() {
      return this.answerSent ? this.i18n['flag.ty'] :
          this.noNewAnswer? this.i18n['flag.noNewAnswer'] : ''
    },

    /**
     * function checkForNewestAnswer(): switch noNewAnswer to true if current user
     *  has written the latest answer
     *
     * Author: cmc
     *
     * Last Updated: September 20, 2021
     */
    checkForNewestAnswer() {
      let ourAns = [...this.currentFlag.answers]
      if (ourAns.length !== 0) {
        ourAns.sort((a, b) => {
          return b.timestamp - a.timestamp
        })
        if (ourAns[0].authorId === this.userId) {
          this.noNewAnswer = true
        }
      }
    },

    /**
     * function prepareAnswerEdit: set editAnswer to current answer
     *
     * Author: cmc
     *
     * Last Updated: October 21, 2021
     */
    prepareAnswerEdit(e, answer) {
      this.editAnswer = answer.id
      this.answerToEdit = answer.text
      e.target.blur()
    },

    /**
     * function saveAnswer: save edited answer in store, switch editAnswer bool
     *
     * Author: cmc
     *
     * Last Updated: September 20, 2021
     * @param answer store item
     */
    saveAnswer(answer) {
      this.$store.commit('updateAnswer', {
        answer: answer,
        text: this.answerToEdit,
        bool: this.editedAnswerIsQuestion
      })
      this.editAnswer = ''
    },

    /**
     * function saveQuestion: save edit to flag question, toggle editQuestion bool
     *
     * Author: cmc
     *
     * Last Updated: September 20, 2021
     */
    saveQuestion(){
      this.$store.commit('updateFlagQuestion',
        {flag: this.currentFlag, question: this.question})
      this.editQuestion = false
    },

    /**
     * function showUserName: show user name
     *  TODO: replace with username when available
     * @param id
     * @returns {*}
     */
    showUserName(id) {
      return id
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
    timeAndDate(timestamp) {
      const time = new Date(timestamp)
      return `${this.locDate(time)}, ${this.locTime(time)}`
    },

    /**
     * function updateFilteredFlag: update filteredFlag
     *
     * Author: cmc
     *
     * Last Updated: September 20, 2021
     */
    updateFilteredFlag() {
      this.filteredFlag = this.$store.getters.singleFlag(this.$route.params.id)
      this.question = this.filteredFlag.question.text
    },

    /**
     * function updateSortedAnswers: renew sorted answers by score
     *
     * Author: cmc
     *
     * Last Updated: September 20, 2021
     */
    updateSortedAnswers() {
      this.sortedAnswers = [...this.currentFlag.answers].sort((a, b) => b.score - a.score)
    },

    /**
     * function vote: upvote or downvote an answer
     *
     * Author: cmc
     *
     * Last Updated: October 21, 2021
     * @param answer
     * @param val
     */
    vote(answer, val) {
      // console.trace(answer)
      if (answer.authorId === this.userId) { // no voting on own answer
        this.$bvToast.toast(this.i18n['flag.noSelfVote'], {
          title: this.i18n['flag.noSelfVoteTitle'],
          toaster: 'b-toaster-bottom-center',
          variant: 'danger'
        })
      } else {
        const uid = this.userId+''
        this.$store.commit('voteOnFlagAnswer', {answer, val, uid})
      }
    },

    /**
     * function voted: returns user's vote on answer
     *
     * Author: cmc
     *
     * Last Updated: October 21, 2021
     * @param answer
     * @returns {number}
     */
    voted(answer) {
      return answer.votes? answer.votes[this.userId]: 0
    }
  }
}
</script>

<style scoped>
.answer-icon {
  position: absolute;
  box-sizing: border-box;
  top: calc(33%);
  left: -20px;
  right: 0;
  bottom: 0;
  width: 40px;
  height: 40px;
  font-size: 1.5rem;
  border-radius: 20px;
  background-color: #343a40;
  color: whitesmoke;
  padding-top: 3px;
  padding-left: 7px;
}
i.active {
  color: #b81e00;
}
.answer-vote>i {
  cursor: pointer;
  margin-right: 0.5rem;
}

.pre {
  white-space: pre;
}
</style>
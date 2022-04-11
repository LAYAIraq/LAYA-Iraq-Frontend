<template>
  <div
    class="pick-up-flag"
  >
    <div class="flag-title">
      <div class="title-text">
        <h1>
          {{ y18n('flag.provideClarification') }}
        </h1>
      </div>
    </div>
    <div class="flag-question">
      <div class="heading">
        {{ y18n('flag.question') }}
      </div>
      <div
        v-if="!editQuestion"
        class="question-text"
      >
        <span class="pre">{{ currentFlag.question.text }}</span><!-- no indenting b/c of pre-->
      </div>
      <div
        v-else
        class="question-text"
      >
        <label
          for="question-editor"
          class="sr-only"
        >
          {{ y18n('flag.editQuestion') }}
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
          {{ y18n('save') }}
        </b-button>
      </div>
      <div class="question-meta row">
        <div
          v-if="!anonQuestion || isCourseCreator"
          class="col-5"
        >
          {{ y18n('by') }}
          #{{ showUserName(flagAuthor) }},
          {{ timeSince(currentFlag.created) }}
        </div>
        <div
          v-else
          class="col-5"
        >
          {{ timeSince(currentFlag.created) }}
        </div>
        <div
          v-if="currentFlag.question.edited"
          class="col-5"
        >
          {{ y18n('edited') }} {{ timeSince(currentFlag.question.editTime) }}
        </div>
        <div
          v-if="userId === currentFlag.authorId"
          class="col"
        >
          <i
            id="edit-question"
            v-b-tooltip.bottom
            class="fas fa-edit eventful"
            :class="langIsAr? 'float-left': 'float-right'"
            tabindex="0"
            :title="y18n('flag.editQuestion')"
            :aria-label="y18n('flag.editQuestion')"
            @click="editQuestion = true; $event.target.blur()"
            @keydown.enter="editQuestion = true; $event.target.blur()"
          >
          </i>
        </div>
      </div>
    </div>
    <div
      v-if="currentFlag.answers.length !== 0"
      class="flag-discussion"
    >
      <div
        class="heading"
      >
        {{ y18n('flag.discussion') }}
      </div>
      <div
        v-for="(answer,i) in sortedAnswers"
        :key="'answer-'+i"
        class="discussion-post bg-light"
        :class="{
          'creator': answer.authorId === courseCreator,
          'question': answer.isQuestion
        }"
      >
        <div
          v-if="editAnswer !== answer.id"
          class="row p-3 m-2"
        >
          <div class="col pre">
            {{ answer.text }}
          </div>
          <div
            v-if="answer.authorId === userId"
            class="col-0 answer-edit"
          >
            <label
              for="edit-answer"
              class="sr-only"
            >
              {{ y18n('flag.editAnswer') }}
            </label>
            <i
              id="edit-answer"
              v-b-tooltip.bottom
              class="fas fa-edit eventful"
              :title="y18n('flag.editAnswer')"
              @click="e => prepareAnswerEdit(e, answer)"
              @keydown.enter="e => prepareAnswerEdit(e, answer)"
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
              class="sr-only"
            >
              {{ y18n('flag.editQuestion') }}
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
                {{ y18n('save') }}
              </b-button>
              <b-button
                :class="langIsAr? 'mr-2': 'ml-2'"
                @click="editAnswer =''"
                @keydown.enter="editAnswer =''"
              >
                {{ y18n('cancel') }}
              </b-button>
            </div>
            <div class="col">
              <label
                for="answerQuestion2"
                class="form-check-label"
              >
                <strong>{{ y18n('flag.answerQuestion') }}</strong>
              </label>
              <input
                id="answerQuestion2"
                v-model="editedAnswerIsQuestion"
                type="checkbox"
                :class="langIsAr? 'mr-3': 'ml-3'"
              >
            </div>
          </div>
        </div>
        <div
          class="answer-meta row text-center"
        >
          <div
            v-if="!anonQuestion || isCourseCreator"
            class="col answer-author"
          >
            <label
              for="author-icon"
              class="sr-only"
            >
              {{ y18n('flag.answerAuthor') }}
            </label>
            <i
              id="author-icon"
              v-b-tooltip.bottom
              class="fas fa-user ml-2 mr-2"
              :title="y18n('flag.answerAuthor')"
            ></i>
            <small>{{ y18n('by') }} #{{ showUserName(answer.authorId) }}</small>
          </div>
          <div class="answer-edited col-1">
            <span v-if="answer.edited">
              <i
                v-b-tooltip.bottom
                class="fas fa-pen"
                :title="y18n('flag.editedAnswer')"
              ></i>
              <small class="sr-only">
                {{ y18n('flag.editedAnswer') }}
              </small>
            </span>
          </div>
          <div class="answer-timestamp col">
            <label
              for="answer-time"
              class="sr-only"
            >
              {{ y18n('flag.answerTime') }}
            </label>
            <i
              id="answer-time"
              v-b-tooltip.bottom
              class="fas fa-clock ml-2 mr-2"
              :title="y18n('flag.answerTime')"
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
              {{ y18n('flag.voteUp') }}
            </label>
            <i
              id="vote-up"
              v-b-tooltip.bottomright
              class="fas fa-arrow-up"
              :class="voted(answer) === 1? 'active' : ''"
              tabindex="0"
              :title="y18n('flag.voteUp')"
              @click="vote(answer, 1); $event.target.blur()"
              @keydown.enter="vote(answer, 1); $event.target.blur()"
            ></i>
            <label
              for="vote-down"
              class="sr-only"
            >
              {{ y18n('flag.voteUp') }}
            </label>
            <i
              id="vote-down"
              v-b-tooltip.bottomright
              class="fas fa-arrow-down"
              :class="voted(answer) === -1? 'active' : ''"
              tabindex="0"
              :title="y18n('flag.voteDown')"
              @click="vote(answer, -1); $event.target.blur()"
              @keydown.enter="vote(answer, -1); $event.target.blur()"
            ></i>
            {{ answer.score>0 ? '+' : '' }} {{ answer.score }}
          </div>
        </div>
        <div
          v-if="answer.authorId === courseCreator"
          v-b-tooltip.bottom
          class="answer-icon"
          tabindex="0"
          :title="y18n('flag.creatorAnswer')"
        >
          <i class="fas fa-user-graduate">
          </i>
        </div>
        <div
          v-if="answer.isQuestion"
          v-b-tooltip.bottom
          class="answer-icon"
          tabindex="0"
          :title="y18n('flag.answerIsQuestion')"
        >
          <i class="fas fa-question">
          </i>
        </div>
      </div>
    </div>
    <div class="add-answer">
      <h2 class="heading">
        {{ y18n('flag.postAnswer') }}
      </h2>
      <form @submit.prevent="addAnswer">
        <div class="form-group">
          <div class="form-group row">
            <label
              for="my-answer"
              class="sr-only"
            >
              {{ y18n('flag.typeAnswer') }}
            </label>

            <textarea
              id="my-answer"
              v-model="newAnswer"
              rows="5"
              class="form-control"
              :placeholder="y18n('flag.typeAnswer')"
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
                {{ y18n('flag.sendAnswer') }}
              </b-button>
            </div>
            <div class="col">
              <label
                for="answerQuestion"
                class="form-check-label"
              >
                <strong>{{ y18n('flag.answerQuestion') }}</strong>
                <i
                  v-b-tooltip.bottom
                  class="fas fa-question-circle"
                  :class="langIsAr? 'mr-2': 'ml-2'"
                  :title="y18n('flag.answerQuestionHint')"
                ></i>
              </label>
              <input
                id="answerQuestion"
                v-model="answerIsQuestion"
                type="checkbox"
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
  name: 'FlagAnswer',

  mixins: [
    locale,
    time
  ],

  data () {
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
      question: ''
    }
  },

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
    anonQuestion () {
      return this.currentFlag ? this.currentFlag.anonymous : false
    },

    /**
     * function currentFlag: returns current flag if any is set
     *
     * Author: cmc
     *
     * Last Updated: September 20, 2021
     * @returns {null|object} current flag
     */
    currentFlag () {
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
    flagAuthor () {
      return this.currentFlag
        ? this.currentFlag.authorId
        : 'unknown'
    },

    /**
     * function isCourseCreator: returns if user is course creator
     *
     * Author: cmc
     *
     * Last Updated: October 21, 2021
     * @returns {boolean}
     */
    isCourseCreator () {
      return this.courseCreator === this.userId
    }
  },

  watch: {
    currentFlag: {
      deep: true,
      handler () {
        this.question = this.currentFlag.question.text
      }
    }
  },

  created () {
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
    addAnswer () {
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
    answerHint () {
      return this.answerSent
        ? this.y18n('flag.ty')
        : this.noNewAnswer ? this.y18n('flag.noNewAnswer') : ''
    },

    /**
     * function checkForNewestAnswer(): switch noNewAnswer to true if current user
     *  has written the latest answer
     *
     * Author: cmc
     *
     * Last Updated: September 20, 2021
     */
    checkForNewestAnswer () {
      const ourAns = [...this.currentFlag.answers]
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
    prepareAnswerEdit (e, answer) {
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
    saveAnswer (answer) {
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
    saveQuestion () {
      this.$store.commit('updateFlagQuestion',
        { flag: this.currentFlag, question: this.question })
      this.editQuestion = false
    },

    /**
     * function showUserName: show user name
     *  TODO: replace with username when available
     * @param id
     * @returns {*}
     */
    showUserName (id) {
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
    timeAndDate (timestamp) {
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
    updateFilteredFlag () {
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
    updateSortedAnswers () {
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
    vote (answer, val) {
      // console.trace(answer)
      if (answer.authorId === this.userId) { // no voting on own answer
        this.$bvToast.toast(this.y18n('flag.noSelfVote'), {
          title: this.y18n('flag.noSelfVoteTitle'),
          toaster: 'b-toaster-bottom-center',
          variant: 'danger'
        })
      } else {
        const uid = this.userId + ''
        this.$store.commit('voteOnFlagAnswer', { answer, val, uid })
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
    voted (answer) {
      return answer.votes ? answer.votes[this.userId] : 0
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

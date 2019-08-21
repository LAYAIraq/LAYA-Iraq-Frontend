<template>
  <div class="ly-course-quiz">

    <ly-quiz-schoice v-if="content.type === 'schoice'" :content="content">
    </ly-quiz-schoice>

    <!-- author controls -->
    <div v-if="isAuthor" class="author">
      <span>Wähle die Art der Übung:
        <select v-model="content.type">
          <option value="schoice">Single Choice</option>
          <option value="mchoice">Multiple Choice</option>
        </select>
      </span>
      <ly-lang-dd :onChoose="setContent"></ly-lang-dd>
    </div>

  </div>
</template>

<script>
import http from 'axios'
import {mapGetters, mapState} from 'vuex'

import lyLangDd from '@/components/lang-dd'
import lyQuizSchoice from '@/components/quiz-schoice'

import langs from '@/misc/langs.js'

export default {
  name: 'ly-course-quiz',
  created () {
    this.contents = this.quiz.contents
    ? [ ...this.quiz.contents ] : []

    if (this.contents.length === 0) {
      let ctx = this
      const courseQuizId = this.quiz.id
      http.all(langs.map(lang => http.post('quizcontent', {
        lang, courseQuizId, type: 'schoice'
      }))).then(newContents => {
        console.log('quizcontent', newContents)
        ctx.contents = newContents.map(c => c.data)
        this.setContent(this.profile.lang)
      }).catch(err => console.error(err))
    } else this.setContent(this.profile.lang)
  },
  data () {
    return {
      content: {},
      contents: []
    }
  },
  props: {
    quiz: Object
  },
  computed: {
    ...mapState(['profile']),
    ...mapGetters(['isAuthor'])
  },
  methods: {
    update: function (content, lang) {
      const i = this.contents.findIndex(c => c.lang === lang)
      http.patch('quizcontent', {
        id: this.contents[i].id, ...content
      }).then(({data}) => {
        Object.assign(this.contents[i], content)
      }).catch(err => console.error(err))
    },
    setContent: function (lang) {
      this.content = this.contents.find(c => c.lang === lang)
    }
  },
  components: {
    lyLangDd,
    lyQuizSchoice
  }
}
</script>

<style scoped>
.author {
  padding: 0.5rem;
  border: 2px solid lightskyblue;

  display: flex;
  justify-content: space-between;
}
.ly-course-quiz {
  padding: 0.5rem;
}
</style>

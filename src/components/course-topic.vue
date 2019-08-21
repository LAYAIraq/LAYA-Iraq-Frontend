<template>
  <div class="ly-course-topic">

    <h5 v-show="noContents" class="text-center">
      <i class="far fa-meh"></i>
      <span>Dieser Inhalt ist noch leer</span>
      <br>
    </h5>

    <!-- contents -->
    <div v-if="!noContents">
      <ly-media-text :update="update"
        :contents="contents"></ly-media-text>

      <ly-media-simple :update="update"
        :contents="contents"></ly-media-simple>

      <ly-media-video :update="update"
        :contents="contents"></ly-media-video>
    </div>

  </div>
</template>

<script>
import http from 'axios'
import {mapGetters} from 'vuex'

import lyLangDd from '@comps/lang-dd'
import lyMediaText from '@comps/media-text'
import lyMediaSimple from '@comps/media-simple'
import lyMediaVideo from '@comps/media-video'

import langs from '../misc/langs.js'

export default {
  name: 'ly-course-topic',
  created () {
    this.contents = this.topic.contents
    ? [ ...this.topic.contents ] : []

    if (this.contents.length === 0) {
      let ctx = this
      const courseTopicId = this.topic.id
      http.all(langs.map(lang => http.post('topiccontent', {
        lang, courseTopicId
      }))).then(newContents => {
        console.log('topiccontents', newContents)
        ctx.contents = newContents.map(c => c.data)
      }).catch(err => console.error(err))
    }
  },
  data () {
    return {
      contents: []
    }
  },
  props: {
    topic: Object
  },
  computed: {
    ...mapGetters(['isAuthor']),

    noContents: function () {
      return this.contents.length === 0
    }
  },
  methods: {
    update: function (content, lang) {
      const i = this.contents.findIndex(c => c.lang === lang)
      http.patch('topiccontent', {
        id: this.contents[i].id, ...content
      }).then(({data}) => {
        Object.assign(this.contents[i], content)
      }).catch(err => console.error(err))
    }
  },
  components: {
    lyLangDd,
    lyMediaText,
    lyMediaSimple,
    lyMediaVideo
  }
}
</script>

<style scoped>
.ly-course-topic {
  padding: 0.5rem;
}
</style>

<template>
  <div v-if="text !== '' || isAuthor"
    class="ly-media-text position-relative mb-3">

    <div class="text text-secondary mb-2">
      <i class="far fa-lightbulb"></i>
      <a v-if="!profile.prefs.media.text" href='#'
        class="media-switch ly-focus" @click.prevent="toggleMedia('text')">
        Inhalt als Text anzeigen
      </a>
      <a v-else href='#'
        class="media-switch ly-focus" @click.prevent="toggleMedia('text')">
        Text-Inhalt verstecken
      </a>
    </div>

    <div v-show="profile.prefs.media.text">
      <span v-html="text"></span>
    </div>

    <!-- author controls -->
    <div v-if="isAuthor && profile.prefs.media.text" class="author">
      <textarea v-model="text" class="w-100" placeholder="HTML">
      </textarea>
      <div class="author-controls">
        <ly-lang-dd :onChoose="setContent"></ly-lang-dd>
        <button class="btn btn-sm btn-warning" @click="clear">
          <i class="fas fa-times"></i> Leeren
        </button>
        <button class="btn btn-sm btn-primary" @click="save">
          <i class="fas fa-check"></i> Speichern
        </button>
      </div>
    </div>

    <!-- media type hint -->
    <span v-if="isAuthor" class="hint text-primary">
      <i class="fas fa-align-left"></i>
    </span>
  </div>
</template>

<script>
import {mapState, mapGetters, mapMutations} from 'vuex'

import lyLangDd from '@comps/lang-dd'

export default {
  name: 'ly-media-text',
  created () {
    this.setContent(this.profile.lang)
  },
  data () {
    return {
      text: '',

      lang: ''
    }
  },
  props: {
    contents: Array,
    update: Function
  },
  computed: {
    ...mapState(['profile']),
    ...mapGetters(['isAuthor'])
  },
  methods: {
    ...mapMutations(['toggleMedia']),

    save: function () {
      const {text, lang} = this
      this.update({text}, lang)
    },
    clear: function () {
      this.text = ''
    },
    setContent: function (lang) {
      const contentByLang = this.contents.find(c => c.lang === lang)
      this.lang = lang
      this.text = contentByLang.text
    }
  },
  components: {
    lyLangDd
  }
}
</script>

<style scoped>
.author {
  position: relative;
  border: 2px solid lightskyblue;
}
.author-controls {
  position: absolute;
  top: 0;
  right: 0;
}
textarea {
  height: 10rem;
}
.hint {
  position: absolute;
  top: 0;
  left: -2rem;
}
.media-switch {
  color: #444;
  text-decoration: underline;
}
</style>

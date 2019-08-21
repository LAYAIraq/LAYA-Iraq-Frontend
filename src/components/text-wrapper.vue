<template>
  <div class="ly-text-wrapper">

    <div class="text text-secondary">
      <i class="far fa-lightbulb"></i>
      <a href='#'
         class="media-switch ly-focus"
         @click.prevent="toggleMedia('text')">
        {{ hint }}
      </a>
    </div>

    <div v-show="profile.prefs.media.text">
      <slot></slot>
    </div>

  </div>
</template>

<script>
import {mapState, mapGetters, mapMutations} from 'vuex'

export default {
  name: 'ly-text-wrapper',
  computed: {
    ...mapState(['profile']),
    hint: function () {
      if (this.profile.prefs.media.text) {
        if (this.profile.lang === 'de') {
          return 'Text-Inhalt verstecken'
        } else {
          return 'Hide text content'
        }
      } else {
        if (this.profile.lang === 'de') {
          return 'Inhalt als Text anzeigen'
        } else {
          return 'Show content as text'
        }
      }
    }
  },
  methods: {
    ...mapMutations(['toggleMedia'])
  }
}
</script>

<style scoped>
.media-switch {
  color: #444;
  text-decoration: underline;
}
</style>

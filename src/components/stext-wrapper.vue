<template>
  <div class="ly-stext-wrapper">

    <div class="text text-secondary">
      <i class="far fa-lightbulb"></i>
      <a href='#'
         class="media-switch ly-focus"
         @click.prevent="toggleMedia('simple')">
        {{ profile.prefs.media.simple ?
        'Einfache-Sprache-Inhalt verstecken' :
        'Inhalt als Einfache Sprache anzeigen' }}
      </a>
    </div>

    <div v-show="profile.prefs.media.simple">
      <slot></slot>
    </div>

  </div>
</template>

<script>
import {mapState, mapGetters, mapMutations} from 'vuex'

export default {
  name: 'ly-stext-wrapper',
  computed: {
    ...mapState(['profile'])
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

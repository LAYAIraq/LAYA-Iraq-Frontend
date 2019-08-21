<template>
  <div class="ly-video-wrapper">

    <div class="text text-secondary">
      <i class="far fa-lightbulb"></i>
      <a href='#'
         class="media-switch ly-focus"
         @click.prevent="toggleMedia('video')">
        {{ hint }}
      </a>
    </div>

    <div v-show="profile.prefs.media.video">
      <keep-alive>
        <slot></slot>
      </keep-alive>
    </div>

  </div>
</template>

<script>
import {mapState, mapGetters, mapMutations} from 'vuex'

export default {
  name: 'ly-video-wrapper',
  computed: {
    ...mapState(['profile']),
    hint: function () {
      if (this.profile.prefs.media.video) {
        if (this.profile.lang === 'de') {
          return 'Video-Inhalt verstecken'
        } else {
          return 'Hide video content'
        }
      } else {
        if (this.profile.lang === 'de') {
          return 'Inhalt als Video anzeigen'
        } else {
          return 'Show content as video'
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

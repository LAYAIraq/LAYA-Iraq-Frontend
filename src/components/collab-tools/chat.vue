<!--
  Filename: chat.vue
  Use: jitsi chat collab tool
  Creator: nv
  Since: v1.3.0
-->

<template>
  <div :class="langIsAr? 'text-right': 'text-left'">
    <div class="container-fluid mt-5 mb-5">
      <div class="row">
        <div class="col">
          <h1 class="text-center">
            {{ y18n('collaboration.chat') }}
          </h1>
        </div>
      </div>
    </div>
    <div class="container-fluid mt-5 mb-5">
      <div class="row">
        <div class="col">
          <vue-jitsi-meet
            ref="jitsiRef"
            domain="meet.jit.si"
            :options="jitsiOptions"
          >
          </vue-jitsi-meet>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { JitsiMeet } from '@mycure/vue-jitsi-meet'
import { locale } from '@/mixins'

export default {
  name: 'Chat',

  components: {
    VueJitsiMeet: JitsiMeet
  },

  mixins: [
    locale
  ],

  computed: {
    jitsiOptions () {
      return {
        roomName: 'some-room-name',
        noSSL: false,
        userInfo: {
          email: 'user@email.com',
          displayName: ''
        },
        configOverwrite: {
          enableNoisyMicDetection: false
        },
        interfaceConfigOverwrite: {
          SHOW_JITSI_WATERMARK: false,
          SHOW_WATERMARK_FOR_GUESTS: false,
          SHOW_CHROME_EXTENSION_BANNER: false
        },
        onload: this.onIFrameLoad
      }
    }
  },
  methods: {
    onIFrameLoad () {
      // do stuff
    }
  }
}

</script>

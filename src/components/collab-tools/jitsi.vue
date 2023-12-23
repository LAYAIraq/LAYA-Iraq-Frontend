<!--
  Filename: jitsi.vue
  Use: jitsi instance
  Creator: nv
  Since: v1.3.0
-->

<template>
  <div class="centering">
    <div
      id="jitsi-container"
      style="height: 500px; width: 1000px;"
    ></div>
  </div>
</template>

<script>
require('dotenv').config()

export default {
  name: 'JitsiMeet',
  props: {
    roomName: {
      type: String,
      default: 'laya-iraq'
    },
    domain: {
      type: String,
      default: process.env.VUE_APP_CHAT
    }
  },

  data () {
    return {
      jitsiApi: null
    }
  },

  mounted () {
    if (window.JitsiMeetExternalAPI) {
      this.initializeJitsi()
    } else {
      this.loadJitsiScript(this.initializeJitsi)
    }
  },
  beforeDestroy () {
    if (this.jitsiApi) {
      this.jitsiApi.dispose()
    }
  },
  methods: {
    /**
     * Function loadJitsiScript: load jitsi api
     * Author: nv
     * Since: v1.3.0
     */
    loadJitsiScript (callback) {
      const script = document.createElement('script')
      script.src = 'https://meet.jit.si/external_api.js'
      script.async = true
      script.onload = callback
      document.head.appendChild(script)
    },
    /**
     * Function initializeJitsi: set options an open new JitsiMeetWindow
     * Author: nv
     * Since: v1.3.0
     */
    initializeJitsi () {
      const options = {
        roomName: this.roomName,
        width: '100%',
        height: '100%',
        parentNode: document.getElementById('jitsi-container')
        // Other options
      }
      console.log('Domain ' + this.domain)
      console.log('RoomName ' + this.roomName)
      this.jitsiApi = new window.JitsiMeetExternalAPI(this.domain, options)
    }
  }
}
</script>

<style>
.centering {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>

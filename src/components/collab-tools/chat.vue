<!--
  Filename: chat.vue
  Use: chat component integrating jitsi component
  Creator: nv
  Since: v1.3.0
-->

<template>
  <div :class="langIsAr? 'text-right': 'text-left'">
    <div>
      <b-toast
        id="feedback-new"
        :title="y18n('collaboration.error')"
        static
        variant="success"
        auto-hide-delay="1500"
        class="error-toast"
      >
        {{ y18n('collaboration.error.message') }}
      </b-toast>
    </div>

    <div class="container-fluid mt-5 mb-5">
      <div class="row">
        <div class="col">
          <h1 class="text-center">
            {{ y18n('collaboration.chat') }}
          </h1>
        </div>
      </div>
    </div>

    <!-- forms -->
    <div
      v-if="roomExists === false"
      class="container-fluid mt-5 mb-5"
    >
      <div class="col-15 centering">
        <b-button
          @click="roomCreate"
        >
          {{ y18n('collaboration.chat.createRoom') }}
        </b-button>
      </div>

      <div class="col-15 centering">
        {{ y18n('collaboration.or') }}
      </div>

      <div class="col-15 centering">
        <form>
          <input
            id="roomLink"
            v-model="link"
            type="text"
            class="form-control"
            :placeholder="y18n('collaboration.link')"
          >
        </form>
        <b-button
          @click="roomEnter"
        >
          {{ y18n('collaboration.chat.enterRoom') }}
        </b-button>
      </div>
    </div>

    <!-- jitsi component -->
    <div
      v-else
      class="container-fluid mt-5 mb-5"
    >
      <div class="row">
        <div class="col">
          <jitsi
            :room-name="roomName"
            :domain="domain"
          >
          </jitsi>
        </div>
      </div>
      <div class="col-15 centering">
        <form>
          <input
            id="roomCopyLink"
            v-model="link"
            type="text"
            class="form-control"
            readonly
          >
        </form>
        <b-button
          @click="linkCopy"
        >
          {{ y18n('collaboration.copy') }}
        </b-button>
      </div>
    </div>
  </div>
</template>

<script>
import { v4 as uuidv4 } from 'uuid'
import { locale } from '@/mixins'
import Jitsi from '@/components/collab-tools/jitsi'

export default {
  name: 'Chat',

  components: {
    Jitsi
  },

  mixins: [
    locale
  ],

  data () {
    return {
      roomExists: false,
      link: '',
      roomName: '',
      domain: process.env.VUE_APP_CHAT
    }
  },

  methods: {
    /**
     * Function linkCopy: copy room link to clipboard
     * Author: nv
     * Since: v1.3.0
     */
    async linkCopy () {
      try {
        await navigator.clipboard.writeText(this.link)
        console.log('copy succesful')
      } catch (err) {
        console.error('failed to copy', err)
      }
    },
    /**
     * Function roomCreate: create new room with random id as roomName and enter
     * Author: nv
     * Since: v1.3.0
     */
    roomCreate () {
      this.roomName = uuidv4()
      console.log(this.roomName)
      this.roomExists = true
      this.link = this.domain + '/' + this.roomName
      console.log(this.link)

      this.roomEnter(this.link)
    },
    /**
     * Function roomEnter: extract roomName and domain from link and enter existing room
     * Author: nv
     * Since: v1.3.0
     */
    roomEnter (link) {
      const linkArray = link.toString().split('/')
      console.log(linkArray)
      if (linkArray.length === 2) {
        this.domain = linkArray[0]
        this.roomName = linkArray[1]
        this.roomExists = true
      } else {
        this.$bvToast.show('error-toast')
      }
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

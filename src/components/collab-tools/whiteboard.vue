<!--
  Filename: whiteboard.vue
  Use: whiteboard collab tool
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

    <!-- title -->
    <div class="container-fluid mt-5 mb-5">
      <div class="row">
        <div class="col">
          <h1 class="text-center">
            {{ y18n('collaboration.whiteboard') }}
          </h1>
        </div>
      </div>
    </div>

    <!-- forms -->
    <div
      v-if="boardExists === false"
      class="container-fluid"
    >
      <div class="col-15 centering">
        <b-button
          @click="boardCreate"
        >
          {{ y18n('collaboration.whiteboard.createBoard') }}
        </b-button>
      </div>

      <div class="col-15 centering">
        {{ y18n('collaboration.or') }}
      </div>

      <div class="col-15 centering">
        <form>
          <input
            id="boardLink"
            v-model="link"
            type="text"
            class="form-control"
            :placeholder="y18n('collaboration.link')"
          >
        </form>
        <b-button
          @click="boardEnter"
        >
          {{ y18n('collaboration.whiteboard.enterBoard') }}
        </b-button>
      </div>
    </div>

    <!-- wbo component -->
    <div
      v-else
      class="container-fluid mt-5 mb-5"
    >
      <div class="row">
        <div class="col">
          <wbo
            :board-name="boardName"
            :domain="domain"
          >
          </wbo>
        </div>
      </div>
      <div class="col-15 centering">
        <form>
          <input
            id="boardCopyLink"
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
import { locale } from '@/mixins'
import Wbo from '@/components/collab-tools/wbo'
import { v4 as uuidv4 } from 'uuid'

export default {
  name: 'Whiteboard',

  components: {
    Wbo
  },

  mixins: [
    locale
  ],

  data () {
    return {
      domain: process.env.VUE_APP_WHITEBOARD,
      boardName: '',
      boardExists: false,
      link: ''
    }
  },
  methods: {
    /**
     * Function linkCopy: copies board link to the clipboard
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
     * Function boardCreate: sets boardExists to true and opens new board with random id boardName
     * Author: nv
     * Since: v1.3.0
     */
    boardCreate () {
      this.boardName = uuidv4()
      console.log(this.boardName)
      this.boardExists = true
      this.link = this.domain + '/boards/' + this.boardName
      console.log(this.link)

      this.boardEnter(this.link)
    },
    /**
     * Function boardEnter: extracts boardName and domain in order to enter exiting room
     * Author: nv
     * Since: v1.3.0
     */
    boardEnter (link) {
      const linkArray = link.split('/')
      console.log(linkArray)
      if (linkArray.length === 5) {
        this.domain = linkArray[0] + '//' + linkArray[2]
        this.boardName = linkArray[4]
        this.boardExists = true
      } else {
        this.$bvToast.show('error-toast')
      }
    }
  }
}
</script>

<style>
iframe {
  border: 0.2em solid black;
}
.centering {
   display: flex;
   align-items: center;
   justify-content: center;
 }
</style>

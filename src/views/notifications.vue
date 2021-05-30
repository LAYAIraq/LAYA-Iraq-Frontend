<template>
  <div class="ly-notifications">
    <div class="container">
      <div class="row mt-5 mb-5">
        <div class="col">
          <h1 class="text-center">
            {{ i18n['notifications'] }}
          </h1>
        </div>
      </div>
      <div class="row font-weight-bold mb-2">
        <div class="col">
          <i class="far fa-envelope"></i>
          {{ i18n['message'] }}
        </div>
        <div class="col-sm-3">
          <i class="fas fa-clock"></i>
          {{ i18n['timestamp'] }}
        </div>
        <div class="col-sm-4">
          <i class="fas fa-eye"></i>
          {{ i18n['message.read'] }}
        </div>
      </div>
      <ul class="list-group">
        <li
          class="list-group-item"
          v-for="(c,i) in message.messages"
          :key="i"
          :id="c.noteId"
          :class="{
            'highlighted': $route.query.id === c.noteId,
            'noHighlight': showhighLight
          }"
          @click="$route.query.id === c.noteId? 
            showhighLight = !showhighLight:
            false"
        >
          <div class="message-toggle" >
            <div class="row">
              <div class="col" 
                :class="{
                  'font-italic': c.data.read,
                  'font-weight-bold': !c.data.read
                }"
              >
                <i :class="{
                  'fas fa-envelope-open': c.data.read,
                  'fas fa-envelope': !c.data.read
                }"></i>
                {{ i18n['placeholder'] }}
              </div>
              <div class="col-sm-3">
                {{ timeSince(c.time) }}
                {{ locDate(c.time) }},
                {{ locTime(c.time) }}
              </div>
              <div class="col-sm-4">
                <b-button-group>
                  <button
                    type="button"
                    class="btn btn-primary"
                    variant="dark"
                    v-b-toggle="`collapse-${i}`"
                  >
                    <small>
                      {{ i18n['message.read'] }}
                      <i class="fas fa-chevron-down"></i>
                    </small>
                  </button>
                  <button
                    type="button"
                    class="btn btn-secondary"
                    variant="dark"
                    @click="markAsRead(c)"
                  >
                    <small>
                      {{ i18n['markAsRead'] }}
                      <i class="far fa-check-circle"></i>
                    </small>
                  </button>
                </b-button-group>
                 
              </div>
            </div>
            <div class="row">
              <b-collapse :id="`collapse-${i}`" class="w-100">
                <b-card class="mt-2 w-100">
                
                  KEKW
                </b-card>
              </b-collapse>
                
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { locale, time } from '@/mixins'

export default {
  name: 'laya-notifications',

  mixins: [
    locale,
    time
  ],

  data() {
    return {
      msgList: [],
      showhighLight: true
    }
  },

  computed: {
    ...mapState(['message'])
  },

  created() {
    this.$store.dispatch('getNewMessages')
    if (this.$route.query.hasOwnProperty('id')) {
      this.highlightId = this.$route.query.id
    }
  },

  mounted() {
    // this.highlightMessage()
  },

  methods: {
    /**
     * function highlightMessage: scroll highlighted message into view
     * Author: cmc
     * Last Updated: May 30, 2021
     */
    highlightMessage() {
      if (this.$route.query.hasOwnProperty('id')) {
        const [el] = this.$refs.highlight
        el.scrollIntoView()
      }
    },
    /**
     * Function markAsRead: set 'read' boolean in message's data
     * Author: cmc
     * Last Updated: May 27, 2021
     * @param {string} msg message to mark as read
     */
    markAsRead(msg) {
      this.$store.commit('readNotification', msg.noteId)
    }
  }





}
</script>

<style scoped>

.ly-notifications {
  overflow-y: scroll;
}

.highlighted {
  background-color: tomato;
  transition: background-color .5s ease-out;
}
.highlighted:hover {
  background-color: transparent;
}

.noHighlight { 
  background-color: transparent;
}

</style>
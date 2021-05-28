<template>
  <div class="ly-notifications">
    <div class="container">
      <div class="row">
        <div class="col">
          <h1 class="text-center">
            {{ i18n['notifications'] }}
          </h1>
        </div>
      </div>
      <div class="row">
        <div class="col">
          {{ i18n['type'] }} 
        </div>
        <div class="col">
          {{ i18n['message'] }}
        </div>
        <div class="col">
          {{ i18n['timestamp'] }}
        </div>
        <div class="col">
          <i class="fas fa-eye"></i>
          {{ i18n['markAsRead'] }}
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
          <div class="row">
            <div class="col" :class="{
                'font-italic': c.data.read,
                'font-weight-bold': !c.data.read
                }">
              {{ c.type }}
            </div>
            <div class="col">
              {{ i18n['placeholder'] }}
            </div>
            <div class="col">
              {{ locDate(c.time) }},
              {{ locTime(c.time) }}
            </div>
            <div class="col">
              <button 
                class="btn"
                variant="primary"
                @click="markAsRead(c)"
              >
                DO IT
              </button>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { locale } from '@/mixins'
import locDate from '@/misc/utils.js'
import locTime from '@/misc/utils.js'

export default {
  name: 'laya-notifications',

  mixins: [locale],

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
    ...locDate,
    ...locTime,
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
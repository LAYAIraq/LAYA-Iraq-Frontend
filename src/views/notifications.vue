<template>
  <div 
    class="ly-notifications"
    :class="langIsAr? 'text-right': 'text-left'">
    
    <div class="container mt-5 mb-5">

      <h1 class="text-center">
        {{ i18n['notifications'] }}
      </h1>
        <!-- <a @click="randomNotifications">MAKE RANDOM NOTIFICATIONS</a> -->
    </div>
    <div 
      class="container" 
      id="message-list"
    >
      <div class="row font-weight-bold mb-2">
        <div class="col">
          <i class="far fa-envelope"></i>
          {{ i18n['message'] }}
        </div>
        <div class="col-sm-2">
          <i class="fas fa-clock"></i>
          {{ i18n['timestamp'] }}
        </div>
        <div class="col-sm-3 text-nowrap">
            <button
              type="button"
              class="btn btn-info ml-1"
              :class="langIsAr? 'float-left' : 'float-right'"
              :disabled="!unreadMessages"
              @click="markAllAsRead"
            >
              <i class="fas fa-eye"></i>
              {{ i18n['markAllAsRead'] }}
            </button>
        </div>
      </div>
      <ul 
        v-if="messages.length != 0"
        class="list-group"
      >
        <li
          class="list-group-item"
          v-for="(note ,i) in messages"
          :key="i"
          :id="note.noteId"
          :class="{
            'highlighted': $route.query.id === note.noteId,
            'noHighlight': showhighLight
          }"
          @click="$route.query.id === note.noteId? 
            showhighLight = !showhighLight:
            false"
        >
          <div class="message-toggle" >
            <div class="row">
              <div class="col" 
                :class="{
                  'font-italic': note.data.read,
                  'font-weight-bold': !note.data.read
                }"
              >
                <i :class="{
                  'fas fa-envelope-open': note.data.read,
                  'fas fa-envelope': !note.data.read
                }"></i>
                {{ i18n[`notifications.${note.type}.title`] }}
              </div>
              <div class="col-sm-3">
                <span 
                  class="time-note"
                  :title="noteTime(note.time)"
                  v-b-tooltip.top
                >
                  {{ timeSince(note.time) }}
                </span>
                
              </div>
              <div class="col-sm-2">
                <b-button
                  variant="dark"
                  :class="langIsAr? 'float-left' : 'float-right'"
                  v-b-toggle="`collapse-${i}`"
                >
                  <small>
                    {{ i18n['message.read'] }}
                    <i class="when-open fas fa-chevron-down"></i>
                    <i class="when-closed fas fa-chevron-left"></i>
                  </small>
                </b-button>

                 
              </div>
            </div>
            <div class="row">
              <b-collapse :id="`collapse-${i}`" class="w-100">
                <button 
                  :id="`collapse-${i}-btn`"
                  class="d-none"
                  @click="markAsRead(note)"
                ></button>
                <b-card class="mt-2 w-100">
                  <span class="note-content">
                    {{ i18n[`notifications.${note.type}.text`] }}
                  </span>
                  <span class="note-cta">
                    {{ i18n[`notifications.${note.type}.cta`] }}
                  </span>
                </b-card>
              </b-collapse>
                
            </div>
          </div>
        </li>
      </ul>
      <div 
        v-else
        class="m-5 p-2 text-center"
      >
        {{ i18n['notifications.none'] }}
      </div>
      <div class="row mt-5">
        <b-button 
          variant="warning"
          class="m-auto"
          @click="loadMoreNotifications"
          :disabled="!moreMessages"
        >
          <i :class="loading? 'fas fa-spinner fa-spin' : 'fas fa-plus'"></i>
          {{ i18n['notifications.loadMore'] }}
        </b-button>
      </div>
    </div>
   

  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import { locale, time } from '@/mixins'
import randomNotifications from '@/misc/fillnotifications.js'

export default {
  name: 'laya-notifications',

  mixins: [
    locale,
    time
  ],

  data() {
    return {
      loading: false,
      msgList: [],
      showhighLight: true
    }
  },

  computed: {
    ...mapGetters(['messages', 'unreadMessages']),
    ...mapState(['message']),
    /**
     * moreMessages: return true if more messages can be loaded
     * Author: cmc
     * Last Updated: June 10, 2021
     */
    moreMessages() {
      return (this.messages.length != 0 && this.messages.length % 10 == 0)
    }
  },

  created() {
    this.$store.dispatch('getInitialMessages')
    if (Object.prototype.hasOwnProperty.call(this.$route.query, 'id')) {
      this.highlightId = this.$route.query.id
    }
  },

  mounted() {
    // watch collapse items to trigger markAsRead()
    this.$root.$on('bv::collapse::state', (collapseId, isJustShown) => {
      if (isJustShown) {
        document.getElementById(`${collapseId}-btn`).click()
      }
    })
    // this.highlightMessage()
  },

  beforeDestroy() {
    this.$store.dispatch('updateNoteData')
  },

  methods: {
    ...randomNotifications,
    /**
     * function highlightMessage: scroll highlighted message into view
     * Author: cmc
     * Last Updated: May 30, 2021
     */
    highlightMessage() {
      if (Object.prototype.hasOwnProperty.call(this.$route.query, 'id')) {
        const [el] = this.$refs.highlight
        el.scrollIntoView()
      }
    },

    /**
     * Function loadMoreNotifications: get more messages from database
     * Author: cmc
     * Last Updated: June 10, 2021
     */
    loadMoreNotifications() {
      this.loading = true
      this.$store.dispatch('getAdditionalMessages')
        .catch(err => {
          console.error(err)
        })
        .finally(this.loading = false)
    },
    /**
     * Function markAsRead: set 'read' boolean in message's data
     * Author: cmc
     * Last Updated: May 27, 2021
     * @param {string} msg message to mark as read
     */
    markAsRead(msg) {
      this.$store.commit('readNotification', msg.noteId)
    },

    /** 
     * Function markAllAsRead: set allRead commit in store
     * Author: cmc
     * Last Updated: May 28, 2021
    */
    markAllAsRead() {
      this.$store.commit('allRead')
    },

    /**
     * Function noteTime: return timestamp in locale
     * Author: cmc
     * Last Updated: May 30, 2021
     * @param time timestamp
     */
    noteTime(time) {
      return `${this.locDate(time)}, ${this.locTime(time)}`
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

.collapsed > small > .when-open,
.not-collapsed > small > .when-closed {
  display: none;
}

</style>
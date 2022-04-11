<template>
  <b-dropdown
    id="notifications-list"
    menu-class="notify-icon"
    variant="light"
  >
    <template slot="button-content">
      <!-- <i class="fas fa-bell"></i>
      {{ y18n('notifications') }} -->
      {{ y18n('notifications') }}
      <i class="fas fa-bell fa-lg"></i>

      <span
        v-if="unreadMessages"
        class="note-badge"
      >
        {{ unreadMsgNo }}
      </span>
    </template>

    <b-dropdown-item
      v-for="(note, i) in notifyShortList"
      :key="i"
      class="text-nowrap"
    >
      <router-link
        :to="'/notifications?id=' + note.noteId"
        :highlight="note.noteId"
        :class="!note.read? 'font-weight-bold':''"
      >
        {{ y18n(`notifications.${note.type}.title`) }}
        <span class="timestamp">
          {{ timeSince(note.time) }}
        </span>
      </router-link>
    </b-dropdown-item>

    <b-dropdown-item v-if="!messagesPresent">
      {{ y18n('notifications.none') }}
    </b-dropdown-item>

    <b-dropdown-divider></b-dropdown-divider>

    <b-dropdown-item>
      <router-link to="/notifications">
        {{ y18n('notifications.seeAll') }}
      </router-link>
    </b-dropdown-item>

    <b-dropdown-item v-if="messagesPresent">
      <b-button
        class="w-100"
        variant="info"
        @click="markAllAsRead"
      >
        {{ y18n('markAllAsRead') }}
      </b-button>
    </b-dropdown-item>

    <b-dropdown-item>
      <b-button
        class="w-100"
        @click="getNewNotifications"
      >
        {{ y18n('notifications.getNew') }}
      </b-button>
    </b-dropdown-item>

    <!-- <b-dropdown-item>
      <ly-on-off :check="doNotDisturb"></ly-on-off>
    </b-dropdown-item> -->
  </b-dropdown>
</template>

<script>
import api from '@/backend-url'
// import http from 'axios'
import { storeHandler, locale, time } from '@/mixins'
import { mapGetters, mapState } from 'vuex'
// import lyOnOff from '@/components/on-off-switch.vue'

export default {
  name: 'LyHeaderNotifications',

  // components: {
  //   lyOnOff
  // },

  mixins: [
    storeHandler,
    locale,
    time
  ],

  data () {
    return {
      doNotDisturb: false,
      notifyShortList: []
      // stream: null,
      // streamListener: null
    }
  },

  computed: {
    ...mapGetters([
      'messages',
      'unreadMessages',
      'unreadMsgNo',
      'userId'
    ]),
    ...mapState(['message']),
    /**
     * messagesPresent: returns true if there are notifications
     * Author: cmc
     * Last Updated: June 10, 2021
     */
    messagesPresent () {
      return this.messages.length !== 0
    }
  },

  watch: {
    messages () {
      this.$nextTick(() => this.setShortlist())
    }
  },

  created () {
    this.$store.dispatch('getAllMessages')
    this.setShortlist()
    // this.initiateEventStream()
  },

  beforeDestroy () {
    this.$store.dispatch('updateReadProp')
    // this.stream.close()
  },

  methods: {
    /**
     * Function initiateEventStream: add event listener for
     *  notification event stream to get updates // not used
     * Author: cmc
     * Last Updated: June 20, 2021
     */
    initiateEventStream () {
      const customStreamUrl =
        `${api}/notifications/change-stream?_format=event-stream`
      // http.post(customStreamUrl)
      this.stream = new EventSource(customStreamUrl)
      this.stream.onerror = (err) => {
        // console.log('Error on change stream!')
        console.error(err)
      }
      this.stream.addEventListener('data', (msg) => {
        // helper function to make read property a boolean
        const booleanizeString = (str) => {
          return str === 'true'
            ? true
            : str === 'false'
              ? false
              : str
        }
        const notification = JSON.parse(msg.data)
        console.log('before:', notification.data)
        notification.data.read = booleanizeString(notification.data.read)
        console.log('after: ', notification.data)
        if (notification.data.userId === this.userId) {
          console.log('notification is for us!', notification.data)
          this.$store.commit('appendMsg', notification.data)
        }
      })
    },

    /**
     * Function setShortList: take first 5 elements of
     *  notifications for dropdown
     * Author: cmc
     * Last Updated: May 27, 2021
     */
    setShortlist () {
      const createShortList = () => {
        const tempList = [...this.messages]
        tempList.sort((a, b) => a.time - b.time)
        if (tempList.length > 5) {
          tempList.length = 5
        }
        this.notifyShortList = tempList
      }
      if (this.messages) {
        createShortList()
      } else {
        this.$nextTick(() => {
          createShortList()
        })
      }
    }
  }
}

</script>

<style scoped>
#notifications-list {
  position: relative;
}

#notifications-list > * {
  font-size: 1em !important;
}

.note-badge {
  position: absolute;
  right: 20px;
  top: -5px;
  font-size: .7em;
  font-weight: bold;
  border-radius: 50%;
  padding: 3px;
  color: whitesmoke;
  background-color: tomato;
  min-width: 20px;
}

.timestamp {
  color: rgba(0, 0, 0, 0.5);
}

</style>

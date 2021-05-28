<template>
  <b-dropdown
    id="notifications-list"
    menu-class="notify-icon"
    variant="light"
  >
    <template slot="button-content">
      <!-- <i class="fas fa-bell"></i>
      {{ i18n['notifications'] }} -->
        {{ i18n['notifications'] }}
        <i class="fas fa-bell fa-lg"></i>
    
      <span
        v-if="unreadMessages" 
        class="note-badge"
      >
        {{ unreadMsgNo }}
      </span>
    </template>

    <b-dropdown-item
      v-for="(item, i) in notifyShortList"
      :key="i"
    >
      <router-link
        :to="'/notifications?id=' + item.noteId"
        :highlight="item.noteId"
      >
        {{ item.type }}
      </router-link>
    </b-dropdown-item>

    <b-dropdown-divider></b-dropdown-divider>

    <b-dropdown-item>
      <router-link to="/notifications">
        {{ i18n['notifications.seeAll'] }}
      </router-link>
    </b-dropdown-item>

    <b-dropdown-item>
      <b-button
        variant="info"
        @click="markAllAsRead"
      >
        {{ i18n['markAllAsRead'] }}
      </b-button>
    </b-dropdown-item>
    <!-- <b-dropdown-item>
      <ly-on-off :check="doNotDisturb"></ly-on-off>
    </b-dropdown-item> -->
  </b-dropdown>
</template>

<script>
import { locale } from '@/mixins'
import { mapGetters, mapState } from 'vuex'
// import lyOnOff from '@/components/on-off-switch.vue'

export default {
  name: 'lyHeaderNotifications',

  // components: {
  //   lyOnOff
  // },

  mixins: [
    locale
  ],

  computed: {
    ...mapGetters(['messages', 'unreadMessages', 'unreadMsgNo']),
    ...mapState(['message'])
  },

  data() {
    return {
      doNotDisturb: false,
      newNotifications: false,
      newNotesNumber: 0,
      notifyShortList: []
    }
  },

  watch: {
    messages() {
      this.$nextTick(() => this.setShortlist())
    }
  },

  created() {
    this.$store.dispatch('getNewMessages')
    this.setShortlist()
  },

  methods: {
    /** 
     * Function markAllAsRead: set allRead commit in store
     * Author: cmc
     * Last Updated: May 28, 2021
    */
    markAllAsRead() {
      this.$store.commit('allRead')
    },
    /**
     * Function setShortList: take first 5 elements of
     *  notifications for dropdown
     * Author: cmc
     * Last Updated: May 27, 2021
     */
    setShortlist() {
      const createShortList = () => {
        let tempList = [...this.messages]
        tempList.sort((a, b) => a.time < b.time)
        if (tempList.length > 5) {
          tempList.length = 5
        }
        this.notifyShortList = tempList
      }
      if (this.messages) {
        createShortList()
      }
      else {
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


.note-badge {
  position: absolute;
  right: 20px;
  top: -5px;
  font-size: 0.7em;
  font-weight: bold;
  border-radius: 50%;
  padding: 3px;
  color: whitesmoke;
  background-color: tomato;
  min-width: 20px;
}

</style>

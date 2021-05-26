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
      msgList: []
    }
  },

  computed: {
    ...mapState(['message'])
  },

  created() {
    this.$store.dispatch('getNewMessages')
  },

  methods: {
    ...locDate,
    ...locTime,
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
<!--
  File Name: notifications.vue
  Use: Organize Notifications for Users
  Creator: cmc
  Since: v1.1.0
-->
<template>
  <div
    class="notifications"
    :class="langIsAr? 'text-right': 'text-left'"
  >
    <div class="container mt-5 mb-5">
      <div class="row">
        <div class="col">
          <h1 class="text-center">
            {{ y18n('notifications') }}
          </h1>
        </div>
        <div class="col-3">
          <button
            type="button"
            class="btn btn-success"
            :class="langIsAr? 'float-left' : 'float-right'"
            @click="notificationsFetch"
          >
            <i class="fas fa-download"></i>
            {{ y18n('notifications.getNew') }}
          </button>
        </div>
      </div>
      <!-- <a @click="randomNotifications">MAKE RANDOM NOTIFICATIONS</a> -->
    </div>
    <div
      id="message-list"
      class="container"
    >
      <div class="row font-weight-bold mb-2">
        <div class="col">
          <i class="far fa-envelope"></i>
          {{ y18n('message') }}
        </div>
        <div class="col-sm-2">
          <i class="fas fa-clock"></i>
          {{ y18n('timestamp') }}
        </div>
        <div class="col-sm-3 text-nowrap">
          <button
            type="button"
            class="btn btn-warning ml-1"
            :class="langIsAr? 'float-left' : 'float-right'"
            :disabled="!unreadMessages"
            @click="notificationsMarkRead"
          >
            <i class="fas fa-eye"></i>
            {{ y18n('markAllAsRead') }}
          </button>
        </div>
      </div>
      <ul
        v-if="notifications.length !== 0"
        class="list-group"
      >
        <li
          v-for="(note ,i) in notifications"
          :id="note.noteId"
          :key="i"
          class="list-group-item"
          :class="{
            'highlighted': $route.query.id === note.noteId,
            'noHighlight': showhighLight
          }"
          @click="$route.query.id === note.noteId?
            showhighLight = !showhighLight:
            false"
        >
          <div class="message-toggle">
            <div class="row">
              <div
                class="col"
                :class="{
                  'font-italic': note.read,
                  'font-weight-bold': !note.read
                }"
              >
                <i
                  :class="{
                    'fas fa-envelope-open': note.read,
                    'fas fa-envelope': !note.read
                  }"
                ></i>
                {{ y18n(`notifications.${note.type}.title`) }}
              </div>
              <div class="col-sm-3">
                <span
                  v-b-tooltip.top
                  class="time-note"
                  :title="noteTime(note.time)"
                >
                  {{ timeSince(note.time) }}
                </span>
              </div>
              <div class="col-sm-2">
                <b-button
                  v-b-toggle="`collapse-${i}`"
                  variant="success"
                  :class="langIsAr? 'float-left' : 'float-right'"
                >
                  <small>
                    {{ y18n('message.read') }}
                    <i class="when-open fas fa-chevron-down"></i>
                    <i class="when-closed fas fa-chevron-left"></i>
                  </small>
                </b-button>
              </div>
            </div>
            <div class="row">
              <b-collapse
                :id="`collapse-${i}`"
                class="w-100"
              >
                <button
                  :id="`collapse-${i}-btn`"
                  class="d-none"
                  variant="warning"
                  @click="markAsRead(note)"
                ></button>
                <b-card class="mt-2 w-100">
                  <span class="note-content">
                    {{ replaceStr(note) }}
                  </span>
                  <span
                    v-if="!loading"
                    class="note-cta"
                  >
                    <router-link
                      :to="linkToCourse(note)"
                    >
                      {{ y18n(`notifications.${note.type}.cta`) }}
                    </router-link>
                  </span>
                  <span v-else><i class="fas fa-spinner fa-spin"></i></span>
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
        {{ y18n('notifications.none') }}
      </div>
      <div class="row mt-5">
        <b-button
          variant="warning"
          class="m-auto"
          :disabled="!moreMessages"
          @click="loadMoreNotifications"
        >
          <i :class="loading? 'fas fa-spinner fa-spin' : 'fas fa-plus'"></i>
          {{ y18n('notifications.loadMore') }}
        </b-button>
      </div>
    </div>
  </div>
</template>

<script>
import http from 'axios'
import { mapGetters, mapState } from 'vuex'
import { storeHandler, locale, time } from '@/mixins'
// import randomNotifications from '@/misc/fillnotifications.js'

export default {
  name: 'Notifications',

  mixins: [
    storeHandler,
    locale,
    time
  ],

  data () {
    return {
      loading: false,
      msgList: [],
      showhighLight: true,
      valueCache: {}
    }
  },

  computed: {
    ...mapGetters(['notifications', 'unreadMessages']),
    ...mapState(['message']),
    /**
     * moreMessages: return true if more notifications can be loaded
     * Author: cmc
     * Last Updated: June 10, 2021
     */
    moreMessages () {
      return (this.notifications.length !== 0 && !this.notifications.length % 10 === 0)
    }
  },

  created () {
    this.$store.dispatch('notificationsFetchInitial')
    // if (Object.prototype.hasOwnProperty.call(this.$route.query, 'id')) {
    //   this.highlightId = this.$route.query.id
    // }
    this.cacheValues()
    // this.notifications.forEach(note => this.msgList.push(note))
    // this.msgList.forEach(note => {
    //   let courseName = this.getReference(note.data.courseId)
    //   let courseHref = this.linkToCourse(note)
    //   note['references'] = { courseName: courseName, courseLink: courseHref }
    // })
  },

  mounted () {
    // watch collapse items to trigger markAsRead()
    this.$root.$on('bv::collapse::state', (collapseId, isJustShown) => {
      if (isJustShown) {
        document.getElementById(`${collapseId}-btn`).click()
      }
    })
    // window.setInterval(() => {
    //   this.getNotifications()
    // }, 10000)
    // window.setInterval(() => {
    //     this.loading = false
    //   }, 5000)
    // this.highlightMessage()
    if (!this.valueCache) console.log('error loading valueCache')
  },

  beforeDestroy () {
    this.$store.dispatch('notificationsUpdateRead')
  },

  methods: {
    // ...randomNotifications,
    /**
     * Function cacheValues: get all referencing data for
     *  notifications, set loading to false if done
     *
     * Author: cmc
     *
     * Last Updated: June 26, 2021
     */
    cacheValues () {
      this.loading = true
      const queries = []
      this.notifications.forEach(elem => {
        queries.push(
          this.getReference(elem.data.courseId)
            .then(r => {
            // console.log(r)
              if (!this.valueCache[elem.data.courseId]) {
                this.valueCache[elem.data.courseId] = r
              }
            })
        )
      })
      http.all(queries).finally(() => { this.loading = false })
    },

    /**
     * function linkToCourse: return link to referred course id
     *
     * Author: cmc
     *
     * Last Updated: September 2, 2021
     * @param {object} note notification for which it's used
     */
    linkToCourse (note) {
      // console.log("Rytna show href for: ", note)
      // return '/#'
      // // const courseName = await this.getReference(note.data.courseId)
      // // return(`/courses/${courseName}/1`)
      // TODO: for flag related notification, create link to flag
      switch (note.type) {
        // case 'authorNewFlag' || 'studentFlagNewAnswer': {
        //   if (this.valueCache[note.data.courseId]) {
        //     // console.log(note.data.courseId)
        //     let val = this.valueCache[note.data.courseId]
        //     // console.log(`href is ${val}`)
        //     return(`/courses/${val}/1`)
        //   } else {
        //     return '#'
        //   }
        // }
        default: {
          if (this.valueCache[note.data.courseId]) {
            // console.log(note.data.courseId)
            const val = this.valueCache[note.data.courseId]
            // console.log(`href is ${val}`)
            return (`/courses/${val}/1`)
          } else {
            return '/#'
          }
        }
      }
    },
    /**
     * function getReference: get course name for id
     *
     * Author: cmc
     *
     * Last Updated: September 20, 2021
     */
    async getReference (id) {
      // console.log('we wanna get ref for: ', note)
      // switch(note.type) {
      //   case 'authorNewSub': {
      return new Promise((resolve, reject) => {
        http.get(`courses/getCourseName?courseId=${id}`)
          .then(resp => {
            resolve(resp.data.courseName)
          })
          .catch(err => {
            reject(err)
          })
      })
    // if(this.valueCache['authorNewSub'][note.data.courseId]) {
    //  return
    // } else {
    //   return new Promise ((resolve, reject) =>
    //    http.get(`courses/getCourseName?courseId=${note.data.courseId}`)
    //     .then(resp => {
    //       console.log(resp)
    //       this.valueCache['authorNewSub'][note.data.courseId] =
    //         resp.data.courseName
    //       resolve(resp)
    //     })
    //     .catch((err) => {
    //       console.error(err)
    //       reject(err)
    //     })
    //   )
    // }
      //   }
      //   default: {
      //     console.log('We are in Default case!')
      //     return '#'
      //   }
      // }
    },
    /**
     * function highlightMessage: scroll highlighted message into view
     *
     * Author: cmc
     *
     * Last Updated: May 30, 2021
     */
    highlightMessage () {
      if (Object.prototype.hasOwnProperty.call(this.$route.query, 'id')) {
        const [el] = this.$refs.highlight
        el.scrollIntoView()
      }
    },

    /**
     * Function loadMoreNotifications: get more notifications from database
     *
     * Author: cmc
     *
     * Last Updated: September 21, 2021
     */
    loadMoreNotifications () {
      this.loading = true
      this.$store.dispatch('notificationsFetchAdditional')
        .catch(err => {
          console.error(err)
        })
        .finally(() => { this.loading = false })
    },

    /**
     * Function markAsRead: set 'read' boolean in message's data
     *
     * Author: cmc
     *
     * Last Updated: May 27, 2021
     * @param {object} msg message to mark as read
     */
    markAsRead (msg) {
      this.$store.commit('notificationRead', msg.noteId)
    },

    /**
     * Function noteTime: return timestamp in locale
     * Author: cmc
     * Last Updated: May 30, 2021
     * @param time timestamp
     */
    noteTime (time) {
      return `${this.dateLocalized(time)}, ${this.timeLocalized(time)}`
    },

    /**
     * Function replaceString: replace place holder in notification
     *  text with referenced value
     *
     * Author: cmc
     *
     * Last Updated: September 2, 2021
     * @param {object} note notification object
     */
    replaceStr (note) {
      // TODO: be generic in order to use if for all notification types
      // console.log(note)
      switch (note.type) { // replace placeholders for different notifications, only CID as of now
        default: {
          console.log(note)
          return this.y18n(`notifications.${note.type}.text`)
            .replace('<CID>', this.valueCache[note.data.courseId])
        }
      }
    }
  }

}
</script>

<style scoped>

.notifications {
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

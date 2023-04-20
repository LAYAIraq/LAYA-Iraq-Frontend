/**
 * Filename: notifications.ts
 * Use: Wrap all methods regarding notifications
 * Creator: cmc
 * Since: v1.1.0
 */
import http from 'axios'

export default {
  state: {
    notifications: [],
    notificationsUnreadNumber: 0
  },
  getters: {
    notifications: (state: { notifications: object[] }) => state.notifications,

    notificationsUnread (state: { notificationsUnreadNumber: number}) {
      return state.notificationsUnreadNumber > 0
    },

    notificationsUnreadNumber (state: { notificationsUnreadNumber: number }) {
      return state.notificationsUnreadNumber
    }
  },
  mutations: {
    /**
     * function notificationRead: mark message as read
     *
     * Author: cmc
     *
     * Last Updated: January 27, 2022
     * @param state state variable
     * @param msgId id of message to be marked as read
     */
    notificationRead (
      state: {
        notifications: Array<object>,
        notificationsUnreadNumber: number
      },
      msgId: string
    ) {
      state.notifications.forEach((elem: { noteId: string, read: boolean }) => {
        if (elem.noteId === msgId && !elem.read) {
          elem.read = true
          state.notificationsUnreadNumber--
        }
      })
    },

    /**
     * function notificationsAppend: append message to state
     *  given it's not present yet
     *
     * Author: cmc
     *
     * Last Updated: January 27, 2022
     * @param state state property
     * @param msg the message object to append
     */
    notificationsAppend (
      state: {
        notifications: Array<object>,
        notificationsUnreadNumber: number
      },
      msg: {
        noteId: string,
        read: boolean
      }) {
      // check if notification is already in state, if not, add it
      if (!state.notifications.some((elem: { noteId: string }) => elem.noteId === msg.noteId)) {
        state.notifications.push(msg)
        if (!msg.read) {
          state.notificationsUnreadNumber++
        }
      }
    },

    /**
     * function notificationsReadAll: mark all notifications in state as read
     * Author: cmc
     * Last Updated: May 28, 2021
     * @param state state variables
     */
    notificationsReadAll (state: {
      notifications: Array<object>,
      notificationsUnreadNumber: number
    }) {
      state.notifications.forEach((elem: {
       read: boolean
      }) => {
        elem.read = true
      })
      state.notificationsUnreadNumber = 0
    },

    /**
     * Function notificationsSort: sort notifications from date in
     *  descending order
     *
     * Author: cmc
     *
     * Last Updated: January 27, 2022
     * @param state state variables
     */
    notificationsSort (state: {
      notifications: [
        { time: number }
      ]
    }) {
      state.notifications.sort((a, b) => a.time - b.time)
    }
  },
  actions: {
    /**
     * function notificationsFetchAdditional: get 10 more notifications
     *  for logged user
     *
     * Author: cmc
     *
     * Last Updated: January 27, 2022
     * @param param0 state property
     */
    notificationsFetchAdditional (
      { commit, state, getters }: {
        commit: Function,
        state: {
          notifications: object[]
        },
        getters: {
           userId: number
         }
       }) {
      if (state.notifications.length < 10) {
        return Promise.reject(new Error('No more notifications'))
      }
      return new Promise((resolve, reject) => {
        http.get('notifications', {
          params: {
            filter: {
              skip: state.notifications.length,
              limit: 10, // TODO: use parameter to be flexible?
              order: 'time DESC',
              where: {
                userId: getters.userId
              }
            }
          }
        })
          .then(resp => {
            resp.data.forEach((elem: object) => {
              commit('notificationsAppend', elem)
            })
            commit('notificationsSort')
            resolve(resp)
          })
          .catch(err => reject(err))
      })
    },

    /**
     * function notificationsFetchInitial: get notifications for logged user
     *
     * Author: cmc
     *
     * Last Updated: January 27, 2022
     * @param param0 state property
     */
    notificationsFetchInitial (
      { commit, state, getters }: {
        commit: Function,
        state: { notifications: any[] },
        getters:{ userId: number }
      }) {
      if (state.notifications.length === 0) {
        http.get('notifications', {
          params: {
            filter: {
              limit: 10, // TODO: user parameter?
              order: 'time DESC',
              where: {
                userId: getters.userId
              }
            }
          }
        })
          .then(resp => {
            resp.data.forEach((elem: object) => {
              commit('notificationsAppend', elem)
            })
          })
          .catch(err => console.error(err))
      }
    },

    /**
     * Function notificationsFetchNew: get notifications that
     *  are newer than loaded ones
     *
     * Author: cmc
     *
     * Last Updated: January 27, 2022
     * @param param0 state variables
     */
    notificationsFetchNew (
      { commit, dispatch, state, getters }: {
        commit: Function,
        dispatch: Function,
        state: { notifications: any[] },
        getters: { userId: number }
      }) {
      if (!state.notifications) {
        dispatch('notificationsFetchInitial')
      } else {
        http.get('notifications', {
          params: {
            filter: {
              where: {
                userId: getters.userId,
                time: { gt: state.notifications[0].time }
              }
            }
          }
        })
          .then(resp => {
            resp.data.forEach((elem: object) => {
              commit('notificationsAppend', elem)
            })
          })
          .catch(err => console.error(err))
        commit('notificationsSort')
      }
    },

    /**
     * Function notificationsUpdateRead: update read property for all notifications
     *
     * Author: cmc
     *
     * Last Updated: January 27, 2022
     * @param state state variables
     */
    notificationsUpdateRead ({ state }: {
      state: {
        notifications: [{
          noteId: string,
          read: boolean
        }]
      }
    }) {
      const requests = []
      state.notifications.forEach((elem: {
        noteId: string,
        read: boolean
      }) => {
        requests.push(
          http.patch(
            `notifications/${elem.noteId}`,
            { read: elem.read }
          )
        )
      })
      http.all(requests)
        .catch(err => console.error(err))
    }
  }
}

/**
 * Filename: message.ts
 * Use: Wrap all methods regarding notifications
 * Creator: cmc
 * Date: May 26, 2021
 * Dependencies:
 *  axios,
 *  @/misc/roles
 */

import http from 'axios'
// import roles from '../../misc/roles';

export default {
  state: {
    messages: [],
    messagesLoaded: 0,
    unreadMessages: false,
    unreadMsgNo: 0
  },
  getters: {
    messages (state: { messages: Array<object>}) {
      return state.messages
    },

    unreadMessages (state: { unreadMessages: boolean}) {
      return state.unreadMessages
    },

    unreadMsgNo (state: { unreadMsgNo: number }) {
      return state.unreadMsgNo
    }
  },
  mutations: {
    /**
     * function allRead: mark all messages in state as read
     * Author: cmc
     * Last Updated: May 28, 2021
     * @param state state variables
     */
    allRead (state: {
      messages: Array<object>,
      unreadMessages: boolean,
      unreadMsgNo: number
    }) {
      state.messages.forEach((elem: {
       read: boolean
      }) => {
        elem.read = true
      })
      state.unreadMessages = false
      state.unreadMsgNo = 0
    },
    /**
     * function appendMsg: append message to state
     *  given it's not present yet
     *
     * Author: cmc
     *
     * Last Updated: January 27, 2022
     * @param state state property
     * @param msg the message object to append
     */
    appendMsg (
      state: {
        messages: Array<object>,
        unreadMessages: boolean,
        unreadMsgNo: number
      },
      msg: {
        noteId: string,
        read: boolean
      }) {
      // console.log('new message: ', msg)
      let present = false
      // check if message exists already
      state.messages.forEach((elem: { noteId: string }) => {
        if (elem.noteId === msg.noteId) {
          present = true
        }
      })
      if (!present) {
        state.messages.push(msg)
        if (!msg.read) {
          state.unreadMessages = true
          state.unreadMsgNo++
        }
      }
    },
    /**
     * function readNotification: mark message as read
     *
     * Author: cmc
     *
     * Last Updated: January 27, 2022
     * @param state state variable
     * @param msgId id of message to be marked as read
     */
    readNotification (
      state: {
        messages: Array<object>,
        unreadMessages: boolean,
        unreadMsgNo: number
      },
      msgId: string
    ) {
      state.messages.forEach((elem: { noteId: string, read: boolean }) => {
        if (elem.noteId === msgId) {
          if (!elem.read) {
            elem.read = true
            state.unreadMsgNo--
          }
          if (state.unreadMsgNo === 0) {
            state.unreadMessages = false
          }
        }
      })
    },

    /**
     * Function sortMessages: sort notifications from date in
     *  descending order
     *
     * Author: cmc
     *
     * Last Updated: January 27, 2022
     * @param state state variables
     */
    sortMessages (state: {
      messages: [
        { time: number }
      ]
    }) {
      state.messages.sort((a, b) => a.time - b.time)
    },

    /**
     * function updateLoaded: update the number of messages loaded
     *  in store
     *
     * Author: cmc
     *
     * Last Updated: January 27, 2022
     * @param state state variables
     * @param newNo new # of loaded messages
     */
    updateLoaded (
      state: { messagesLoaded: number },
      newNo: number
    ) {
      state.messagesLoaded += newNo
    }
  },
  actions: {

    /**
     * function getAdditionalMessages: get 10 more notifications
     *  for logged user
     *
     * Author: cmc
     *
     * Last Updated: January 27, 2022
     * @param param0 state property
     */
    getAdditionalMessages (
      { commit, state, rootState }: {
         commit: Function,
         state: {
           messagesLoaded: number
         },
         rootState: {
           auth: {
             userId: number
           }
         }
       }) {
      if (state.messagesLoaded < 10) {
        return new Promise((resolve, reject) => {
          reject(new Error('No more messages'))
        })
      }
      return new Promise((resolve, reject) => {
        http.get('notifications', {
          params: {
            filter: {
              skip: state.messagesLoaded,
              limit: 10, // TODO: use parameter to be flexible?
              order: 'time DESC',
              where: {
                userId: rootState.auth.userId
              }
            }
          }
        })
          .then(resp => {
            let no = 0
            resp.data.forEach((elem: object) => {
              commit('appendMsg', elem)
              no++
            })
            commit('updateLoaded', state.messagesLoaded + no)
            commit('sortMessages')
            resolve(resp)
          })
          .catch(err => reject(err))
      })
    },

    /**
     * function getAllMessages: get all notifications for logged user
     *
     * Author: cmc
     *
     * Last Updated: January 27, 2022
     * @param param0 state property
     */
    getAllMessages (
      { commit, rootState }: {
         commit: Function,
         rootState: {
           auth: {
             userId: number
           }
         }
       }) {
      http.get('notifications', {
        params: {
          filter: {
            order: 'time DESC',
            where: {
              userId: rootState.auth.userId
            }
          }
        }
      })
        .then(resp => {
          resp.data.forEach((elem: object) => {
            commit('appendMsg', elem)
          })
          commit('updateLoaded', resp.data.length)
          commit('sortMessages')
        })
        .catch(err => console.error(err))
    },

    /**
     * function getInitialMessages: get notifications for logged user
     *
     * Author: cmc
     *
     * Last Updated: January 27, 2022
     * @param param0 state property
     */
    getInitialMessages (
      { commit, state, rootState }: {
        commit: Function,
        state: {
          messages: Array<any>
        },
        rootState: {
          auth: {
            userId: number
          }
        }
      }) {
      if (state.messages.length === 0) {
        http.get('notifications', {
          params: {
            filter: {
              limit: 10, // TODO: user parameter?
              order: 'time DESC',
              where: {
                userId: rootState.auth.userId
              }
            }
          }
        })
          .then(resp => {
            let no = 0

            resp.data.forEach((elem: object) => {
              commit('appendMsg', elem)
              no++
            })
            commit('updateLoaded', no)
          })
          .catch(err => console.error(err))
      }
    },

    /**
     * Function getNewMessages: get messages that
     *  are newer than loaded ones
     *
     * Author: cmc
     *
     * Last Updated: January 27, 2022
     * @param param0 state variables
     */
    getNewMessages (
      { commit, state, rootState }: {
        commit: Function,
        state: {
          messages: Array<any>
        },
        rootState: {
          auth: {
            userId: number
          }
        }
      }) {
      if (!state.messages) {
        commit('getInitialMessages')
      } else {
        http.get('notifications', {
          params: {
            filter: {
              where: {
                userId: rootState.auth.userId,
                time: { gt: state.messages[0].time }
              }
            }
          }
        })
          .then(resp => {
            let no = 0
            resp.data.forEach((elem: object) => {
              commit('appendMsg', elem)
              no++
            })
            commit('updateLoaded', no)
          })
          .catch(err => console.error(err))
        commit('sortMessages')
      }
    },

    /**
     * Function updateReadProp: update read property for all notifications
     *
     * Author: cmc
     *
     * Last Updated: January 27, 2022
     * @param state state variables
     */
    updateReadProp ({ state }: {
      state: {
        messages: [{
          noteId: string,
          read: boolean
        }]
      }
    }) {
      const requests = []
      state.messages.forEach((elem: {
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

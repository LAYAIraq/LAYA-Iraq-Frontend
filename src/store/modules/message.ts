/**
 * Filename: message.ts
 * Use: Wrap all methods regarding notifications
 * Creator: cmc
 * Date: May 26, 2021
 * Dependencies: 
 *  axios,
 *  @/misc/roles
 */

import http from 'axios';
import roles from '../../misc/roles';

export default {
  state: {
    messages: [],
    messagesLoaded: 0,
    unreadMessages: false,
    unreadMsgNo: 0
  },
  getters: {
    messages(state: { messages: Array<object>}) {
      return state.messages
    },

    unreadMessages(state: { unreadMessages: boolean}) {
      return state.unreadMessages
    },

    unreadMsgNo(state: { unreadMsgNo: number }) {
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
    allRead(state: { 
      messages: Array<object>,
      unreadMessages: boolean,
      unreadMsgNo: number
    }) {
      state.messages.forEach((elem: { 
        data: { read: boolean }
      }) => {
        elem.data.read = true
      })
      state.unreadMessages = false
      state.unreadMsgNo = 0
    },
    /**
     * function appendMsg: append message to state 
     *  given it's not present yet
     * Author: cmc
     * Last Updated: May 26, 2021
     * @param state state property
     * @param msg the message object to append
     */
    appendMsg(state: { 
      messages: Array<object>, 
      unreadMessages: boolean,
      unreadMsgNo: number
      },
      msg: { noteId: string, data: { read: boolean } }) {
      let present = false
      // check if message exists already
      state.messages.forEach((elem: { noteId: string }) => {
        if (elem.noteId === msg.noteId) {
          present = true
        }
      })
      if(!present)
        {
          // message has been loaded to store before
          if (Object.prototype.hasOwnProperty.call(msg.data, 'read')) {
            state.messages.push(msg)
            if (!msg.data.read) {
              state.unreadMessages = true
              state.unreadMsgNo++
            }
          }
          // first time store handles message,
          // add 'read' boolean
          else {
            const newData = {
              ...msg.data,
              read: false
            }
            const newMsg = {
              ...msg,
              data: newData
            }
            state.messages.push(newMsg)
            state.unreadMessages = true
            state.unreadMsgNo++
          }
          
        }
    },
    /**
     * function readNotification: mark message as read
     * Author: cmc 
     * Last Updated: May 27, 2021
     * @param state state variable
     * @param msgId id of message to be marked as read
     */
    readNotification(state: { 
      messages: Array<object>,
      unreadMessages: boolean,
      unreadMsgNo: number 
    }, 
      msgId: string) {
      state.messages.forEach((elem: { noteId: string, data: { read: boolean } }) => {
        if(elem.noteId === msgId) {
          if (!elem.data.read) {
            elem.data.read = true
            state.unreadMsgNo--
          }
          if (state.unreadMsgNo === 0) {
            state.unreadMessages = false
          }
        }
      })
    },
    updateLoaded(state: { loadedMessages: number }, newNo: number) {
      state.loadedMessages = newNo
    }
  },
  actions: {

    /**
     * function getAdditionalMessages: get 10 more notifications 
     *  for logged user
     * Author: cmc
     * Last Updated: June 10, 2021
     * @param param0 state property 
     */
     getAdditionalMessages({ commit, state, rootState }) {
      if (state.loadedMessages < 10) {
        return new Promise((resolve, reject) => {
          reject('No more messages')
        })
      }
      return new Promise((resolve, reject) => { 
        http.get('notifications', { 
          params: {
            filter: {
              skip: state.loadedMessages,
              limit: 10,
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
          resolve(resp)
          commit('updateLoaded', state.loadedMessages + no)
        })
        .catch(err => reject(err))
      })
    },

    /**
     * function getInitialMessages: get notifications for logged user
     * Author: cmc
     * Last Updated: June 10, 2021
     * @param param0 state property 
     */
    getInitialMessages({ commit, state, rootState }) {
      http.get('notifications', { 
        params: {
          filter: {
            limit: 10,
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
    },

    /**
     * Function updateNoteData: updata data property for all notifications
     * Author: cmc
     * Last Updated: June 10, 2021
     * @param state state variables 
     */
    updateNoteData({ state }) {
        const requests = []
        state.messages.forEach((elem: { 
          noteId: string, 
          data: {
            read: boolean
          } }) => {
          const dataWrapper = {
            data: {
              read: elem.data.read
            }
          }
          requests.push(
            http.patch(`notifications/${elem.noteId}`, dataWrapper)
          )
        })
        http.all(requests)
          .catch(err => console.error(err))
      }
  } 
}

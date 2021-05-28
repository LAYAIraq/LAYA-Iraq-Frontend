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
    unreadMessages: false,
    unreadMsgNo: 0
  },
  getters: {
    /** 
     * messages: return messages property
     * Author: cmc
     * Last Updated: May 27, 2021
    */
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
          if (msg.data.hasOwnProperty('read')) {
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
    readNotification(state: { messages: Array<object> }, 
      msgId: string) {
      state.messages.forEach((elem: { noteId: string, data: { read: boolean } }) => {
        if(elem.noteId === msgId) {
          elem.data.read = true
        }
      })
    }
  },
  actions: {

    /**
     * function getNewMessages: get notifications for logged user
     * Author: cmc
     * Last Updated: May 26, 2021
     * @param param0 state property 
     */
    getNewMessages({ commit, state, rootState }) {
      http.get('notifications', { 
        params: {
          filter: {
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
      })
      .catch(err => console.error(err))
    }
  } 
}

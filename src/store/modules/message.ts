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
    messages: []
  },
  getters: {

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
      msgIds: Array<string>
      },
      msg: { noteId: string, data: object }) {
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

/**
 * Filename: profile.ts
 * Use: settings for logged users
 * Creator: core
 * Date: unknown
 * Dependencies: axios
 */

import http from 'axios';
import { ids as supportedLangs } from '../../misc/langs.js';

export default {
  state: {
    name: '',
    email: '',
    prefs: {
      media: {
        text: true,
        simple: false,
        video: true,
        audio: false,
      },
      font: {
        chosen: 'standard',
        size: 18
      }
    },
    lang: 'de',
    avatar: '',
  },
  getters: {

    /**
     * Functions fontOptions: return fontOptions for logged users
     *
     * Author: cmc
     *
     * Last Updated: September 23, 2021
     * @param state preferences as object
     * @returns {object} fontOptions
     */
    fontOptions(state: { prefs: { font: object } }) {
      return state.prefs.font
    },

    /**
     * function mediaPrefs: return user's preferred media
     *
     * Author: cmc
     *
     * Last Updated: October 26, 2021
     *
     */
    mediaPrefs(state: { prefs: { media: object } }) {
      return state.prefs.media
    },

    /**
     * Function profileLang: get stored language
     * 
     * Author: cmc
     * 
     * Last Updated: unknown
     * 
     * @param state contains lang
     * @returns current user locale
     */
    profileLang(state: { lang: string }) {
      return state.lang
    }
  },
  mutations: {

    /**
     * function setLang: set user locale to given language if supported
     * 
     * Author: core
     * 
     * Last Updated: unknown 
     * 
     * @param state contains lang
     * @param lang language to set 
     */
    setLang(state: { lang: string }, lang: string) {
      state.lang = (supportedLangs.includes(lang)) ? lang : supportedLangs[0];
    },

    /**
     * Function setMedia: set input media boolean
     * 
     * Author: cmc
     * 
     * Last Updated: May 24, 2021
     * 
     * @param state: contains user preferences
     * @param type: one of 'audio', 'simple', 'text' and 'video'
     * @param value: boolean
     * 
     */
    setMedia(state: { prefs: { media: object } }, 
        { type, value }) {
      state.prefs.media[type] = value
    },

    /**
     * Function toggleMedia: toggle input media boolean
     * 
     * Author: core
     * 
     * Last Updated: unknown
     * 
     * @param state: contains user preferences
     * @param type: one of 'audio', 'simple', 'text' and 'video'
     * 
     */
    toggleMedia(state: { prefs: { media: object } }, 
        type: string) {
      state.prefs.media[type] = !state.prefs.media[type];
    },

    /**
     * Function setPrefs: set all media preferences at once
     * 
     * Author: core
     * 
     * Last Updated: unknown
     * 
     * @param state contains preferences
     * @param media: object containing all possible options 
     */
    setPrefs(state: { prefs: object },
        prefs: object) {
      state.prefs = { ...prefs }
    },

    /**
     * Function setProfile: set state with given input values
     * 
     * Author: core
     * 
     * Last Updated: March 20, 2021
     * 
     * @param state contains all profile information
     * @param settings contains the same key-value pairs to set 
     */
    setProfile(
      state: {
        name: string,
        email: string,
        prefs: object,
        lang: string,
        avatar: string
      }, 
      settings: {
        username: string,
        email: string,
        prefs: object,
        lang: string,
        avatar: string
      }) {
      
      state.name = settings.username
      state.email = settings.email
      state.avatar = settings.avatar
      state.lang = settings.lang
      state.prefs = settings.prefs
    },

    /**
     * function setUserLang: persist locale to backend
     * 
     * Author: cmc
     * 
     * Last Updated: unknown 
     * 
     * @param state contains lang
     * @param data contains user language and id
     */
     setUserLang(state: { lang: string }, 
      data: { lang: string, uid: number }) { 
      //save language choice in User's profile
      if (supportedLangs.includes(data.lang)) {
        state.lang = data.lang
        http.post(`/accounts/${data.uid}/change-language`, data)
          // .then( () => console.log(`Changed language to ${state.lang}`))
          .catch((err) => console.error(err))
      }
      else {
        // console.log('Setting language failed')
        state.lang = supportedLangs[0]
      }
    },

    
  },
  actions: {

    /**
     * Function fetchProfile: get user settings and set them in store
     * 
     * Author: core
     * 
     * Last Updated: unknown 
     * 
     * @param param0 state variables
     */
    fetchProfile({ commit, state, rootState }) {
      http.get(`accounts/${rootState.auth.userId}`)
        .then(({ data }) => {
          commit('setProfile', data)
        })
        .catch((err) => console.error(err));
    },

    /**
     * Function saveProfile: save profile settings in database
     * 
     * Author: cmc
     * 
     * Last Updated: March 24, 2021
     * 
     * @param param0 state variables
     */
    saveProfile({commit, state, rootState}) {
      http.patch(`accounts/${rootState.auth.userId}`, { 
          ...state, 
          prefs: {
            media: {
              ...state.prefs.media
            },
            font: {
              ...state.prefs.font
            }
          }
        })
        .catch(err => {
          console.error(err)
        })
    }

  }
}

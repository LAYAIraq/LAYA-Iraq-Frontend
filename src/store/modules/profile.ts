/**
 * Filename: profile.ts
 * Use: settings for logged users
 * Creator: core
 * Date: unknown
 * Dependencies: axios
 */

import http from 'axios'
import { ids as supportedLangs } from '../../misc/langs.js'

export default {
  state: {
    avatar: '',
    email: '',
    lang: 'en',
    prefs: {
      font: {
        chosen: 'standard',
        size: 18
      },
      media: {
        audio: false,
        simple: false,
        text: true,
        video: true
      }
    },
    username: '',
    usernameSet: '',
    emailSet: ''
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
    fontOptions (state: {
      prefs: {
        font: object
      }
    }) {
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
    mediaPrefs (state: {
      prefs: {
        media: object
      }
    }) {
      return state.prefs.media
    },

    /**
     * function profile: make whole state available via getter
     *
     * Author: cmc
     *
     * Last Updated: March 18, 2022
     * @param {object} state all state variables in module
     */
    profile (state: object) {
      return state
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
    profileLang (state: { lang: string }) {
      return state.lang
    },
    /**
     * Function usernameSet: return usernameSet
     *
     * Author: nv
     *
     * Last Updated: November 26, 2022
     *
     * @param0 contains usernameSet string
     * @returns username to set
     */
    usernameSet (state: { usernameSet: string }) {
      return state.usernameSet
    },
    /**
     * Function emailSet: return emailSet
     *
     * Author: nv
     *
     * Last Updated: November 26, 2022
     *
     * @param0 contains emailSet string
     * @returns email to set
     */
    emailSet (state: { emailSet: string }) {
      return state.emailSet
    }
  },
  mutations: {

    /**
     * function setLang: set user locale to given language if supported
     *
     * Author: core
     *
     * Last Updated: January 27, 2022
     *
     * @param state contains lang
     * @param lang language to set
     */
    setLang (
      state: { lang: string },
      lang: string
    ) {
      state.lang = (supportedLangs.includes(lang)) ? lang : supportedLangs[0]
    },

    /**
     * Function setMedia: set input media boolean
     *
     * Author: cmc
     *
     * Last Updated: January 27, 2022
     *
     * @param state: contains user preferences
     * @param type: one of 'audio', 'simple', 'text' and 'video'
     * @param value: boolean
     *
     */
    setMedia (
      state: {
        prefs: {
          media: object
        }
      },
      { type, value }: {
        type: string,
        value: boolean
      }) {
      state.prefs.media[type] = value
    },

    /**
     * Function setPrefs: set all media preferences at once
     *
     * Author: core
     *
     * Last Updated: January 27, 2022
     *
     * @param state contains preferences
     * @param prefs: object containing some options
     */
    setPrefs (
      state: { prefs: object },
      prefs: object
    ) {
      state.prefs = {
        ...state.prefs,
        ...prefs
      }
    },

    /**
     * Function setInstitution: set institution
     *
     * Author: nv
     *
     * Last Updated: November 26, 2022
     *
     * @param state contains institution
     * @param institution: string containing institution
     */
    setInstitution (
      state: { institution: object },
      institution: string
    ) {
      state.institution = {
        institution
      }
    },
    /**
     * Function setOccupation: set occupation
     *
     * Author: nv
     *
     * Last Updated: November 26, 2022
     *
     * @param state contains occupation
     * @param occupation: string containing occuptation
     */
    setOccupation (
      state: { occupation: object },
      occupation: string
    ) {
      state.occupation = {
        occupation
      }
    },

    /**
     * Function setProfile: set state with given input values
     *
     * Author: core
     *
     * Last Updated: January 27, 2022
     *
     * @param state contains all profile information
     * @param settings contains the same key-value pairs to set
     */
    setProfile (
      state: {
        username: string,
        email: string,
        institution: string,
        occupation: string,
        prefs: object,
        lang: string,
        avatar: string
      },
      settings: {
        username: string,
        email: string,
        institution: string,
        occupation: string,
        prefs: object,
        lang: string,
        avatar: string
      }) {
      for (const setting in settings) {
        state[setting] = settings[setting]
      }
    },

    /**
     * Function toggleMedia: toggle input media boolean
     *
     * Author: core
     *
     * Last Updated: January 27, 2022
     *
     * @param state: contains user preferences
     * @param type: one of 'audio', 'simple', 'text' and 'video'
     *
     */
    toggleMedia (
      state: {
        prefs: {
          media: object
        }
      },
      type: string
    ) {
      state.prefs.media[type] = !state.prefs.media[type]
    }

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
    fetchProfile ({ commit, rootState }) {
      http.get(`accounts/${rootState.auth.userId}`)
        .then(({ data }) => {
          commit('setProfile', data)
        })
        .catch((err) => console.error(err))
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
    saveProfile ({ state, rootState }) {
      http.patch(
        `accounts/${rootState.auth.userId}`,
        { ...state })
        .catch(err => {
          console.error(err)
        })
    },

    /**
     * function setUserLang: persist locale to backend
     *
     * Author: cmc
     *
     * Last Updated: January 27, 2022
     *
     * @param param0 contains state variables
     * @param langData contains user language and id
     */
    setUserLang (
      { commit, state },
      langData: {
        lang: string,
        uid: number
      }
    ) {
      // save language choice in User's profile
      http.post(
        `/accounts/${langData.uid}/change-language`,
        langData
      )
        .then(() => {
          commit('setLang', langData.lang)
        })
        .catch((err) => console.error(err))
    },

    /**
     * function changeEmail: fire change-email request
     *
     * Author: nv
     *
     * Last Updated: November 26, 2022
     * @param state contains emailSet
     * @param {string} oldEmail old email for user
     */
    changeEmail ({ state }, oldEmail: string) {
      return new Promise((resolve, reject) => {
        http
          .post('accounts/change-email', {
            oldEmail: oldEmail,
            newEmail: state.EmailSet
          })
          .then(() => {
            resolve(null)
          })
          .catch(err => {
            reject(err)
          })
      })
    },

    /**
     * function changeUsername: fire change-username request
     *
     * Author: nv
     *
     * Last Updated: November 26, 2022
     * @param state contains usernameSet
     * @param {string} oldUsername old username for user
     */
    changeUsername ({ state }, oldUsername: string) {
      return new Promise((resolve, reject) => {
        http
          .post('accounts/change-username', {
            oldUsername: oldUsername,
            newUsername: state.usernameSet
          })
          .then(() => {
            resolve(null)
          })
          .catch(err => {
            reject(err)
          })
      })
    }
  }
}

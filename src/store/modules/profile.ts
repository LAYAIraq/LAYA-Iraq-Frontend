/**
 * Filename: profile.ts
 * Use: settings for logged users
 * Creator: core
 * Since: v1.0.0
 */

import http from 'axios'
import { ids as supportedLangs } from '@/options/langs.js'

export default {
  state: {
    avatar: '',
    email: '',
    language: 'en',
    preferencesFont: {
      chosen: 'standard',
      size: 18
    },
    preferencesMedia: {
      audio: false,
      simple: false,
      text: true,
      video: true
    },
    username: ''
  },
  getters: {
    preferencesFont: (state: { preferencesFont: object }) => state.preferencesFont,
    preferencesMedia: (state: { preferencesMedia: object }) => state.preferencesMedia,
    profile: (state: object) => state,
    profileLanguage: (state: { language: string }) => state.language
  },
  mutations: {

    /**
     * function languageSet: set user locale to given language if supported
     *
     * Author: core
     *
     * Last Updated: January 27, 2022
     *
     * @param state contains language
     * @param lang language to set
     */
    languageSet (
      state: { language: string },
      lang: string
    ) {
      state.language = (supportedLangs.includes(lang)) ? lang : supportedLangs[0]
    },

    /**
     * Function preferencesMediaSet: set input media boolean
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
    preferencesMediaSet (
      state: { preferencesMedia: object },
      { type, value }: {
        type: string,
        value: boolean
      }) {
      state.preferencesMedia[type] = value
    }, // TODO: continue here

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
      http.get(`accounts/${rootState.authentication.userId}`)
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
        `accounts/${rootState.authentication.userId}`,
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
          commit('languageSet', langData.lang)
        })
        .catch((err) => console.error(err))
    }
  }
}

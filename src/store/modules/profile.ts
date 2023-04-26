/**
 * Filename: profile.ts
 * Use: settings for logged users
 * Creator: core
 * Since: v1.0.0
 */

import http from 'axios'
import { ids as supportedLangs } from '@/options/langs.js'
import { stripKey } from '@/mixins/general/helpers'

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
     * Function emailSet: set email address
     *
     * Author: nv
     *
     * Last Updated: February 13, 2023
     *
     * @param state contains occupation
     * @param email: string containing occuptation
     */
    emailSet (
      state: { email: string },
      email: string
    ) {
      state.email = email
    },
    /**
     * Function fullNameSet: set full name
     *
     * Author: nv
     *
     * Last Updated: February 06, 2023
     *
     * @param state contains occupation
     * @param fullName: string containing occuptation
     */
    fullNameSet (
      state: { fullName: string },
      fullName: string
    ) {
      state.fullName = fullName
    },
    /**
     * Function institutionSet: set institution
     *
     * Author: nv
     *
     * Last Updated: February 06, 2023
     *
     * @param state contains institution
     * @param institution: string containing institution
     */
    institutionSet (
      state: { institution: string },
      institution: string
    ) {
      state.institution = institution
    },
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
     * Function occupationSet: set occupation
     *
     * Author: nv
     *
     * Last Updated: February 06, 2023
     *
     * @param state contains occupation
     * @param occupation: string containing occuptation
     */
    occupationSet (
      state: { occupation: string },
      occupation: string
    ) {
      state.occupation = occupation
    },
    /**
     * Function preferencesSet: set all media preferences at once
     *
     * Author: core
     *
     * Last Updated: January 27, 2022
     *
     * @param state contains preferences
     * @param prefs: object containing some options
     */
    preferencesSet (
      state: {
        preferencesFont: object,
        preferencesMedia: object
      },
      prefs: { font: object, media: object }
    ) {
      state.preferencesFont = {
        ...state.preferencesFont,
        ...prefs.font
      }
      state.preferencesMedia = {
        ...state.preferencesMedia,
        ...prefs.media
      }
    },

    /**
     * Function profileSet: set state with given input values
     *
     * Author: core
     *
     * Last Updated: January 27, 2022
     *
     * @param state contains all profile information
     * @param settings contains the same key-value pairs to set
     */
    profileSet (
      state: {
        username: string,
        email: string,
        preferencesFont: object,
        preferencesMedia: object,
        lang: string,
        avatar: string
      },
      settings: {
        username: string,
        email: string,
        prefs: {
          font: object,
          media: object
        },
        lang: string,
        avatar: string
      }) {
      state = { ...stripKey('prefs', settings) } // set state with all keys except prefs
      state.preferencesFont = settings.prefs.font
      state.preferencesMedia = settings.prefs.media
    },
    /**
     * Function usernameSet: set username
     *
     * Author: nv
     *
     * Last Updated: February 06, 2023
     *
     * @param state contains occupation
     * @param username: string containing occuptation
     */
    usernameSet (
      state: { username: string },
      username: string
    ) {
      state.username = username
    }
  },
  actions: {
    /**
     * Function profileFetch: get user settings and set them in store
     *
     * Author: core
     *
     * Last Updated: unknown
     *
     * @param param0 state variables
     */
    profileFetch ({ commit, rootState }) {
      http.get(`accounts/${rootState.authentication.userId}`)
        .then(({ data }) => {
          commit('profileSet', data)
        })
        .catch((err) => console.error(err))
    },

    /**
     * Function profileUpdate: save profile settings in database
     *
     * Author: cmc
     *
     * Last Updated: March 24, 2021
     *
     * @param param0 state variables
     */
    profileUpdate ({ state, rootState }) {
      http.patch(
        `accounts/${rootState.authentication.userId}`,
        { ...state })
        .catch(err => {
          console.error(err)
        })
    },

    /**
     * function profileUpdateLanguage: persist locale to backend
     *
     * Author: cmc
     *
     * Last Updated: January 27, 2022
     *
     * @param param0 contains state variables
     * @param langData contains user language and id
     */
    profileUpdateLanguage (
      { commit, state },
      langData: {
        lang: string,
        uid: number
      }
    ) {
      // save language choice in User's profile
      http.post( // TODO figure out if endpoint is needed
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

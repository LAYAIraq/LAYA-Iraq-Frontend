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
    phone: '',
    fullName: '',
    institution: '',
    language: 'en',
    occupation: '',
    preferencesFont: {
      chosen: 'standard',
      size: 18
    },
    preferencesLanguages: {
      english: true,
      german: false,
      arabic: false,
      kurdish: false
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
    fullName: (state: { fullName: string}) => state.fullName,
    institution: (state: { institution: string }) => state.institution,
    occupation: (state: { occupation: string }) => state.occupation,
    preferencesFont: (state: { preferencesFont: object }) => state.preferencesFont,
    preferencesLanguages: (state: { preferencesLanguages: object }) => state.preferencesLanguages,
    preferencesMedia: (state: { preferencesMedia: object }) => state.preferencesMedia,
    prefs: (state) => {
      return {
        media: state.preferencesMedia,
        font: state.preferencesFont,
        languages: state.preferencesLanguages
      }
    },
    profile: (state: object) => state,
    profileLanguage: (state: { language: string }) => state.language
  },
  mutations: {
    /**
     * Function avatarSet: set avatar source address
     *
     * Author: nv
     *
     * Since: v1.3.0
     *
     * @param state contains avatar
     * @param avatar string containing avatar
     */
    avatarSet (
      state: { avatar: string },
      avatar: string
    ) {
      state.avatar = avatar
    },
    /**
     * Function emailSet: set email address
     *
     * Author: nv
     *
     * Last Updated: February 13, 2023
     *
     * @param state contains occupation
     * @param email string containing occuptation
     */
    emailSet (
      state: { email: string },
      email: string
    ) {
      state.email = email.toLowerCase()
    },
    /**
     * Function phoneSet: set phone number
     *
     * Author: nv
     *Since: v1.3.0
     */
    phoneSet (
      state: { phone: string },
      phone: string
    ) {
      state.phone = phone
    },
    /**
     * Function fullNameSet: set full name
     *
     * Author: nv
     *
     * Last Updated: February 06, 2023
     *
     * @param state contains occupation
     * @param fullName string containing occuptation
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
     * @param institution string containing institution
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
     * @param occupation string containing occuptation
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
     * @param prefs object containing some options
     */
    preferencesSet (
      state: {
        preferencesFont: object,
        preferencesLanguages: object,
        preferencesMedia: object
      },
      prefs: { font: object, language: object, media: object }
    ) {
      state.preferencesFont = {
        ...state.preferencesFont,
        ...prefs.font
      }
      state.preferencesLanguages = {
        ...state.preferencesLanguages,
        ...prefs.language
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
        phone: string,
        language: string,
        avatar: string,
        occupation: string,
        institution: string,
        fullName: string
      },
      settings: {
        username: string,
        email: string,
        phone: string,
        language: string,
        avatar: string,
        occupation: string,
        institution: string,
        fullName: string
      }) {
      Object.keys(settings).forEach(key => {
        state[key] = settings[key]
      })
    },
    /**
     * Function usernameSet: set username
     *
     * Author: nv
     *
     * Last Updated: February 06, 2023
     *
     * @param state contains occupation
     * @param username string containing occuptation
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
    profileFetch ({ commit, getters }) {
      http.get(`accounts/${getters.userId}`)
        .then(({ data }) => {
          commit('profileSet', stripKey('prefs', data))
          commit('preferencesSet', data.prefs)
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
    profileUpdate ({ getters, state, rootState }) {
      console.log(state)
      http.patch(
        `accounts/${rootState.authentication.userId}`,
        {
          avatar: state.avatar,
          fullName: state.fullName,
          email: state.email.toLowerCase(),
          phone: state.phone,
          username: state.username,
          institution: state.institution,
          occupation: state.occupation,
          prefs: getters.prefs
        })
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

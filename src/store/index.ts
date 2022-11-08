/**
 * Filename: index.ts
 * Use: make store available to be used in app
 * Creator: core
 * Date: unknown
 * Dependencies:
 *  vue,
 *  vuex
 */

import Vue from 'vue'
import Vuex from 'vuex'

/* modules */
import auth from './modules/auth'
import courseContent from './modules/course-content'
import edit from './modules/edit'
import editor from './modules/editor'
import enrollment from './modules/enrollment'
import flags from './modules/flags'
import message from './modules/message'
import note from './modules/note'
import password from './modules/password'
import profile from './modules/profile'
import users from './modules/users'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'
if (debug) console.log('vuex in debug mode')

export default new Vuex.Store({
  modules: {
    auth,
    courseContent,
    edit,
    editor,
    enrollment,
    flags,
    message,
    note,
    password,
    profile,
    users
  },
  strict: debug
})

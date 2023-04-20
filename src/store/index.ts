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
import applications from './modules/applications'
import authentication from './modules/authentication'
import course from './modules/course'
import courseContent from './modules/course-content'
import courseEdit from './modules/course-edit'
import courseFiles from './modules/course-files'
import courseList from './modules/course-list'
import enrollment from './modules/enrollment'
import flags from './modules/flags'
import message from './modules/notifications'
import note from './modules/note'
import password from './modules/password'
import profile from './modules/profile'
import register from './modules/register'
import role from './modules/role'
import users from './modules/users'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'
if (debug) console.log('vuex in debug mode')

export default new Vuex.Store({
  modules: {
    applications,
    authentication,
    course,
    // @ts-ignore
    courseContent,
    courseEdit,
    courseFiles,
    courseList,
    enrollment,
    flags,
    message,
    note,
    password,
    profile,
    register,
    role,
    users
  },
  strict: debug
})

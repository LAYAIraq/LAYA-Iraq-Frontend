/**
 * Filename: backend-url.ts
 * Use: set backend URL
 * Creator: cmc
 * Date: December 29, 2021
 */

require('dotenv').config()
const {
  NODE_ENV,
  VUE_APP_BACKEND_HOST,
  VUE_APP_BACKEND_PORT,
  VUE_APP_BACKEND_ROOT
} = process.env
const base = 'http://localhost:3001/api'
let url
if (NODE_ENV === 'development') {
  // set port if defined in env, default if not
  url = VUE_APP_BACKEND_PORT
    ? `http://localhost:${VUE_APP_BACKEND_PORT}/api`
    : base
} else if (NODE_ENV === 'production') {
  // set host if set in environment
  const host = VUE_APP_BACKEND_HOST
    ? (VUE_APP_BACKEND_PORT // append port if set
        ? `${VUE_APP_BACKEND_HOST}:${VUE_APP_BACKEND_PORT}`
        : VUE_APP_BACKEND_HOST)
    : ''
  // set root dir if defined, default to '/api' if not
  const root = VUE_APP_BACKEND_ROOT || '/api'
  url = host + root
} else {
  // console.log('unexpected enviroment, defaulting API address')
  url = base
}
// const url = `http://localhost:${process.env.VUE_APP_BACKEND_PORT}${process.env.VUE_APP_BACKEND_ROOT}`
// console.log(url)
export default url

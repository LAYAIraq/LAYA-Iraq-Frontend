/**
 * Filename: backend-url.ts
 * Use: set backend URL
 * Creator: cmc
 * Since: v1.0.0
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
if (NODE_ENV === 'development') { // for dev server (aka npm run serve)
  // set port if defined in env, default if not
  url = VUE_APP_BACKEND_PORT
    ? `http://localhost:${VUE_APP_BACKEND_PORT}/api` // use port if defined
    : base
} else if (NODE_ENV === 'production') {
  // set host if set in environment
  const host = VUE_APP_BACKEND_HOST // is host set?
    ? (VUE_APP_BACKEND_PORT // is port set?
        ? `${VUE_APP_BACKEND_HOST}:${VUE_APP_BACKEND_PORT}` // 'host:port'
        : VUE_APP_BACKEND_HOST) // 'host' if no port specified
    : '' // empty string if no host specified
  const endpoint = VUE_APP_BACKEND_ROOT || '/api' // set base endpoint, default to '/api' if not
  url = host + endpoint // concatenate host and endpoint
} else { // fallback if NODE_ENV is not development or production
  url = base
}
export default url

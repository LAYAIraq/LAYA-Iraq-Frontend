/**
 * Filename: backend-url.ts
 * Use: expose loopback API
 * Creator: core
 * Date: unknown
 */

export default /localhost/.test(location.host) ?
  "http://localhost:3001/api" : "/api"

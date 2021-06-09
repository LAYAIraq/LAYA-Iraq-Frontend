import http from 'axios'
export default {
  randTimeStamp = () => {
    const timeBack = 94608000
    return Date.now() - Math.trunc(Math.random() * timeBack)
  }
  
  
}

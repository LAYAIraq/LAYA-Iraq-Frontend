import http from 'axios'
import noteTypes from './notification-types'
import { v4 as uuidv4 } from 'uuid'
export default {
  randTimeStamp() {
    const timeBack = 94608000
    return Date.now() - Math.trunc(Math.random() * timeBack)
  },



  randomNotifications() {
    console.log(noteTypes)
    const creatorNotes = noteTypes.filter(val => /author/.test(val))
    let no = Math.trunc(Math.random() * 100)


    for (let i = 0; i < no ; i++) {
      let rdIdx = Math.trunc(Math.random() * 4)
      const noteType = creatorNotes[rdIdx]
      console.log(noteType)
      const newNote = {
        noteId: uuidv4(),
        time: this.randTimeStamp(),
        data: {
          read: false
        },
        type: noteType,
        userId: 1
      }
      http.post('notifications', newNote)
        .then(resp => console.log(resp))
        .catch(err => console.error(err))
    }
  }
  
  
}

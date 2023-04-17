/**
 * Filename: plugin-data-populate.ts
 * Use: Mixin to populate plugin data on create
 * Creator: cmc
 * Since: v1.3.0
 */
import { v4 as uuidv4 } from 'uuid'
export default {
  methods: {
    taskTitlePopulate () {
      this.title = {
        text: '',
        id: uuidv4(),
        flagged: false
      }
      this.task = {
        text: '',
        id: uuidv4(),
        flagged: false
      }
    }
  }
}

/**
 * Filename: plugin-edit.ts
 * Use: Mixin to populate plugin data on create, and inject properties for plugin edit component
 * Creator: cmc
 * Since: v1.3.0
 */
import { v4 as uuidv4 } from 'uuid'
export default {
  props: {
    edit: {
      type: Boolean,
      required: true
    }
  },
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

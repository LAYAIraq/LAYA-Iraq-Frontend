/**
 * @file This file contains all emits for course-nav component and its children
 * @author cmc
 * @since v1.3.0
 */
export default {
  methods: {
    previewEmit (id: string) {
      this.$emit('preview', id)
    }
  }
}

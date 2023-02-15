<template>
  <div class="chapter-name">
    <span
      v-if="!edit"
      @click="edit = true"
    >{{ name }}</span>
    <form
      v-else
      @submit.prevent="changeChapterName"
    >
      <b-form-input
        v-model="newName"
        placeholder="Chapter name"
        required
        autofocus
        @blur="edit = false"
      />
    </form>
  </div>
</template>
<script>
export default {
  name: 'CourseNavChapterName',
  props: {
    name: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      edit: false,
      newName: ''
    }
  },
  computed: {
    id () {
      return this.$parent.id
    }
  },
  created () {
    this.newName = this.name
  },
  methods: {
    /**
     * @function switch edit prop for render, emit new name
     * @author cmc
     */
    changeChapterName () {
      this.edit = false
      this.$emit('changeChapterName', this.newName)
    }
  }
}
</script>
<style scoped>
.chapter-name {
  display: inline-block;
  width: 100%;
}
form {
  display: block;
}
</style>

<template>
  <div class="chapter-name">
    <div
      v-if="!edit"
      class="d-flex justify-content-between"
      @click="edit = true"
    >
      {{ courseChapterIdConvertToName(name) }}
      <i
        v-b-tooltip.top.ds500
        class="fas fa-edit"
        :class="langIsAr ? 'mr-auto' : 'ml-auto'"
        :title="y18n('courseWrapper.edit')"
      ></i>
    </div>
    <form
      v-else
      @submit.prevent="changeChapterName"
    >
      <b-form-input
        v-model="newName"
        class="p-1"
        placeholder="Chapter name"
        required
        autofocus
        @submit="edit = false"
      />
    </form>
  </div>
</template>
<script>
import { courseChapterIdConvertToName, courseChapterNameConvertToId } from '@/misc/course-navigation-utils'
import { locale } from '@/mixins'
export default {
  name: 'CourseNavChapterName',
  mixins: [locale],
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
    courseChapterIdConvertToName,
    /**
     * @function switch edit prop for render, emit new name
     * @author cmc
     */
    changeChapterName () {
      this.edit = false
      this.$emit('changeChapterName', courseChapterNameConvertToId(this.newName))
    }
  }
}
</script>
<style scoped>
.chapter-name {
  display: inline-block;
}
.chapter-name>div>i {
  display: none;
}
.chapter-name:hover>div>i {
  display: inline-flex;
}
form {
  display: block;
}
</style>

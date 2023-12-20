<!--
  Filename: content-task-edit.vue
  Use: task and simple task field for edit components
  Author: nv
  Since: v1.3.0
-->

<template>
  <form>
    <div class="form-group">
      <div class="row">
        <label
          for="task"
          class="col-2 col-form-label"
        >
          {{ y18n('task') }}
        </label>
        <div class="col-10">
          <textarea
            id="task"
            v-model="taskLocal.text"
            class="w-100"
            :placeholder="y18n('taskPlaceholder')"
          >
            </textarea>
        </div>
      </div>
      <!-- task simple -->
      <div
        v-if="courseSimple"
        class="row"
      >
        <label
          for="task-simple"
          class="col-2 col-form-label"
        >
          <span class="sr-only">
            {{ y18n('simpleAlt') }}
          </span>
        </label>
        <div class="col-10">
          <textarea
            id="task-simple"
            v-model="taskLocal.simple"
            class="w-100"
            :placeholder="y18n('simpleAlt')"
          >
            </textarea>
          <p
            v-if="missing"
            id="missing-simple-language"
          >
            {{ y18n('simpleAlt.missing') }}
          </p>
        </div>
      </div>
    </div>
  </form>
</template>

<script>
import { mapGetters } from 'vuex'
import { locale } from '@/mixins'
import { deepCopy } from '@/mixins/general/helpers'

export default {
  name: 'ContentTaskEdit',

  mixins: [
    locale
  ],

  props: {
    task: {
      type: Object,
      required: true
    }
  },

  data () {
    return {
      taskLocal: deepCopy(this.task)
    }
  },

  computed: {
    ...mapGetters(['courseSimple']),
    missing () {
      return !this.taskLocal.simple
    }
  },
  watch: {
    taskLocal: {
      handler () {
        this.taskSet()
      },
      deep: true
    }
  },

  methods: {
    taskSet () {
      this.$emit('set-task', this.taskLocal)
    }
  }
}

</script>

<template>
  <div class="property-edit">
    <div
      v-if="!edit"
      class="d-flex justify-content-between"
      @click="edit = true"
    >
      {{ propertyDisplay }}
      <i
        v-b-tooltip.top.ds500
        class="fas fa-edit"
        :class="langIsAr ? 'mr-auto' : 'ml-auto'"
        :title="y18n('courseWrapper.edit')"
      ></i>
    </div>
    <form
      v-else
      @submit.prevent="changeProperty"
    >
      <b-form-input
        v-model="newProperty"
        class="p-1"
        :placeholder="formPlaceholder"
        required
        autofocus
        @submit="edit = false"
      />
    </form>
  </div>
</template>
<script>
import { locale } from '@/mixins'
export default {
  name: 'CourseNavPropertyEdit',
  mixins: [locale],
  props: {
    callback: {
      type: Function,
      default: prop => prop
    },
    display: {
      type: Function,
      default: prop => prop
    },
    formPlaceholder: {
      type: String,
      default: () => 'Placeholder'
    },
    property: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      edit: false,
      newProperty: ''
    }
  },
  computed: {
    id () {
      return this.$parent.id
    },
    propertyDisplay () {
      return this.display(this.property)
    }
  },
  created () {
    this.newProperty = this.property
  },
  methods: {
    /**
     * @function switch edit, emit changed event with provided callback function
     * @author cmc
     */
    changeProperty () {
      this.edit = false
      this.$emit('changed', this.callback(this.newProperty))
    }
  }
}
</script>
<style scoped>
.property-edit {
  display: inline-block;
  cursor: auto;
}
.property-edit>div>i {
  display: none;
}
.property-edit:hover>div>i {
  display: inline-flex;
}
form {
  display: block;
}
</style>

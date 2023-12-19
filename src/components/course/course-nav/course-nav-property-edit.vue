<!--
  Filename: course-nav-property-edit.vue
  Use: Editable property for course nav item
  Author: cmc
  Since: v1.3.0
-->
<template>
  <div class="property-edit ml-1 mr-1">
    <div
      v-if="!edit"
      class="d-flex justify-content-between"
      @click="stateChange(true)"
    >
      {{ propertyDisplay }}
      <i
        v-b-tooltip.top.ds500
        class="fas fa-edit"
        :class="langIsAr ? 'mr-auto' : 'ml-auto'"
        :title="y18n('courseWrapper.edit')"
      ></i>
    </div>
    <b-form
      v-else
      class="form-row"
      @submit.prevent="changeProperty"
    >
      <b-form-input
        v-model="newProperty"
        :placeholder="formPlaceholder"
        required
        trim
        autofocus
      />
      <button
        v-b-tooltip.top
        class="btn btn-sm btn-primary"
        :title="y18n('cancel')"
      >
        <i class="fas fa-times-circle"></i>
      </button>
      <b-button
        v-b-tooltip.top
        type="submit"
        size="sm"
        :title="y18n('submit')"
        variant="success"
      >
        <i class="fas fa-check"></i>
      </b-button>
    </b-form>
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
  watch: {
    property (val) {
      this.newProperty = val
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
      this.stateChange(false)
      this.$emit('changed', this.callback(this.newProperty))
    },
    /**
     * @description emit state-changed event with given value
     * @param {boolean} val change of state
     */
    stateChange (val) {
      this.edit = val
      this.$emit('state-changed', this.edit)
    }
  }
}
</script>
<style scoped>
.property-edit {
  display: block;
  cursor: auto;
  min-width: 10vw;
}
.property-edit>div>i {
  display: none;
}
.property-edit:hover>div>i {
  display: inline-flex;
}
.form-row {
  display: flex;
  flex-wrap: nowrap;
  flex-direction: row;
  box-sizing: border-box;
  flex-shrink: 0;
  flex-grow: 1;
}
</style>

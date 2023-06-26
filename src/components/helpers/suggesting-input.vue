<!--
  Filename: suggesting-input.vue
  Use: Component to implement a suggesting input box
  Creator: cmc
  Since: v1.3.0
--->
<template>
  <div class="suggesting-input">
    <b-form-group
      :label="titleLabelText"
      label-for="tags-with-dropdown"
    >
      <b-form-tags
        id="tags-with-dropdown"
        v-model="selectedTags"
        no-outer-focus
        class="mb-2"
        :limit="tagsNeeded"
      >
        <template #default="{ tags, disabled, addTag, removeTag }">
          <ul
            v-if="tags.length > 0"
            class="list-inline d-inline-block mb-2"
          >
            <li
              v-for="(tag, i) in tags"
              :key="tag"
              class="list-inline-item"
            >
              <b-form-tag
                :title="tag"
                :disabled="disabled"
                variant="info"
                @remove="removeTag(tag)"
              >
                {{ objectRender(tagRender(i)) }}
              </b-form-tag>
            </li>
          </ul>

          <b-dropdown
            v-if="selectedTags.length !== tagsNeeded"
            size="sm"
            variant="outline-secondary"
            block
            menu-class="w-100"
          >
            <template #button-content>
              {{ dropDownButtonText }}
            </template>
            <b-dropdown-form @submit.stop.prevent="() => {}">
              <b-form-group
                :label="searchLabelText"
                label-for="tag-search-input"
                label-cols-md="auto"
                class="mb-0"
                label-size="sm"
                :description="notFound"
                :disabled="disabled"
              >
                <b-form-input
                  id="tag-search-input"
                  v-model="searchTerm"
                  type="search"
                  size="sm"
                  autocomplete="off"
                  :placeholder="searchInputPlaceholder"
                ></b-form-input>
              </b-form-group>
            </b-dropdown-form>
            <b-dropdown-divider></b-dropdown-divider>
            <b-dropdown-item-button
              v-for="(option, i) in searchResult"
              :key="'option-' + i"
              @click="optionSelect({ option, addTag })"
            >
              {{ searchResultRender(option) }}
            </b-dropdown-item-button>
            <b-dropdown-text v-if="searchResult.length === 0">
              {{ noTagsText }}
            </b-dropdown-text>
          </b-dropdown>
          <b-button
            v-else-if="submitButton"
            class="btn-block btn-success"
            @click="tagsSelected"
          >
            {{ submitButtonText }}
          </b-button>
        </template>
      </b-form-tags>
    </b-form-group>
  </div>
</template>
<script>
import { locale } from '@/mixins'
import { camelToRender, filterObject, kebabToCamel } from '@/mixins/general/helpers'
export default {
  name: 'SuggestingInput',
  mixins: [locale],
  props: {
    // the input data on which to search for keys
    domain: {
      type: [Array, Object],
      required: true
    },
    // Text for dropdown menu button
    dropDownButtonText: {
      type: String,
      default: () => 'Select tags'
    },
    // the keys on which to narrow the search domain down
    keys: {
      type: [String, Array],
      default: () => null
    },
    // whether component is used inline or modal
    inline: {
      type: Boolean,
      default: () => true
    },
    // key to use if search domain has nested objects
    nestedKey: {
      type: String,
      default: () => null
    },
    // text to be displayed if search yields no results
    noResultsText: {
      type: String,
      default: () => 'No results found'
    },
    // text if no results are found
    noTagsText: {
      type: String,
      default: () => 'No tags'
    },
    // already selected input
    previousSelection: {
      type: [String, Array],
      default: () => null
    },
    // placeholder for search input
    searchInputPlaceholder: {
      type: String,
      default: () => 'Type for searching'
    },
    // label for search input field
    searchLabelText: {
      type: String,
      default: () => 'Search for tags'
    },
    // wether or not to render a button for submitting
    submitButton: {
      type: Boolean,
      default: () => true
    },
    // text for submit button
    submitButtonText: {
      type: String,
      default: () => 'Submit'
    },
    // number of tags to select
    tagsNeeded: {
      type: Number,
      default: () => 1
    },
    // title above Form
    titleLabelText: {
      type: String,
      default: () => 'Select labels with drop down'
    }
  },
  data () {
    return {
      searchTerm: '',
      selectedTags: []
    }
  },
  computed: {
    /**
     * @function return noResultText when searchResult has length 0
     * @author cmc
     * @since v1.3.0
     */
    notFound () {
      return (this.searchResult.length === 0)
        ? this.noResultsText
        : ''
    },
    resultObject () {
      return this.searchDomain[this.selectedTags[0]] ??
        filterObject(this.keys, this.domain[this.selectedTags[0]], 'text')
    },
    /**
     * @function converts input domain: if it's an object, transform into array of
     *   filtered objects, if it's array of objects, filter, if array of primitive
     *   values, return domain
     * @author cmc
     * @since v1.3.0
     * @return {*[]} search domain
     */
    searchDomain () {
      const dom = [] // array to return if domain is object or domain needs to be filtered
      if (!Array.isArray(this.domain)) { // input domain is an object
        Object.values(this.domain).forEach((e, i) => { // push filtered objects into dom array
          if (typeof e === 'object') { // array of objects
            let filteredEl = { ...e, elementId: Object.keys(this.domain)[i] } // integrate ID
            filteredEl = filterObject([...this.keys, 'elementId'], filteredEl, this.nestedKey)
            dom.push(filteredEl)
          } else { // array of primitive values, create object
            dom.push({ key: e, elementId: Object.keys(this.domain)[i] })
          }
        })
        return dom
      } else if (typeof this.domain[0] === 'object') { // array of objects, return filtered array
        this.domain.forEach((e) => {
          dom.push(filterObject([...this.keys, 'elementId'], e, this.nestedKey))
        })
        return dom
      } else { // array of primitive values, return array itself
        return this.domain
      }
    },
    /**
     * @function sanitize search input
     * @author cmc
     * @since v1.3.0
     * @return {string} trimmed and lowercase search term
     */
    searchQuery () {
      return this.searchTerm.trim().toLowerCase()
    },
    /**
     * @function filter searchDomain for input, checking each value if search
     *  domain consists of objects
     * @author cmc
     * @since v1.3.0
     * @return {*[]} array of values satisfying search query
     */
    searchResult () {
      return this.searchDomain.filter(e => {
        if (typeof e === 'object') { // test all values of the object
          return Object.values(e).some(v => {
            return v.toLowerCase().includes(this.searchQuery)
          })
        } else {
          return e.toLowerCase().includes(this.searchQuery)
        }
      })
    },
    selectedTagsNo () {
      return this.selectedTags.length
    }
  },
  created () {
    this.selectedTags = this.previousSelection
      ? Array.isArray(this.previousSelection)
        ? this.previousSelection
        : [this.previousSelection]
      : []
  },
  watch: {
    // emit tags-selected event when component selected tags matches the number of tags needed
    // only applicable when submitButton prop is false
    selectedTagsNo (v) {
      if (!this.submitButton && v === this.tagsNeeded) {
        this.tagsSelected()
      }
    }
  },
  methods: {
    kebabToCamel,
    /**
     * @function render objects as strings, enumerating them as Uppercase 'Key: Value'
     * @author cmc
     * @param el object to render e.g. { test: 'value' }
     * @return {string} stringified 'Test: Value'
     */
    objectRender (el) {
      let str = ''
      Object.values(el).forEach((e, i) => {
        if (i !== 0) { // prepend comma each time but first
          str += ', '
        }
        str += `${camelToRender(Object.keys(el)[i])}: ${e}`
      })
      return str
    },
    /**
     * @function add selected option to tags array in BFormTags, reset searchTerm
     * @author BootstrapVue
     * @param option selected option
     * @param addTag adding function
     */
    optionSelect ({ option, addTag }) {
      console.log(option, addTag)
      addTag(option.elementId)
      this.searchTerm = ''
    },
    /**
     * @function render search result depending on type
     * @param el object to render
     * @return {string|*} stringified object
     */
    searchResultRender (el) {
      return (typeof el === 'object') // object to render
        ? this.objectRender(el)
        : el
    },
    /**
     * @function represent selected object by filtering keys
     * @author cmc
     * @since v1.3.0
     * @param i index of object in tags array
     * @return {*|object} representation of element in tag
     */
    tagRender (i) {
      return this.searchDomain[this.selectedTags[i]] ??
        filterObject(this.keys, this.domain[this.selectedTags[i]], 'text')
    },
    /**
     * @function emit tags-selected event with single item or array
     * @author cmc
     * @since v1.3.0
     */
    tagsSelected () {
      this.tagsNeeded === 1
        ? this.$emit('tags-selected', this.selectedTags[0])
        : this.$emit('tags-selected', this.selectedTags)
    }
  }
}
</script>

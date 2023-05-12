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
        v-model="selectedTag"
        no-outer-focus
        class="mb-2"
        :limit="1"
      >
        <template #default="{ tags, disabled, addTag, removeTag }">
          <ul
            v-if="tags.length > 0"
            class="list-inline d-inline-block mb-2"
          >
            <li
              v-for="tag in tags"
              :key="tag"
              class="list-inline-item"
            >
              <b-form-tag
                :title="tag"
                :disabled="disabled"
                variant="info"
                @remove="removeTag(tag)"
              >
                {{ objectRender(resultObject) }}
              </b-form-tag>
            </li>
          </ul>

          <b-dropdown
            v-if="selectedTag.length !== 1"
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
            v-else
            class="btn-block btn-success"
            @click="$emit('tagSelected', selectedTag[0])"
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
    // text for submit button
    submitButtonText: {
      type: String,
      default: () => 'Submit'
    },
    // title above Form
    titleLabelText: {
      type: String,
      default: () => 'Select labels with drop down'
    },

  },
  data () {
    return {
      searchTerm: '',
      selectedTag: []
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
      return this.searchDomain[this.selectedTag[0]]
        ?? filterObject(this.keys, this.domain[this.selectedTag[0]], 'text')
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
    }
  }
}
</script>

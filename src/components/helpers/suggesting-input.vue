<!--
  Filename: suggesting-input.vue
  Use: Component to implement a suggesting input box
  Creator: cmc
  Since: v1.3.0
--->
<template>
  <div class="suggesting-input">
    <b-form v-if="!selected">
      <b-form-input
        v-model="searchTerm"
        :placeholder="y18n('suggestingInput.typeToSearch')"
        list="result-list"
        @change="selectedSet"
      ></b-form-input>
      <b-form-datalist
        id="result-list"
      >
        <option
          v-for="o in searchResult"
        >
          Title: {{ domain[o[1]].title.text }},
          Type: {{ y18n(`${kebabToCamel(domain[o[1]].name)}.title`) }},
          Id: {{ domain[o[1]].id }}
        </option>
      </b-form-datalist>
    </b-form>
    <div v-else>
      {{ selected }}
    </div>
  </div>
</template>
<script>
import { locale } from '@/mixins'
import { filterObject, kebabToCamel } from '@/mixins/general/helpers'
export default {
  name: 'SuggestingInput',
  mixins: [locale],
  props: {
    // the input data on which to search for keys
    domain: {
      type: [Array, Object],
      required: true
    },
    // the keys on which to narrow the search domain down
    keys: {
      type: [String, Array],
      default: () => null
    }
  },
  data () {
    return {
      searchTerm: '',
      selected: ''
    }
  },
  computed: {
    searchDomain () {
      if (!Array.isArray(this.domain)) { // input domain is an object
        const dom = []
        Object.values(this.domain).forEach((e, i) => {
          let filteredEl = { ...e, elementId: Object.keys(this.domain)[i] } // integrate ID
          filteredEl = filterObject([...this.keys, 'elementId'], filteredEl, 'text')
          dom.push(filteredEl)
        })
        return dom
      } else if (typeof this.domain[0] === 'object') { // array of objects
        return filterObject(this.keys, this.domain)
      } else {
        return this.domain
      }
    },
    searchResult () {
      return this.searchLookup.filter(e => e[0].includes(this.searchTerm))
    },
    searchLookup () {
      if (typeof this.searchDomain[0] === 'object') {
        const lookup = []
        this.searchDomain.forEach(e => {
          Object.values(e).forEach(k => lookup.push([k, e.elementId]))
        })
        return lookup
      } else {
        return this.searchDomain
      }
    }
  },
  methods: {
    kebabToCamel,
    followSelect (o) {
      console.log('selected:', o)
      this.selected = o[1]
    },
    selectedSet (e) {
      console.log(e)
      this.selected = this.searchTerm.split(' ').at(-1)
    }
  }

}
</script>

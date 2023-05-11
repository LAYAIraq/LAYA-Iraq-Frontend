<!--
  Filename: suggesting-input.vue
  Use: Component to implement a suggesting input box
  Creator: cmc
  Since: v1.3.0
--->
<template>
  <div class="suggesting-input">

  </div>
</template>
<script>
import { locale } from '@/mixins'
import { filterObject } from '@/mixins/general/helpers'
export default {
  name: 'SuggestingInput',
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
  mixins: [locale],
  computed: {
    searchDomain () {
      if (!Array.isArray(this.domain)) { // input domain is an object
        const dom = []
        Object.values(this.domain).forEach((e, i) => {
          let filteredEl = { ...e, elementId: Object.keys(this.domain)[i] } // integrate ID
          filteredEl = filterObject(this.keys, filteredEl)
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
      // TODO: continue here by creating a method that checks if input matches anything in domain
    },
    searchLookup () {
      // TODO: create a lookup, i.e. list of tuples where one is key and one is ID of object
    }
  }

}
</script>

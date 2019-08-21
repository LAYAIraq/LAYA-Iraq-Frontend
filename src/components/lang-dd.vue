<template>
  <b-dropdown no-caret right class="ly-lang-dd">
    <i slot="button-content" :class="chosenLangIcon"></i>

    <b-dropdown-item-btn v-for="lang in langs"
                         :key="lang"
                         @click="onChoose(lang)">
      <i :class="icon(lang)"></i>
      <span class="text-uppercase">{{lang}}</span>
    </b-dropdown-item-btn>

  </b-dropdown>
</template>

<script>
import bsDropdown from 'bootstrap-vue/es/components/dropdown'

import {mapState} from 'vuex'
import langs from '../misc/langs.js'

export default {
  name: 'ly-lang-dd',
  data () {
    return {
      langs
    }
  },
  props: {
    onChoose: Function
  },
  computed: {
    ...mapState(['profile']),

    chosenLangIcon: function () {
      return `chosen ${this.icon(this.profile.lang)}`
    }
  },
  methods: {
    icon (lang) {
      return `flag-icon flag-icon-${lang}`
    }
  },
  components: {
    ...bsDropdown
  }
}
</script>

<style>
.ly-lang-dd *:focus {
  outline: 2px dashed deepskyblue !important;
  outline-offset: 8px;
}

.ly-lang-dd {
  display: inline-block;
}
.ly-lang-dd .chosen {
  font-size: 1.5rem;
  border: 1px solid grey;
  background-size: cover;
}
._ly-lang-dd .dropdown-menu.show {
  padding: 5px;
  min-width: unset;
}
.ly-lang-dd .dropdown-item {
  padding: 5px 10px;
}
.ly-lang-dd .dropdown-item:last-child {
  padding-bottom: 0;
}
.ly-lang-dd button {
  padding: 0;

  border: none;
  outline: none;

  background: none;
  box-shadow: none !important;
  line-height: initial;
}
</style>

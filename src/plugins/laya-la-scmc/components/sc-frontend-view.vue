<template>
  <div class="container">
    <h3 class="row">{{ title }}</h3>
    <div class="row">{{ description }}</div>
    <b-check-group v-if="isMultiple">
      <label class="col" v-for="(it,i) in items" :key="i">
        <b-checkbox />
        {{it.text}}
      </label>
    </b-check-group>
    <b-radio-group v-else>
      <label class="col" v-for="(it,i) in items" :key="i">
        <b-radio />
        {{it.text}}
      </label>
    </b-radio-group>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

import http from "axios";

export default Vue.extend({
  data() {
    return {
      id: 0,
      title: "Titel",
      description: "Aufgabenstellung",
      isMultiple: false,
      items: [{ text: "Foobar", correct: false }],
    };
  },

  methods: {
    fetch(id) {
      const ctx = this;
      http.get(`assessmentscmcs/${id}`).then(({ data }) => {
        console.log(data);
        this.id = data.id;
        this.title = data.title;
        this.description = data.description;
        this.isMultiple = data.isMultiple;
        this.items = data.assessmentscmcitems;
      });
    },
  },

  created() {
    const id = this.$route.params.assId;
    this.fetch(id);
  },
});
</script>

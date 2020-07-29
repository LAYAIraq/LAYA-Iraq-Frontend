<template>
  <b-container>
    <h3>{{ i18n.edit.scmc }}</h3>
    <b-form>
      <label class="row">
        {{ i18n.edit.title }}:
        <b-input class="col" v-model="title" type="text" :placeholder="i18n.edit.title" />
      </label>

      <label class="row">
        {{ i18n.edit.type }}:
        <b-radio-group v-model="isMultiple" name="isMultiple">
          <b-radio class="col" value="false">{{ i18n.edit.sc }}</b-radio>
          <b-radio class="col" value="true">{{ i18n.edit.mc }}</b-radio>
        </b-radio-group>
      </label>

      <label class="row">
        {{ i18n.edit.task }}
        <b-textarea
          class="col"
          v-model="description"
          name="description"
          :placeholder="i18n.edit.task"
        ></b-textarea>
      </label>

      <label class="container">
        {{ i18n.edit.items }}:
        <ul class="container" style="list-style: none;">
          <li class="row" v-for="(it, i) in items" :key="i">
            <b-input class="col col-8" :value="it.caption" v-model="items[i].caption" />
            <label class="col col-2">
              <b-checkbox value="true" v-model="items[i].correct" />{{ i18n.edit.correct }}
            </label>
            <b-button class="col col-2" variant="danger" @click="removeItem(i)">{{ i18n.edit.delete }}</b-button>
          </li>
        </ul>
        <b-button class="col" variant="success" @click="addItem()">{{ i18n.edit.itemAdd }}</b-button>
      </label>
      <div class="row">
        <b-button class="col" @click="save()" variant="primary">{{ i18n.edit.save }}</b-button>
        <b-button class="col" variant="secondary">{{ i18n.edit.preview }}</b-button>
      </div>
    </b-form>
  </b-container>
</template>

<script lang="ts">
import Vue from "vue";
import http from "axios";
import * as i18n from "../../../i18n/plugins/laya-la-scmc";

export default Vue.extend({
  data() {
    return {
      title: "",
      isMultiple: false,
      description: "",
      items: [{ caption: "foo bar", correct: true }],
    };
  },
  methods: {
    removeItem(idx) {
      this.items = this.items.filter((it, i) => i != idx);
    },
    addItem() {
      this.items.push({ caption: "", correct: false });
    },

    save() {
      const dto = {
        title: this.title,
        isMultiple: this.isMultiple,
        description: this.description,
      };
      const dtoItems = this.items.map((it) => {
        return {
          text: it.caption,
          isCorrect: it.correct,
        };
      });

      console.log(dtoItems);

      http.post(`assessmentscmcs`, dto).then(({ data }) => {
        dtoItems.forEach((it) =>
          http.post(`assessmentscmcs/${data.id}/items`, it),
        );
      });
    },
  },
  computed: {
    i18n() {
      return i18n[this.$store.state.profile.lang];
    }
  }
});
</script>

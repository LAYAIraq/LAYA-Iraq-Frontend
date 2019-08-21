<template>
  <b-container>
    <h3>Single Choice / Multiple Choice</h3>
    <b-form>
      <label class="row">
        Titel:
        <b-input class="col" v-model="title" type="text" placeholder="Titel" />
      </label>

      <label class="row">
        Art:
        <b-radio-group v-model="isMultiple" name="isMultiple">
          <b-radio class="col" value="false">Single Choice</b-radio>
          <b-radio class="col" value="true">Multiple Choice</b-radio>
        </b-radio-group>
      </label>

      <label class="row">
        Frage / Aufgabe:
        <b-textarea
          class="col"
          v-model="description"
          name="description"
          placeholder="Frage / Aufgabe"
        ></b-textarea>
      </label>

      <label class="container">
        Items:
        <ul class="container" style="list-style: none;">
          <li class="row" v-for="(it, i) in items" :key="i">
            <b-input class="col col-8" :value="it.caption" v-model="items[i].caption" />
            <label class="col col-2">
              <b-checkbox value="true" v-model="items[i].correct" />richtig?
            </label>
            <b-button class="col col-2" variant="danger" @click="removeItem(i)">Löschen</b-button>
          </li>
        </ul>
        <b-button class="col" variant="success" @click="addItem()">Item hinzufügen</b-button>
      </label>
      <div class="row">
        <b-button class="col" @click="save()" variant="primary">Speichern</b-button>
        <b-button class="col" variant="secondary">Vorschau (TODO)</b-button>
      </div>
    </b-form>
  </b-container>
</template>

<script lang="ts">
import Vue from "vue";
import http from "axios";

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
});
</script>

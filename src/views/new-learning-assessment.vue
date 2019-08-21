<template>
  <strong
    v-if="Object.entries($laya.la).length === 0 && $laya.la.constructor === Object"
  >Keine Lernüberprüfungen registriert!</strong>
  <b-form v-else-if="showForm" @submit="addLA">
    <h3>Bitte Lernüberprüfung auswählen.</h3>
    <label>
      Lernüberprüfung:
      <b-select v-model="selected">
        <option
          name="assessment"
          v-for="(la, id) in $laya.la"
          :key="id"
          :value="id"
        >{{ la.i18n["de"] }}</option>
      </b-select>
      <b-button type="submit" variant="primary">Lernüberprüfung hinzufügen</b-button>
    </label>
  </b-form>
  <!-- new view -->
  <router-view v-else></router-view>
</template>

<script>
import Vue from "vue";

export default Vue.extend({
  data: function() {
    return {
      selected: "",
      showForm: true
    };
  },
  methods: {
    addLA(e) {
      if (this.selected === "") {
        // FIXME error notification would be nice
        return false;
      }
      // console.log("selected: " + this.selected);
      this.showForm = false;
      this.$router.push({
        name: "assessment-create",
        params: { type: this.selected }
      });
      e.preventDefault();
    }
  }
});
</script>


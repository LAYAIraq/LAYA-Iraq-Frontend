<template>
  <strong
    v-if="Object.entries($laya.lb).length === 0 && $laya.lb.constructor === Object"
  >Keine Lernbausteine registriert!</strong>
  <form v-else>
    <h3>Bitte Lernbaustein auswählen.</h3>
    <label>
      <select>
        <option v-for="(lb, id) in $laya.lb" :key="id">{{ lb.i18n["de"] }}</option>
      </select>
    </label>
  </form>
</template>

<script>
import Vue from "vue";

export default Vue.extend({});
</script>


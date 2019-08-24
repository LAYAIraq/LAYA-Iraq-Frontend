<template>
  <div class="new-learning-block-view">
    <strong v-if="noBlocksRegistered">
      Keine Lernbausteine registriert!
    </strong>
    <form v-else>
      <div class="form-group">
        <label for="new-learn-block">Bitte Lernbaustein auswählen</label>
        <select id="new-learn-block" class="form-control custom-select">
          <option v-for="(lb, id) in $laya.lb" :key="id">
          {{ lb.i18n["de"] }}
          </option>
        </select>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: "new-learning-block-view",
  computed: {
    noBlocksRegistered: function() {
      return (Object.entries(this.$laya.lb).length === 0) &&
        (this.$laya.lb.constructor === Object)
    }
  }
}
</script>


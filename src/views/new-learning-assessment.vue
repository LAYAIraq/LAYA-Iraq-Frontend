<template>
  <div class="new-learning-block-view">
    <strong v-if="noAssessmentsRegistered">
      Keine Lernüberprüfungen registriert!
    </strong>
    <form v-if="!noAssessmentsRegistered && showForm">
      <div class="form-group">
        <label for="new-learn-ass">Bitte Lernüberprüfung auswählen:</label>
        <select id="new-learn-ass" v-model="selected" class="custom-select">
          <option v-for="(la, id) in $laya.la" :key="id" :value="id">
          {{ la.i18n["de"] }}
          </option>
        </select>
      </div>
      <button type="submit"
              class="btn btn-primary"
              @click.prevent="selectLA"
              :disabled="!formOk">
        <i class="fas fa-plus"></i> Lernüberprüfung hinzufügen
      </button>
    </form>

    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "new-learn-assessment-view",
  data() {
    return {
      selected: "",
      showForm: true
    }
  },
  computed: {
    noAssessmentsRegistered: function() {
      return (Object.entries(this.$laya.la).length === 0) &&
        (this.$laya.la.constructor === Object)
    },
    formOk: function() {
      return (this.selected !== "")
    }
  },
  methods: {
    selectLA() {
      this.showForm = false
      this.$router.push({
        name: "assessment-create",
        params: { type: this.selected }
      })
    }
  }
}
</script>


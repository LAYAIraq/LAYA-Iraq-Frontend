<template>

  <div class="laya-lb-plyr-vimeo-edit">

    <form>
      <div class="form-group">
        <label for="vimeo-vid-id">{{ i18n.video }}</label>
        <input id="vimeo-vid-id"
               type="text"
               v-model="url"
               class="form-control"
               :placeholder="i18n.placeholder">
      </div>

    </form>
      
  </div>

</template>

<script>
import * as i18n from "@/i18n/plugins/laya-lb-plyr-vimeo"

export default {
  name: "laya-lb-plyr-vimeo-edit",
  data() {
    if(Object.entries(this.$attrs).length > 0)
      return {...this.$attrs}
    return {
      url: ""
    }
  },
  mounted() {
  },
  props: {
  },
  computed: {
    i18n() {
      return i18n[this.$store.state.profile.lang]
    }
  },
  methods: {
  },
}
</script>

<style>
</style>

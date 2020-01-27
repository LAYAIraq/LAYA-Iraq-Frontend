<template>
  <div class="root-view">

    <div class="container">
      <div class="row">
        <div class="col">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as i18n from '@/i18n/root'

export default {
  name: 'root-view',
  data () {
    return {
    }
  },
  computed: {
    msg: function () {
      return i18n[this.$store.state.profile.lang]
    }
  },
  components: {
  }
}
</script>

<style scoped>
*:focus {
  outline: 3px dashed deepskyblue;
}

a {
  color: black;
  text-decoration: underline;
}
</style>

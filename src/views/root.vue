<template>
  <div class="root-view">

    <div class="container">
      <div class="row">
        <div class="col">
          <h1> {{ i18n. title }} </h1>
          <h2> {{ i18n.subtitle }} </h2>
          <p> {{ i18n.promoText1 }} </p>
          <p> {{ i18n.promoText2 }} </p>
          <p> {{ i18n.promoText3 }} </p>
          <p> {{ i18n.promoText4 }} </p>
          <p> {{ i18n.promoText5 }} </p>

          <b-link to="/register">{{ i18n.register }}</b-link>
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
    i18n () {
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

.sponsor img {
  height: 8rem;
}

h2 {
  margin-bottom: 10vh;
}
</style>

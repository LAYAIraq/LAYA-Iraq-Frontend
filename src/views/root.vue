<!--
Filename: root.vue
Use: Show Landing Page
Creator: core
Date: unknown
Dependencies: @/mixins/locale.vue
-->

<template>
  <div
    class="root-view"
    :class="langIsAr? 'text-right' : 'text-left'"
  >
    <div class="container">
      <div class="row">
        <div class="col">
          <h1> {{ i18n['root.title'] }} </h1>
          <h2> {{ i18n['root.subtitle'] }} </h2>
          <p> {{ i18n['root.promoText1'] }} </p>
          <p> {{ i18n['root.promoText2'] }} </p>
          <p> {{ i18n['root.promoText3'] }} </p>
          <p> {{ i18n['root.promoText4'] }} </p>
          <p> {{ i18n['root.promoText5'] }} </p>

          <b-link to="/register">
            {{ i18n['root.register'] }}
          </b-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { locale } from '@/mixins'

export default {
  name: 'RootView',

  mixins: [
    locale
  ]

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

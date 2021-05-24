<template>
  <b-dropdown
    id="notifications-list"
    toggle-class="list-on"
    menu-class="list-off"
    variant="light"
  >
    <template slot="button-content">
      <i class="fas fa-bell"></i>
      {{ i18n['notifications'] }}
    </template>

    <b-dropdown-item
      v-for="(item, i) in notifyStub"
      :key="i"
    >
      {{ item }}
    </b-dropdown-item>

    <b-dropdown-divider></b-dropdown-divider>

    <b-dropdown-item>
      <router-link to="/notifications">
        {{ i18n['notifications.seeAll'] }}
      </router-link>
    </b-dropdown-item>
  </b-dropdown>
</template>

<script>
import { locale } from '@/mixins'

export default {
  name: 'lyHeaderNotifications',

  mixins: [
    locale
  ],

  data() {
    return {
      notifyStub: [
        'deine mutter',
        'stinkt',
        'nach fisch'
      ] 
    }
  }
}


</script>

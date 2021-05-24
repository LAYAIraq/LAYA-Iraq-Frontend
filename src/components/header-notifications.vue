<template>
  <b-dropdown
    id="notifications-list"
    menu-class="notify-icon"
    variant="light"
  >
    <template slot="button-content">
      <!-- <i class="fas fa-bell"></i>
      {{ i18n['notifications'] }} -->
        {{ i18n['notifications'] }}
        <i class="fas fa-bell fa-lg"></i>
    
      <span
        v-if="newNotifications" 
        class="note-badge"
      >
        {{ newNotesNumber }}
      </span>
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
      ],
      newNotifications: true,
      newNotesNumber: 34
    }
  }
}


</script>

<style scoped>
#notifications-list {
  position: relative;
}


.note-badge {
  position: absolute;
  right: 20px;
  top: -5px;
  font-size: 0.7em;
  font-weight: bold;
  border-radius: 50%;
  padding: 3px;
  color: whitesmoke;
  background-color: tomato;
}

</style>

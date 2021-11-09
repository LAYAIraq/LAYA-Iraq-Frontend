<!--
Filename: App.vue 
Use: render Laya
Creator: core
Date: unknown
Dependencies: 
  @/components/header,
  @/components/footer
-->

<template>
  <div
    id="app"
    :class="getClasses()"
  >
    <ly-header></ly-header>
    <router-view></router-view>
    <ly-footer></ly-footer>
  </div>
</template>

<script>
import lyHeader from '@/components/header'
import lyFooter from '@/components/footer'
import { mapGetters } from 'vuex'
import 'open-dyslexic/open-dyslexic-regular.css'
import '@/styles/fonts.css'

export default {
  name: 'app',

  components: { 
    lyHeader, 
    lyFooter 
  },

  computed: {
    ...mapGetters([
      'fontOptions', // commented out b/c is not implemented on this branch
      'profileLang'
    ])
  },

  watch: {
    $route: 'relocateUnauthorized'
  },

  created() {
    this.restoreAuth()
  },

  methods: {

    getClasses() {
      return this.getReadingDir() + ` laya-font-${this.fontOptions.chosen}`
        + ` font-size-${this.fontOptions.size}`
    },
    /**
     * Function getReadingDir: set dir prop depending on locale
     *  (rtl if ar)
     *
     * Author: cmc
     *
     * Last Updated: June 3, 2021
     * @returns {string} class name for reading direction
     */
    getReadingDir() {
      if (this.profileLang === 'ar') {
        return 'right-to-left'
      }
      return 'left-to-right'
    },

    /**
     * function relocateUnauthorized: relocate users that are not 
     *  authenticated
     * 
     * Author: core
     * 
     * Last Updated: unknown
     */
    relocateUnauthorized() {
      /* 
       * pass access if auth true */
      if (this.$ls.get('auth', false)) return

      const publicURLs = [
        '#/',
        '#/login',
        '#/register',
        '#/imprint',
        '#/privacy'
      ]

      /* target url is public */
      if (publicURLs.includes(location.hash)) return

      /* temporary allow public course access */
      if (/courses/.test(location.hash)) return

      /* auth first */
      this.$router.push('/login')
    },

    /**
     * Function restoreAuth: restore authentication from local
     *  storage, set vuex store
     * 
     * Author: core
     * 
     * Last Updated: unknown
     */
    restoreAuth() {
      let auth = this.$ls.get('auth', false)
      if (!auth) return
      console.log('Auth restored')
      this.$store.commit('login', auth)
      this.$store.dispatch('fetchProfile')
      this.$store.dispatch('fetchRole')
    }
  }
}
</script>

<style>
html,
body {
  line-height: 1.5;
}

.ly-bg-grey {
  background-color: #ebece7;
}

.ly-bg-author {
  background-color: #abd3ff;
}

.dropdown-menu {
  min-width: 5rem;
  border-radius: 2px;
}

.left-to-right {
  direction: ltr;
}

.right-to-left {
  direction: rtl;
}

</style>

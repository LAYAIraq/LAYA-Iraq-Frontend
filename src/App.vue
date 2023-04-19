<!--
Filename: App.vue
Use: render Laya
Creator: core
Date: unknown
Dependencies:
  @/components/header,
  @/components/footer
-->

<!--suppress ALL -->
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
import LyHeader from '@/components/general/header.vue'
import LyFooter from '@/components/general/footer.vue'
import { mapGetters } from 'vuex'
import 'open-dyslexic/open-dyslexic-regular.css'
import '@/assets/styles/fonts.css'
import '@/assets/styles/color-correction.css'
import { publicRoutes } from '@/router'

export default {
  name: 'App',

  components: {
    LyHeader,
    LyFooter
  },

  beforeRouteUpdate () {
    this.relocateUnauthorized()
  },

  computed: {
    ...mapGetters([
      'fontOptions',
      'profileLang'
    ])
  },

  watch: {
    $route () {
      this.relocateUnauthorized()
    }
  },

  created () {
    document.title = 'LAYA - Learn As You Are'
    this.restoreAuth()
    this.relocateUnauthorized()
  },

  methods: {

    getClasses () {
      return this.getReadingDir() + ` laya-font-${this.fontOptions.chosen}` +
        ` font-size-${this.fontOptions.size}`
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
    getReadingDir () {
      if (this.profileLang === 'ar' || this.profileLang === 'ku') {
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
    relocateUnauthorized () {
      /* pass access if auth true */
      const auth = this.$ls.get('auth', false)
      /* target url is not public */
      const loc = this.$route.query.length === 0 // separate query for if statement
        ? this.$route.path
        : this.$route.path.split('?')[0]
      if (!auth && !publicRoutes.includes(loc) && this.$route.path !== '/login') {
        this.$router.push('/login')
      }
    },

    /**
     * Function restoreAuth: restore authentication from local
     *  storage, set vuex store
     *
     * Author: core
     *
     * Last Updated: unknown
     */
    restoreAuth () {
      const auth = this.$ls.get('auth', false)
      if (!auth) return
      console.log('Auth restored')
      this.$store.commit('login', auth)
      this.$store.dispatch('fetchProfile')
      this.$store.dispatch('roleFetch')
    }
  }
}
</script>

<style>
html,
body {
  line-height: 1.5;
}

.bg-grey {
  background-color: #ebece7;
}

.bg-author {
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

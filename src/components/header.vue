<!--
Filename: header.vue
Use: shows the navbar
Creator: core
Date: unknown
Dependencies: 
  vuex, 
  axios, 
  @/mixins/locale, 
  @/components/scroll-to-top.vue, 
  @/misc/icons.js
-->

<template>
  
  <div 
    id="ly-header"
    :class="langIsAr? 'text-right' : 'text-left'"
  >
    <ly-scroll-to-top></ly-scroll-to-top>
    <b-navbar toggleable="lg" type="light" variant="light">

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>

        <b-navbar-brand to="/">
          <img style="height: inherit"
               src="../assets/laya-logo-xs.png"
               alt="Laya - Learn as you are">
        </b-navbar-brand>

        <!-- left links -->
        <b-navbar-nav v-if="auth.online">
          <b-nav-item to="/courses">
            <i class="fas fa-chalkboard-teacher" size="2x"></i> 
            {{ i18n['header.courses'] }}
          </b-nav-item>
          <!-- <b-nav-item to="/mycourses">{{ i18n['mycourses.title'] }}</b-nav-item> -->
        </b-navbar-nav>

        <!-- right links unauthorized -->
        <b-navbar-nav 
          v-if="!auth.online" 
          :class="marginClass()"
        >
          <b-nav-item to="/register">
          <i class="fas fa-user-plus"></i>
            {{ i18n['header.register'] }}
          </b-nav-item>
          <b-nav-item to="/login">
          <i class="fas fa-sign-in-alt"></i>
            {{ i18n['login.title'] }}
          </b-nav-item>
        </b-navbar-nav>

        <!-- right links authorized -->
        <b-navbar-nav 
          v-else 
          :class="marginClass()"
        >
          <ly-header-notifications></ly-header-notifications>
          <b-nav-item to="/profile">
            <i class="fas fa-user-alt"></i>
            {{ i18n['header.profile'] }}
          </b-nav-item>
          <b-nav-item @click="logout">
            <i class="fas fa-sign-out-alt"></i>
            {{ i18n['header.logout'] }}
          </b-nav-item>
        </b-navbar-nav>

        <b-navbar-nav v-if="langIsAr">
          <b-nav-item-dropdown>

            <template v-slot:button-content>
              <img :src="icons[profileLang]" class="lang-icon">
            </template>

            <b-dropdown-item-btn 
              v-for="(svg, lang) in icons"
              :key="lang"
              @click="setLang(lang)"
            >
              <img 
                :src="svg" 
                :alt="lang" 
                class="lang-icon lang-icon-list"
              >
            </b-dropdown-item-btn>

          </b-nav-item-dropdown>
        </b-navbar-nav>

        <b-navbar-nav v-else>
          <b-nav-item-dropdown right>

            <template v-slot:button-content>
              <img :src="icons[profileLang]" class="lang-icon">
            </template>

            <b-dropdown-item-btn 
              v-for="(svg, lang) in icons"
              :key="lang"
              @click="setLang(lang)"
            >
              <img 
                :src="svg" 
                :alt="lang" 
                class="lang-icon lang-icon-list"
              >
            </b-dropdown-item-btn>

          </b-nav-item-dropdown>
        </b-navbar-nav>

      </b-collapse>

    </b-navbar>
  </div>

</template>

<script>
import { mapGetters, mapState } from 'vuex'
import http from 'axios'
import { icons } from '@/misc/langs.js'
import { locale } from '@/mixins'
import lyHeaderNotifications from '@/components/header-notifications.vue'
import lyScrollToTop from '@/components/scroll-to-top.vue'

export default {
  name: 'ly-header',

  components: {
    lyHeaderNotifications,
    lyScrollToTop
  },

  mixins: [
    locale
  ],

  data () {
    return {
      icons,
      isCourse: Boolean
    }
  },
  
  computed: {
    ...mapState(['auth']),
    ...mapGetters(['profileLang'])
  },

  watch: {
    '$route': 'checkCourse'
  },

  mounted () {
    document.title = 'Laya'
    this.checkCourse()
    this.$forceUpdate()
    this.getLocale()
  },

  methods: {
    /**
     * Function getLocale: Get Browser locale for localization
     * 
     * Author: core
     * 
     * Last Updated: March 12, 2021
     */
    getLocale() {
      let store = this.$store
      /*
      * get browser locale */
      http.get('lang')
        .then(({data}) => {
          let lang = data.substring(0, data.indexOf('-'))
          store.commit('setLang', lang)
          const html = document.documentElement
          html.setAttribute('lang', lang)
        })
        .catch(() => {
          store.commit('setLang', 'de')
        })
    },

    /**
     * Function toggleMedia (deprecated): toggle media preferences for user
     * 
     * Author: core
     * 
     * Last Updated: unknown
     *
     */
    toggleMedia(type) {
      this.$store.commit('toggleMedia', type)
    },

    /**
     * Function checkCourse: check if the route exists
     * 
     * Author: core
     * 
     * Last Updated: unknown
     */
    checkCourse () {
      this.isCourse = /courses[/]./.test(location.hash)
      this.$forceUpdate()
    },

    /**
    * Function setLang: set a new User Language
    *
    *
    * Author: cmc
    *
    * Last Updated: October 26, 2021
     * @param {string} newlang 2-letter locale string
    */
    setLang (newlang) {
      this.$store.commit('setLang', newlang)
      this.$nextTick(() => {
        if(this.$store.state.auth.online) {
          const data = {
            lang: this.$store.state.profile.lang,
            uid: this.$store.state.auth.userId
          }
          this.$store.commit('setUserLang', data)
        }
      })
    },

    /**
     * Function logout: Remove local storage, redirect to login page
     * 
     * Author: core
     * 
     * Last Updated: unknown
     */
    logout() {
      this.$ls.remove('auth')
      this.$store.commit('logout')
      this.$router.push('/login')
    },

    /**
     * function marginClass: returns class for side margin depending on locale
     * Author: cmc
     * Last Updated: June 3, 2021
     */
    marginClass() {
      if (this.langIsAr) {
        return 'mr-auto'
      }
      return 'ml-auto'
    }
  }
}
</script>

<style scoped>
*:focus {
  outline: 2px dashed deepskyblue;
}

#rtl {
  flex-direction: row-reverse !important;
}

.navbar-brand {
  padding: 0;
  margin-top: -0.5rem;
  margin-bottom: -0.5rem;
  margin-left: -1rem;
  height: 5rem;
}

.navbar-toggler {
  margin-left: auto;
}

#ly-header {
  position: sticky;
  top: 0;

  z-index: 11001;
  box-shadow: 0px 0px 3px black;
}

.router-link-exact-active {
  color: black !important;
  border-bottom: 2px solid black;
}

.lang-icon {
  width: 2rem;
  border: 1px solid grey;
}

.lang-icon-list {
  margin: 5px;
}

</style>

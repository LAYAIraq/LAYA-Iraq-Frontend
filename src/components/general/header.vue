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
    id="header"
    :class="langIsAr? 'text-right' : 'text-left'"
  >
    <b-navbar
      toggleable="lg"
      type="light"
      variant="light"
    >
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse
        id="nav-collapse"
        is-nav
      >
        <b-navbar-brand
          id="header-logo"
          to="/"
        >
          <img
            style="height: inherit"
            src="../../assets/images/logo-iraq-xs.png"
            alt="Laya - Learn as you are"
          >
        </b-navbar-brand>

        <!-- left links -->
        <b-navbar-nav v-if="userOnline">
          <b-nav-item to="/courses">
            <i
              class="fas fa-chalkboard-teacher"
              size="2x"
            ></i>
            {{ y18n('header.courses') }}
          </b-nav-item>
          <!-- <b-nav-item to="/mycourses">{{ y18n('mycourses.title') }}</b-nav-item> -->
        </b-navbar-nav>

        <!-- right links unauthorized -->
        <b-navbar-nav
          v-if="!userOnline"
          :class="marginClass()"
        >
          <b-nav-item to="/register">
            <i class="fas fa-user-plus"></i>
            {{ y18n('header.register') }}
          </b-nav-item>
          <b-nav-item to="/login">
            <i class="fas fa-sign-in-alt"></i>
            {{ y18n('login.title') }}
          </b-nav-item>
        </b-navbar-nav>

        <!-- right links authorized -->
        <b-navbar-nav
          v-else
          :class="marginClass()"
        >
          <b-nav-item
            v-if="isAdmin || isSuperAdmin"
            to="/admin"
          >
            <i class="fas fa-solid fa-screwdriver"></i>
            {{ y18n('adminPanel.title') }}
          </b-nav-item>
          <b-nav-item
            v-if="isEditor || isAdmin || isSuperAdmin"
            to="/editor"
          >
            <i class="fas fa-user-tie"></i>
            Editor Panel
          </b-nav-item>
          <header-notifications></header-notifications>
          <b-nav-item to="/profile">
            <i class="fas fa-user-alt"></i>
            {{ y18n('header.profile') }}
          </b-nav-item>
          <b-nav-item @click="logout">
            <i class="fas fa-sign-out-alt"></i>
            {{ y18n('header.logout') }}
          </b-nav-item>
        </b-navbar-nav>

        <b-navbar-nav v-if="langIsAr">
          <b-nav-item-dropdown>
            <template #button-content>
              <img
                :src="icons[profileLanguage]"
                class="lang-icon"
                :alt="profileLanguage"
              >
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
            <template #button-content>
              <img
                :src="icons[profileLanguage]"
                class="lang-icon"
                :alt="y18n('langSelect')"
              >
            </template>

            <b-dropdown-item-btn
              v-for="(svg, lang) in icons"
              :key="lang"
              :aria-label="languageAria[lang]"
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
import { mapGetters } from 'vuex'
import { icons } from '@/options/langs.js'
import { locale } from '@/mixins'

export default {
  name: 'Header',

  components: {
    HeaderNotifications: () => import('@/components/notifications/header-notifications.vue')
  },

  mixins: [
    locale
  ],

  data () {
    return {
      icons,
      isCourse: Boolean,
      languageAria: []
    }
  },

  computed: {
    ...mapGetters([
      'isAdmin',
      'isSuperAdmin',
      'isEditor',
      'profileLanguage',
      'userId',
      'userOnline'
    ])
  },

  watch: {
    $route: 'checkCourse'
  },

  mounted () {
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
     * Last Updated: June 8, 2022 by cmc
     */
    getLocale () {
      const locales = navigator.languages
      let lang
      if (locales.length !== 0) {
        lang = locales[0].substring(0, 2)
      } else {
        lang = navigator.language
      }
      this.$store.commit('languageSet', lang)
      document.documentElement.setAttribute('lang', lang)
    },

    /**
     * Function checkCourse: check if the route exists
     *
     * Author: core
     *
     * Last Updated: unknown
     */
    checkCourse () {
      this.isCourse = /courses\/./.test(location.hash)
      this.$forceUpdate()
    },

    /**
    * Function languageSet: set a new User Language
    *
    *
    * Author: cmc
    *
    * Last Updated: October 26, 2021
     * @param {string} newlang 2-letter locale string
    */
    setLang (newlang) {
      this.$store.commit('languageSet', newlang)
      if (this.userOnline) {
        console.log('setting user language')
        const data = {
          lang: this.profileLanguage,
          uid: this.userId
        }
        this.$store.dispatch('profileUpdateLanguage', data)
      } else { console.log('user not online') }
    },

    /**
     * Function logout: Remove local storage, redirect to login page
     *
     * Author: core
     *
     * Last Updated: unknown
     */
    logout () {
      this.$ls.remove('auth')
      this.$store.commit('logout')
      this.$store.commit('roleSet', 'student')
      this.$router.push('/login')
    },

    /**
     * function marginClass: returns class for side margin depending on locale
     * Author: cmc
     * Last Updated: June 3, 2021
     */
    marginClass () {
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

#header-logo {
  border: none;
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

#header {
  position: sticky;
  top: 0;

  z-index: 11001;
  box-shadow: 0 0 3px black;
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

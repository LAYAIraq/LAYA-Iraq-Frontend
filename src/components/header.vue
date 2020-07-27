<template>

  <div id="ly-header">
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
          <b-nav-item to="/courses">{{i18n.courses}}</b-nav-item>
          <b-nav-item to="/mycourses">{{i18n.mycourses}}</b-nav-item>
        </b-navbar-nav>

        <!-- right links -->
        <b-navbar-nav v-if="!auth.online" class="ml-auto">
          <b-nav-item to="/register">{{i18n.register}}</b-nav-item>
          <b-nav-item to="/login">{{i18n.login}}</b-nav-item>
        </b-navbar-nav>

        <b-navbar-nav v-if="auth.online" class="ml-auto">
          <b-nav-item to="/profile">{{i18n.profile}}</b-nav-item>
          <b-nav-item @click="logout">{{i18n.logout}}</b-nav-item>
        </b-navbar-nav>

        <b-navbar-nav>
          <b-nav-item-dropdown right>

            <template v-slot:button-content>
              <img :src="icons[profile.lang]" class="lang-icon">
            </template>

            <b-dropdown-item-btn v-for="(svg, lang) in icons"
                                 :key="lang"
                                 @click="setLang(lang)">
              <img :src="svg" :alt="lang" class="lang-icon lang-icon-list">
            </b-dropdown-item-btn>

          </b-nav-item-dropdown>
        </b-navbar-nav>

      </b-collapse>

    </b-navbar>
  </div>

</template>

<script>
import { mapState } from 'vuex'

import http from 'axios'
import {icons} from '@/misc/langs.js'
import * as i18n from '@/i18n/header'

export default {
  name: 'ly-header',
  data () {
    return {
      icons
    }
  },
  watch: {
    '$route': 'checkCourse'
  },
  computed: {
    ...mapState(['profile', 'auth', 'note']),
    i18n () {
      return i18n[this.$store.state.profile.lang]
    }
  },
  mounted () {
    document.title = "Laya"
    this.checkCourse()
    this.$forceUpdate()
    let store = this.$store
    /*
     * get browser locale */
    http.get('lang')
      .then(function ({data}) {
        store.commit('setLang', data)
      })
      .catch(function () {
        store.commit('setLang', 'de')
      })
  },
  methods: {
    toggleMedia (type) {
      this.$store.commit('toggleMedia', type)
    },
    checkCourse () {
      this.isCourse = /courses[/]./.test(location.hash)
      this.$forceUpdate()
    },
    setLang (lang) {
      this.$store.commit('setLang', lang)
      this.$forceUpdate()
    },
    logout () {
      this.$ls.remove('auth')
      this.$store.commit('logout')
      this.$router.push('/login')
    }
  },
  components: {
  }
}
</script>

<style scoped>
*:focus {
  outline: 2px dashed deepskyblue;
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

<template>
  <div id="app">
    <ly-header></ly-header>
    <router-view></router-view>
    <ly-footer></ly-footer>
  </div>
</template>

<script>
import lyHeader from "@/components/header"
import lyFooter from "@/components/footer"

export default {
  name: "app",
  watch: {
    $route: "relocateUnauthorized"
  },
  created() {
    /*
     * restore auth from local storage */
    let auth = this.$ls.get("auth", false);
    if (!auth) return;
    console.log("Auth restored");
    this.$store.commit("login", auth);
    this.$store.dispatch("fetchProfile");
    this.$store.dispatch("fetchRole");
  },
  methods: {
    relocateUnauthorized() {
      /* 
       * pass access if auth true */
      if (this.$ls.get("auth", false)) return;

      const publicURLs = [
        "#/",
        "#/login",
        "#/register",
        "#/imprint",
        "#/privacy"
      ];

      /* target url is public */
      if (publicURLs.includes(location.hash)) return;

      /* auth first */
      this.$router.push("/login");
    }
  },
  components: { lyHeader, lyFooter }
};
</script>

<style>
html,
body {
  font-family: "Karla", sans-serif !important;

  font-size: 18px;
  line-height: 26px;
}

.ly-bg-grey {
  background-color: #ebece7;
}

.ly-bg-author {
  background-color: #abd3ff;
}

.dropdown-menu {
  min-width: 5rem;
  border-radius: 2px solid black;
}
</style>

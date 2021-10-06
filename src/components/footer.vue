<!--
Filename: footer.vue
Use: Shows the whole footer area
Creator: core
Date: unknown
Dependencies: @/mixins/locale.vue
-->

<template>
  <footer
    id="ly-footer"
    :class="langIsAr? 'text-right' : 'text-left'"
  >
    <div class="container" style="border-top: 0.2rem solid black; padding-top: 1rem;">
      <div class="row">
        <div class="col-9 col-lg-9">
          <!-- socials row -->
         <div class="row no-gutters">
            <!-- social media links -->
            <div class="col" style="padding-bottom: 1rem">
              <a
                href="#"
                target="_blank"
                class="social-link"
              >
                <img src="../assets/facebook.svg" alt="Facebook Link">
              </a>
              <a href="#" target="_blank" class="social-link">
                <img src="../assets/twitter.svg" alt="Twitter Link">
              </a>
              <a href="mailto:yesil.diren@uni-vechta.de" target="_blank" class="social-link">
                <img src="../assets/email.svg" alt="Email">
              </a>
              <a href="#" target="_blank" class="social-link">
                <img src="../assets/vimeo.svg" alt="Vimeo Link">
              </a>
              <a href="#" target="_blank" class="social-link">
                <i class="fas fa-heart" style="color: red"></i>
              </a>
            </div>
          </div>

          <div class="row">
            <div class="col">
              <p>
                <b>Powered by LAYA</b>
              </p>
              <p>
                <b>{{ i18n['footer.laya'] }}</b>
              </p>
            </div>
          </div>

          <div class="row">
            <div class="col">
              <router-link :to="{ name: 'imprint-view' }">
                <u class="text-dark">{{ i18n['imprint'] }}</u>
              </router-link>
              <span>/</span>
              <router-link :to="{ name: 'privacy-view' }">
                <u class="text-dark">{{ i18n['footer.privacy'] }}</u>
              </router-link>
            </div>
          </div>
        </div>

        <!-- partner logo -->
        <div class="col-3 col-lg-3">
          <a href="#">
            <img
              src="../assets/logo.svg"
              alt="Laya - Learn as you are"
              class="w-100"
            >
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>


<script>
import { locale } from '@/mixins'

export default {
  name: 'ly-footer',

  mixins: [
    locale
  ]
}
</script>

<style scoped>
*:focus {
  outline: 2px dashed deepskyblue;
  outline-offset: 5px;
}

footer {
  margin-top: 5rem;
  margin-bottom: 10rem;
}

.social-link:first-child {
  margin-left: 0px;
}
.social-link {
  margin: 5px;
}
</style>

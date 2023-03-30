<!--
Filename: footer.vue
Use: Shows the whole footer area
Creator: core
Date: unknown
Dependencies: @/mixins/locale.vue
-->

<template>
  <footer
    id="footer"
    :class="langIsAr? 'text-right' : 'text-left'"
  >
    <div
      class="container"
      style="border-top: 0.2rem solid black; padding-top: 1rem;"
    >
      <div class="row">
        <div class="col-9 col-lg-9">
          <!-- socials row -->
          <div class="row no-gutters">
            <!-- social media links -->
          </div>

          <div class="row">
            <div class="col">
              <p>
                <b>Powered by LAYA</b>
              </p>
              <p>
                <b>{{ y18n('footer.laya') }}</b>
              </p>
            </div>
          </div>

          <div class="row">
            <div class="col">
              <router-link :to="{ name: 'imprint-view' }">
                <u class="text-dark">{{ y18n('imprint') }}</u>
              </router-link>
              <span>/</span>
              <router-link :to="{ name: 'privacy-view' }">
                <u class="text-dark">{{ y18n('footer.privacy') }}</u>
              </router-link>
            </div>
          </div>
        </div>

        <!-- partner logo -->
        <div class="col-3 col-lg-3">
          <img
            src="../../assets/images/logo-iraq-m.png"
            alt="Laya - Learn as you are"
            class="w-100"
          >
        </div>
      </div>
      <scroll-to-top tabindex="0"></scroll-to-top>
    </div>
  </footer>
</template>

<script>
import { locale } from '@/mixins'

export default {
  name: 'Footer',

  components: {
    ScrollToTop: () => import('@/components/helpers/scroll-to-top.vue')
  },

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
  margin-left: 0;
}
.social-link {
  margin: 5px;
}
</style>

<!--
  Filename: verify.vue
  Use: Verify user email
  Creator: cmc
  Since: v1.1.0
-->
<template>
  <div
    class="container text-center p-5"
    :class="langIsAr? 'text-right' : 'text-left'"
  >
    <div class="container-fluid">
      <h1> {{ y18n('verify.header') }} </h1>
      <div v-if="!verified">
        <p>
          {{ y18n('verify.description') }}
        </p>
        <p>
          <b-button
            variant="success"
            @click="verifyUser"
          >
            {{ y18n('verify.button') }}
          </b-button>
        </p>
      </div>
      <div
        v-else
        class="container-fluid"
      >
        <div v-if="success">
          {{ y18n('verify.success') }}
        </div>
        <div v-else-if="fail">
          <p>{{ y18n('verify.fail') }}</p>
          <p>
            <router-link to="/">
              {{ y18n('verify.backHome') }}
            </router-link>
          </p>
        </div>
        <div v-else-if="busy">
          <i class="fas fa-spinner fa-spin"></i>
          {{ y18n('verify.ongoing') }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { locale } from '@/mixins'

export default {
  name: 'Verify',
  mixins: [
    locale
  ],
  data () {
    return {
      busy: false,
      fail: false,
      success: false,
      verified: false
    }
  },
  created () {
    this.verifyUser()
  },
  methods: {
    /**
     * @function fire request to verify, if successful, show a message before redirecting
     * @author cmc
     * @since v1.3.0
     */
    verifyUser () {
      this.verified = true
      this.busy = true
      const { uid, token } = this.$route.query
      this.$store.dispatch('accountVerify', { uid, token })
        .then(() => {
          this.success = true
          setTimeout(() => {
            this.$router.push({
              name: 'login',
              params: { verified: 'true' }
            })
          }, 2500)
        })
        .catch(() => { this.fail = true })
        .finally(() => {
          this.busy = false
        })
    }
  }
}
</script>

<style scoped>

</style>

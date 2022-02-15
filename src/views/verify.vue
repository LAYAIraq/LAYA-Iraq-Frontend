<template>
  <div class="container text-center">
    <div v-if="success">
      {{ i18n['verify.success'] }}
    </div>
    <div v-else-if="busy">
      <i class="fas fa-spinner"></i>
    </div>
  </div>
</template>

<script>
import http from 'axios'
import { locale } from '@/mixins'
export default {
  name: 'Verify',
  mixins: [
    locale
  ],
  data () {
    return {
      busy: false,
      success: false
    }
  },
  created () {
    this.verify()
  },
  methods: {
    verify () {
      this.busy = true
      http.get(`/accounts/confirm?uid=${this.$route.query.uid}&token=${this.$route.query.token}`)
        .then(() => {
          this.success = true
        })
        .catch((err) => {
          console.error(err)
        })
        .finally(() => {
          this.busy = false
          // noinspection JSCheckFunctionSignatures
          this.$nextTick(() => this.$router.push({
            name: 'login-view',
            params: { verified: true }
          }))
        })
    }
  }
}
</script>

<style scoped>

</style>

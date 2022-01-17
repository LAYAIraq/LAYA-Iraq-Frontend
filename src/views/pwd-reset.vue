<template>
  <div class="container text-center">
    <!-- password -->
    <div class="row">
      <PasswordInput
        :input-pwd="pwd"
        :input-pwd-repeat="pwdRepeat"
        :label-icons-only="false"
        :label-width="3"
        @compliantLength="setCompliance"
      ></PasswordInput>
    </div>

  </div>
</template>

<script>
import http from 'axios'
import { locale } from '@/mixins'
import PasswordInput from '@/components/password-input'

export default {
  name: 'passwordReset',
  components: {
    PasswordInput
  },
  mixins: [
    locale
  ],
  data() {
    return {
      compliantPwd: false,
      pwd: '',
      pwdRepeat: ''
    }
  },

  methods: {

    setCompliance(bool) {
      this.compliantPwd = bool
    },


    setPwd() {
      http.post('/accounts/set-pwd/') // TODO: make setPassword remotely available
    }
  }

}
</script>

<style scoped>

</style>

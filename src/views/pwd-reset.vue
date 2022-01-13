<template>
  <div class="container text-center">
    <!-- password -->
    <div class="form-group row" :class="{error: errPwds}">
      <div class="col-1 col-form-label">

        <i class="fas fa-key"></i>

      </div>
      <div class="col">
        <input
          v-model="pwd1"
          :placeholder="i18n['pwdPH']"
          :aria-label="i18n['pwdPH']"
          type="password"
          :disabled="submitOk"
          class="w-100"
          aria-describedby="pwd-err"
        >
      </div>
    </div>
    <div class="form-group row" :class="{error: errPwds}">
      <div class="col-1 col-form-label">
        <i class="fas fa-redo-alt"></i>
      </div>
      <div class="col">
        <input v-model="pwd2" :placeholder="i18n['pwd2PH']" :aria-label="i18n['pwd2PH']" type="password"
               :disabled="submitOk" class="w-100" aria-describedby="pwd-err">
      </div>
    </div>
    <div
      id="pwd-err"
      class="text-center"
      :class="{'d-none': !errPwds}"
      :aria-hidden="!errPwds"
      v-show="errPwds">
      {{ i18n['register.pwdErr'] }}
    </div>
    <div class="form-group row">
      <div class="col-sm-9">
        <label for="pwdMeter" class="col-sm-3 col-form-label">{{ i18n['profile.pwdStrength'] }}</label>
        <password id="pwdMeter" v-model="pwd2" :strength-meter-only="true" @feedback="showFeedback"></password>
        <strong id="testPwdMeter" class="form-text text-center"> {{ warnings }} </strong>
      </div>
    </div>
  </div>
</template>

<script>
import http from 'axios'
import { locale } from '@/mixins'
import Password from 'vue-password-strength-meter'

export default {
  name: 'passwordReset',
  components: {
    Password
  },
  mixins: [
    locale
  ],
  data() {
    return {
      busy: false,
      success: false
    }
  },

  methods: {
    setPwd() {
      http.post('/accounts/set-pwd/') // TODO: make setPassword remotely available
    }
  }

}
</script>

<style scoped>

</style>

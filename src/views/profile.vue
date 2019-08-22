<template>
  <div>
    <div class="container-fluid">
      <div class="row">
        <!-- profile header -->
        <div class="bg-dark w-100 pt-5 pb-3">
          <!-- avatar -->
          <img
            v-if="avatar !== ''"
            :src="avatarURL"
            alt="Avatar"
            class="d-block rounded-circle mx-auto avatar"
          >
          <img
            v-else
            src="../assets/anmelden.svg"
            alt="Avatar"
            class="d-block rounded-circle mx-auto avatar"
          >

          <h1 class="text-center text-light">{{ profile.name }}</h1>
        </div>
      </div>
      <!-- row -->
    </div>
    <!-- container -->

    <div class="container">
      <div class="row">
        <form class="w-100" style="margin-top: 1rem">
          <h1>{{ msg.title }}</h1>
          <hr>

          <!-- Name -->
          <div class="form-group row">
            <label for="username" class="col-sm-3 col-form-label">{{ msg.namePH }}</label>
            <div class="col-sm-9">
              <input
                id="username"
                type="text"
                class="form-control"
                v-model="profile.name"
                readonly
                tabindex="-1"
              >
            </div>
          </div>

          <!-- Email -->
          <div class="form-group row">
            <label for="email" class="col-sm-3 col-form-label">{{ msg.emailPH }}</label>
            <div class="col-sm-9">
              <input
                id="email"
                type="text"
                class="form-control"
                v-model="profile.email"
                readonly
                tabindex="-1"
              >
            </div>
          </div>

          <hr>
          <!-- Old Password -->
          <div class="form-group row">
            <label for="oldPwd" class="col-sm-3 col-form-label">{{ msg.oldPwd }}</label>
            <div class="col-sm-9">
              <input
                id="oldPwd"
                type="password"
                class="form-control"
                v-model="oldPwd"
                :placeholder="msg.oldPwd"
                autocomplete="on"
              >
            </div>
          </div>

          <!-- New Password -->
          <div class="form-group row">
            <label for="newPwd" class="col-sm-3 col-form-label">{{ msg.newPwd }}</label>
            <div class="col-sm-9">
              <input
                id="newPwd"
                type="password"
                class="form-control"
                v-model="newPwd"
                :placeholder="msg.newPwd"
                aria-describedby="pwdMsg"
              >
              <strong id="pwdMsg" class="form-text text-center">{{ pwdMsg }}</strong>
            </div>
          </div>
          <hr>

          <!-- Default Media Forms -->
          <div class="form-group row">
            <label class="col-sm-3 col-form-label">{{ msg.defmedia.label }}</label>
            <div class="col-sm-9 d-inline-flex justify-content-between align-items-center">
              <!-- Text -->
              <div class="checkbox-inline">
                <label>
                  <input type="checkbox" v-model="prefs.media.text">
                  {{ msg.defmedia.text }}
                </label>
              </div>

              <!-- Simple -->
              <div class="checkbox-inline">
                <label>
                  <input type="checkbox" v-model="prefs.media.simple">
                  {{ msg.defmedia.simple }}
                </label>
              </div>

              <!-- Video -->
              <div class="checkbox-inline">
                <label>
                  <input type="checkbox" v-model="prefs.media.video">
                  {{ msg.defmedia.video }}
                </label>
              </div>

              <!-- Audio -->
              <div class="checkbox-inline">
                <label>
                  <input type="checkbox" v-model="prefs.media.audio">
                  {{ msg.defmedia.audio }}
                </label>
              </div>
            </div>
          </div>

          <!-- Save Button -->
          <div class="form-group">
            <button
              type="submit"
              @click="submit"
              :disabled="busy"
              class="btn btn-block btn-lg btn-outline-dark"
              style="border-width: 2px"
            >
              <i class="fas fa-check"></i>
              {{ msg.submit }}
            </button>
          </div>
          <strong class="form-text text-center">{{ formMsg }}</strong>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import http from "axios";
import * as i18n from "@/i18n/profile";
import api from "../backend-url.ts";
import { mapState } from "vuex";

export default {
  name: "profile-view",
  data() {
    return {
      avatar: null,
      oldPwd: "",
      newPwd: "",
      pwdMsg: "",
      formMsg: "",
      busy: false,

      prefs: {}
    };
  },
  computed: {
    ...mapState(["profile"]),

    msg: function() {
      return i18n[this.profile.lang];
    },

    avatarURL: function() {
      return `${api()}/storage/img/download/${this.avatar}`;
    }
  },
  created() {
    this.avatar = this.profile.avatar;
    this.prefs = { ...this.profile.prefs };
  },
  methods: {
    submit: function() {
      this.busy = true;
      const ctx = this;
      ctx.formMsg = "";

      const requests = [];

      /* change password request */
      if (ctx.oldPwd !== "" && ctx.newPwd !== "") {
        requests.push(
          http
            .post("accounts/change-password", {
              oldPassword: ctx.oldPwd,
              newPassword: ctx.newPwd
            })
            .catch(err => {
              console.error(err);
              ctx.pwdMsg = ctx.msg.pwdFail;
            })
        );
      }

      /* fire requests */
      http
        .all(requests)
        .then(
          http.spread(() => {
            ctx.formMsg = ctx.msg.submitOk;
          })
        )
        .catch(function(err) {
          console.log(err);
          // ctx.formMsg = ctx.msg.submitFail
        })
        .then(() => {
          ctx.busy = false;
          setTimeout(() => {
            ctx.formMsg = "";
          }, 2000);
        });

      /* update state */
      ctx.$store.commit("setPrefs", ctx.prefs);
    },
    onProfileImg: function(img) {
      if (!img) return;
    }
  },
  components: {
  }
};
</script>

<style scoped>
.avatar {
  width: 7rem;
  height: 7rem;
  border: 2px solid #eee;
  background-color: #eee;
}

.checkbox-inline label {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  margin: 0;
}

.checkbox-inline input {
  margin-right: 5px;
}
</style>

import http from "axios";
import { ids as supportedLangs } from "@/misc/langs.js";

export default {
  state: {
    name: "",
    email: "",
    prefs: {
      media: {
        text: true,
        simple: false,
        video: true,
        audio: false,
      },
    },
    lang: "de",
    avatar: "",
  },
  mutations: {
    setLang(state, lang) {
      state.lang = (supportedLangs.includes(lang)) ? lang : supportedLangs[0];
    },
    toggleMedia(state, type) {
      state.prefs.media[type] = !state.prefs.media[type];
    },
    setPrefs(state, {media}) {
      state.prefs.media = {
        text: media.text,
        simple: media.simple,
        video: media.video,
        audio: media.audio,
      };
    },
    setProfile(state, {username, email, prefs, lang, avatar}) {
      state.name = username;
      state.email = email;
      if (Object.keys(prefs).length > 0) {
        state.prefs = prefs;
      }
      state.lang = lang
      state.avatar = avatar;
    },
  },
  actions: {
    fetchProfile({commit, state, rootState}) {
      http.get(`accounts/${rootState.auth.userId}`)
        .then(({data}) => commit("setProfile", data))
        .catch((err) => console.error(err));
    },
  },
};

import http from "axios";
import { ids as supportedLangs } from "../../misc/langs.js";

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
  getters: {
    profileLang(state: { lang: String }) {
      return state.lang
    }
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
    saveProfile({commit, state, rootState}) {
      http.patch(`accounts/${rootState.auth.userId}`, {...state})
        .catch(err => {
          console.error(err)
        })
    },
    setUserLang({state, rootState}, {lang, uid}) { //save language choice in User's profile
      if(!lang) lang = state.profile.lang
      http.post(`/accounts/${rootState.auth.userId}/change-language`, {lang, uid})
        .then( () => console.log(`Changed language to ${state.lang}`))
        .catch((err) => console.error(err))
    },
  },
};

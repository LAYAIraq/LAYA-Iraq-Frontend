import http from "axios";

import roles from "../../misc/roles";

export default {
  state: {
    userId: 0,
    online: false,
    role: roles.STUDENT,
  },
  getters: {
    isAuthor(state: { role: string }) {
      return state.role === roles.AUTHOR || state.role == roles.ADMIN;
    },
  },
  mutations: {
    setRole(state: { role: any }, role: any) {
      state.role = role;
    },
    login(state: { online: boolean; userId: any }, { id, userId }: any) {
      state.online = true;
      state.userId = userId;

      http.defaults.headers.common.Authorization = id;
    },
    logout(state: { online: boolean; userId: number; role: string }) {
      state.online = false;
      state.userId = -1;
      state.role = roles.STUDENT;

      delete http.defaults.headers.common.Authorization;
    },
  },
  actions: {
    fetchRole({ commit, state }) {
      http
        .get(`accounts/${state.userId}/role`)
        .then(({ data }) => commit("setRole", data.role))
        .catch((err) => console.error(err));
    },
  },
};

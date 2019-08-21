export default {
  state: {
    busy: false,
    myCourses: 0,
  },
  mutations: {
    addMyCourse(state) {
      state.myCourses++;
    },
    clearMyCourse(state) {
      state.myCourses = 0;
    },
    setBusy(state, bool) {
      state.busy = bool;
    },
  },
};

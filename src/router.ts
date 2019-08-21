import Vue from "vue";
import Router from "vue-router";

/* views */
import * as views from "./views";

Vue.use(Router);

export default new Router({
  mode: "hash",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/test",
      name: "test-view",
      component: views.test,
    },
    {
      path: "/",
      name: "root-view",
      component: views.root,
    },
    {
      path: "/register",
      name: "register-view",
      component: views.register,
    },
    {
      path: "/login",
      name: "login-view",
      component: views.login,
    },
    {
      path: "/profile",
      name: "profile-view",
      component: views.profile,
    },
    {
      path: "/courses",
      name: "courses-view",
      component: views.courses,
    },
    {
      path: "/courses/:id",
      name: "course-detail-view",
      component: views.coursedetail,

      children: [
        {
          path: "new-learning-block",
          name: "new-learning-block",
          component: views.newLearningBlock,
        },
        {
          path: "new-learning-assessment",
          name: "new-learning-assessment",
          component: views.newLearningAssessment,
        },
      ],
    },
    {
      path: "/mycourses",
      name: "mycourses-view",
      component: views.mycourses,
    },
    {
      path: "/imprint",
      name: "imprint-view",
      component: views.imprint,
    },
    {
      path: "/privacy",
      name: "privacy-view",
      component: views.privacy,
    },
  ],
});

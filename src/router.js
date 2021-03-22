/**
 * Filename: router.js
 * Use: register all possible routes
 * Creator: core
 * Date: unknown
 * Dependencies:
 *  vue,
 *  vue-router,
 *  @/views
 */

import Vue from 'vue';
import Router from 'vue-router';
/* views */
import * as views from './views';
Vue.use(Router);
export default new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes: [
    /* {
      path: '/test',
      name: 'test-view',
      component: views.test
    }, */
    {
      path: '/',
      //redirect: '/login', experimental starting page
      name: 'root-view',
      component: views.root
    },
    {
      path: '/register',
      name: 'register-view',
      component: views.register
    },
    {
      path: '/login',
      name: 'login-view',
      component: views.login
    },
    {
      path: '/profile',
      name: 'profile-view',
      component: views.profile
    },
    {
      path: '/courses',
      name: 'courses-view',
      component: views.courses
    },
    {
      path: '/courses/:name/:step',
      name: 'course-detail-view',
      component: views.courseDetailView,
      props: true,

      children: [

        {
          path: 'edit',
          name: 'edit-course-wrapper',
          component: views.editCourseWrapper,
          props: true
        },
        {
          path: 'new/:type',
          name: 'new-course-content-view',
          component: views.editCourseWrapper,
          props: true
        },
        {
          path: 'editNav',
          name: 'edit-course-nav-view',
          component: views.editCourseNav,
        }
      ]
    },
    
    {
      path: '/mycourses',
      name: 'mycourses-view',
      component: views.mycourses
    },
    
    {
      path: '/imprint',
      name: 'imprint-view',
      component: views.imprint
    },
    {
      path: '/privacy',
      name: 'privacy-view',
      component: views.privacy
    }
  ]
});

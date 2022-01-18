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
  mode: 'history',
  base: '/',
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
      path: '/admin',
      name: 'admin-panel',
      component: views.adminPanel
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
      path: '/notifications',
      name: 'notification-view',
      component: views.notifications,
      props: true
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
          component: views.editCourseNav
        }
      ]
    },
    {
      path: '/courses/:name/:step/flag/:id',
      name: 'flag-view',
      component: views.flag,
      props: true
    },
    // {
    //   path: '/mycourses',
    //   name: 'mycourses-view',
    //   component: views.mycourses
    // },
    {
      path: '/imprint',
      name: 'imprint-view',
      component: views.imprint
    },
    {
      path: '/privacy',
      name: 'privacy-view',
      component: views.privacy
    },
    {
      path: '/verify',
      name: 'verify-view',
      component: views.verify
    },
    {
      path: '/reset-password',
      name: 'ResetPassword',
      component: views.pwdReset
    },
    {
      path: '/:catchAll(.*)',
      component: views.notFound,
      name: 'not-found'
    }
  ]
})

export const publicRoutes =
 [
  '/',
  '/login',
  '/register',
  '/imprint',
  '/privacy',
  '/reset-password'
 ]

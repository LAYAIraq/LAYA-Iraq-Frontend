/**
 * Filename: router.ts
 * Use: register all possible routes
 * Creator: core
 * Date: unknown
 * Dependencies:
 *  vue,
 *  vue-router,
 *  @/views
 */

import Vue from 'vue'
import Router from 'vue-router'

/* dynamic imports for lazy loading */
const AdminPanel = () => import('./views/admin-panel.vue')
const CourseDetail = () => import('./views/course-detail.vue')
const CourseEditWrapper = () => import('./views/course-edit-wrapper.vue')
const CourseNavEdit = () => import('./views/edit-course-nav.vue')
const Courses = () => import('./views/courses.vue')
const EditorPanel = () => import('./views/editor-panel.vue')
const Flag = () => import('./views/flag.vue')
const Imprint = () => import('./views/imprint.vue')
const Login = () => import('./views/login.vue')
const NotFound = () => import('./views/not-found.vue')
const Notifications = () => import('./views/notifications.vue')
const PasswordReset = () => import('./views/pwd-reset.vue')
const Privacy = () => import('./views/privacy.vue')
const Profile = () => import('./views/profile.vue')
const Register = () => import('./views/register.vue')
const Root = () => import('./views/root.vue')
const Verify = () => import('./views/verify.vue')

Vue.use(Router)
export default new Router({
  mode: 'hash',
  base: '/',
  routes: [
    /* {
      path: '/test',
      name: 'test-view',
      component: views.test
    }, */
    {
      path: '/',
      // redirect: '/login', experimental starting page
      name: 'root-view',
      component: Root
    },
    {
      path: '/admin',
      name: 'admin-panel',
      component: AdminPanel
    },
    {
      path: '/editor',
      name: 'editor-panel',
      component: EditorPanel
    },
    {
      path: '/register',
      name: 'register-view',
      component: Register
    },
    {
      path: '/login',
      name: 'login-view',
      component: Login
    },
    {
      path: '/notifications',
      name: 'notification-view',
      component: Notifications,
      props: true
    },
    {
      path: '/profile',
      name: 'profile-view',
      component: Profile
    },
    {
      path: '/courses',
      name: 'courses-view',
      component: Courses
    },
    {
      path: '/courses/:coursePath',
      name: 'course-detail-view',
      component: CourseDetail,
      props: true,

      children: [

        {
          path: 'edit',
          name: 'edit-course-wrapper',
          component: CourseEditWrapper,
          props: true
        },
        {
          path: 'new/:type',
          name: 'new-course-content-view',
          component: CourseEditWrapper,
          props: true
        },
        {
          path: 'editNav',
          name: 'edit-course-nav-view',
          component: CourseNavEdit
        }
      ]
    },
    {
      path: '/courses/:name/:step/flag/:id',
      name: 'flag-view',
      component: Flag,
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
      component: Imprint
    },
    {
      path: '/privacy',
      name: 'privacy-view',
      component: Privacy
    },
    {
      path: '/verify',
      name: 'verify-view',
      component: Verify
    },
    {
      path: '/reset-password',
      name: 'ResetPassword',
      component: PasswordReset
    },
    {
      path: '/:catchAll(.*)',
      component: NotFound,
      name: 'not-found'
    }
  ]
})

export const publicRoutes = [
  '/',
  '/login',
  '/register',
  '/imprint',
  '/privacy',
  '/reset-password',
  '/verify'
]

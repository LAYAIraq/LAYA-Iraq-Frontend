/**
 * Filename: router.ts
 * Use: register all possible routes
 * Creator: core
 * Since: v1.0.0
 */

import Vue from 'vue'
import Router from 'vue-router'

/* dynamic imports for lazy loading */
const AdminPanel = () => import('@/components/user-views/admin-panel.vue')
const Chat = () => import('@/components/collab-tools/chat.vue')
const CollabTools = () => import('@/components/collab-tools/collab-tools.vue')
const Course = () => import('./components/course/course.vue')
const CourseContent = () => import('./components/course/course-edit/course-content.vue')
const CourseNav = () => import('./components/course/course-nav/course-nav.vue')
const CourseNavFollowEdit = () => import('./components/course/course-nav/course-nav-follow-edit.vue')
const CourseList = () => import('./components/course/course-list/course-list.vue')
const EditorPanel = () => import('@/components/user-views/editor-panel.vue')
const Flag = () => import('./components/course/flag/flag.vue')
const Imprint = () => import('./components/general/imprint.vue')
const Login = () => import('./components/general/login.vue')
const NotFound = () => import('./components/general/not-found.vue')
const Notifications = () => import('./components/notifications/notifications.vue')
const PasswordReset = () => import('./components/helpers/password-reset.vue')
const Privacy = () => import('./components/general/privacy.vue')
const Profile = () => import('./components/user-views/profile.vue')
const Register = () => import('./components/general/register.vue')
const LandingPage = () => import('./components/general/landing-page.vue')
const Verify = () => import('./components/helpers/verify.vue')

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
      name: 'landing-page',
      component: LandingPage
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
      name: 'register',
      component: Register
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/notifications',
      name: 'notifications',
      component: Notifications,
      props: true
    },
    {
      path: '/profile',
      name: 'profile',
      component: Profile
    },
    {
      path: '/collaboration',
      name: 'collaboration',
      component: CollabTools
    },
    {
      path: '/chat',
      name: 'chat',
      component: Chat
    },
    {
      path: '/courses',
      name: 'course-list',
      component: CourseList
    },
    {
      path: '/courses/:name/:coursePath?',
      name: 'course',
      component: Course,
      props: true,

      children: [
        {
          path: 'edit',
          name: 'course-content-edit',
          component: CourseContent,
          props: true
        },
        {
          path: 'new/:type',
          name: 'course-content-new',
          component: CourseContent,
          props: true
        },
        {
          path: 'edit-nav',
          name: 'course-nav',
          component: CourseNav
        },
        {
          path: 'edit-follow?id=:contentId',
          name: 'content-follow-edit',
          component: CourseNavFollowEdit,
          props: true
        }
      ]
    },
    {
      path: '/courses/:name/:coursePath?/flag/:id',
      name: 'flag',
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
      name: 'imprint',
      component: Imprint
    },
    {
      path: '/privacy',
      name: 'privacy',
      component: Privacy
    },
    {
      path: '/verify',
      name: 'verify',
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
  '/verify',
  '/:catchAll(.*)'
]

/**
 * Filename: index.ts
 * Use: expose views to module build
 * Creator: core
 * Date: unknown
 * Dependencies: none
 */

// public views
export { default as imprint } from './imprint.vue'
export { default as login } from './login.vue'
export { default as privacy } from './privacy.vue'
export { default as root } from './root.vue'
export { default as register } from './register.vue'

// views for logged users
// export { default as mycourses } from './mycourses.vue'
export { default as courses } from './courses.vue'
export { default as courseDetailView } from './course-detail.vue'
export { default as flag } from './flag.vue'
export { default as notFound } from './not-found.vue'
export { default as notifications } from './notifications.vue'
export { default as profile } from './profile.vue'

// views for verification links
export { default as pwdReset } from './pwd-reset.vue'
export { default as verify } from './verify.vue'

// views for teachers
export { default as adminPanel } from './admin-panel.vue'
export { default as courseEdit } from './course-edit.vue'
export { default as editCourseNav } from './edit-course-nav.vue'
export { default as editCourseWrapper } from './course-edit-wrapper.vue'

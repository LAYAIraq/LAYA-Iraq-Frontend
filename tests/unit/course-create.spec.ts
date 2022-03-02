import { shallowMount } from '@vue/test-utils'
import CourseCreate from '@/components/authoring/course-create.vue'

describe('Course create', () => {
  // const CourseCreate = () => import('../../src/components/authoring/course-create.vue')
  const wrapper = shallowMount(CourseCreate)
  it('exists', () => {
    expect(wrapper)
  })
})

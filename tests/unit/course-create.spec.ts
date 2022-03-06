import { createLocalVue, shallowMount } from '@vue/test-utils'
import Vuex from 'vuex'
// @ts-ignore
import CourseCreate from '@/components/authoring/course-create.vue'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('Course create', () => {
  let getters
  let store
  beforeEach(() => {
    getters = {
      profileLang: () => 'en'
    }
    store = new Vuex.Store({
      getters
    })
  })

  it('detects form errors when name or category not set', () => {
    const wrapper = shallowMount(
      CourseCreate, {
      store,
      localVue
    })
    const vm = wrapper.vm as any
    const nameInput = wrapper.find('#new-course-name')
    nameInput.setValue('some thing')
    expect(vm.formValid).toBeFalsy()
    const catInput = wrapper.find('#new-course-category')
    catInput.setValue('some other thing')
    expect(vm.formValid).toBeTruthy()
    nameInput.setValue('')
    expect(vm.formValid).toBeFalsy()
  })

  it('trims names properly', () => {
    const wrapper = shallowMount(
      CourseCreate, {
        store,
        localVue
      })
    const vm = wrapper.vm as any
    const nameInput = wrapper.find('#new-course-name')
    nameInput.setValue('   some thing   ')
    const catInput = wrapper.find('#new-course-category')
    catInput.setValue('    some other thing    ')
    vm.trimNames()
    expect(vm.newCourse.name).toBe('some thing')
    expect(vm.newCourse.category).toBe('some other thing')
  })

  it('detects reserved characters in new course name or category', () =>{
    const wrapper = shallowMount(
      CourseCreate, {
        store,
        localVue
      }
    )
    const vm = wrapper.vm as any
    const nameInput = wrapper.find('#new-course-name')
    nameInput.setValue('Is anything correct?')
    vm.checkNames()
    expect(vm.newCourseNeedsEncoding).toBeTruthy()
    nameInput.setValue('')
    const catInput = wrapper.find('#new-course-category')
    catInput.setValue('Or can I put these: !=&')
    vm.checkNames()
    expect(vm.newCourseNeedsEncoding).toBeTruthy()
    catInput.setValue('')
    vm.checkNames()
    expect(vm.newCourseNeedsEncoding).toBeFalsy()
  })
})

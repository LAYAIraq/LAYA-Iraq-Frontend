import { createLocalVue, shallowMount } from '@vue/test-utils'
import Vuex from 'vuex'
import CourseCreate from '@/components/authoring/course-create.vue'
import 'regenerator-runtime/runtime'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('Course create', () => {
  let getters
  let store
  let wrapper
  let vm
  let nameInput
  let catInput
  beforeEach(() => {
    getters = {
      profileLang: () => 'en'
    }
    store = new Vuex.Store({
      getters
    })
    wrapper = shallowMount(
      CourseCreate, {
        store,
        localVue
      }
    )
    vm = wrapper.vm as any
    nameInput = wrapper.find('#new-course-name')
    catInput = wrapper.find('#new-course-category')
  })

  it('detects form errors when name or category not set', async () => {
    await nameInput.setValue('some thing')
    expect(vm.formValid).toBeFalsy()
    await catInput.setValue('some other thing')
    expect(vm.formValid).toBeTruthy()
    await nameInput.setValue('')
    expect(vm.formValid).toBeFalsy()
  })

  it('sets the correct data properties', async () => {
    await nameInput.setValue('Course Name')
    await catInput.setValue('Course Category')
    expect(vm.newCourse).toStrictEqual({ name: 'Course Name', category: 'Course Category' })
  })

  it('trims names properly', async () => {
    await nameInput.setValue('   some thing   ')
    await catInput.setValue('    some other thing    ')
    vm.trimNames()
    expect(vm.newCourse.name).toBe('some thing')
    expect(vm.newCourse.category).toBe('some other thing')
  })

  it('detects reserved characters in new course name or category', async () => {
    await nameInput.setValue('Is anything correct?')
    vm.checkNames()
    expect(vm.newCourseNeedsEncoding).toBeTruthy()
    await nameInput.setValue('')
    await catInput.setValue('Or can I put these: !=&')
    vm.checkNames()
    expect(vm.newCourseNeedsEncoding).toBeTruthy()
    await catInput.setValue('')
    vm.checkNames()
    expect(vm.newCourseNeedsEncoding).toBeFalsy()
  })
})

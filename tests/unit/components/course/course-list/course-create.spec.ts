import { createLocalVue, shallowMount } from '@vue/test-utils'
import Vuex from 'vuex'
import CourseCreate from '@/components/course/course-list/course-create.vue'
import 'regenerator-runtime/runtime'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('Course create', () => {
  let wrapper
  let vm
  let actions
  let nameInput
  let catInput
  let button
  beforeEach(() => {
    const getters = {
      courseList: () => [
        { name: 'existing' }
      ],
      profileLanguage: () => 'en',
      userId: () => 1
    }
    actions = {
      courseCreate: () => Promise.resolve()
    }
    const store = new Vuex.Store({
      getters,
      actions
    })
    wrapper = shallowMount(
      CourseCreate, {
        mocks: {
          $router: {
            push: jest.fn()
          }
        },
        store,
        localVue
      }
    )
    vm = wrapper.vm as any
    nameInput = wrapper.find('#new-course-name')
    catInput = wrapper.find('#new-course-category')
    button = wrapper.find('button')
  })

  it('detects form errors when name or category not set', async () => {
    await nameInput.setValue('some thing')
    expect(button.attributes('disabled')).toBeTruthy()
    await catInput.setValue('some other thing')
    expect(button.attributes('disabled')).toBeFalsy()
    await nameInput.setValue('')
    expect(button.attributes('disabled')).toBeTruthy()
  })

  it('sets the correct data properties', async () => {
    await nameInput.setValue('Course Name')
    await catInput.setValue('Course Category')
    expect(vm.newCourse).toStrictEqual({ name: 'Course Name', category: 'Course Category' })
  })

  it('trims names properly', async () => {
    await nameInput.setValue('   some thing   ')
    await catInput.setValue('    some other thing    ')
    await nameInput.trigger('blur')
    expect(nameInput.element.value).toBe('some thing')
    expect(catInput.element.value).toBe('some other thing')
  })

  it('detects reserved characters in new course name or category', async () => {
    await nameInput.setValue('Is anything correct?')
    await catInput.setValue('something')
    await button.trigger('click')
    const msg = wrapper.find('#error-msg')
    expect(msg.text()).toBeTruthy()
    await nameInput.setValue('no reserved characters')
    await catInput.setValue('Or can I put these: !=&')
    await button.trigger('click')
    expect(msg.text()).toBeTruthy()
    await catInput.setValue('everything fine')
    await button.trigger('click')
    expect(msg.text()).toBeFalsy()
  })

  it('detects existing course names', async () => {
    await nameInput.setValue('existing')
    await catInput.setValue('course')
    await button.trigger('click')
    const msg = wrapper.find('#error-msg')
    expect(msg.text()).toBeTruthy()
  })

  it('redirects to newly created course', async () => {
    await nameInput.setValue('New')
    await catInput.setValue('Course')
    await button.trigger('click')
    expect(vm.$router.push).toHaveBeenCalledWith('/courses/New/1')
  })

  // commented out until enrollment is reactivated
  // it('calls enrollment creation', async () => {
  //   await nameInput.setValue('New')
  //   await catInput.setValue('Course')
  //   await wrapper.find('#new-course-enrollment').setChecked()
  //   await button.trigger('click')
  //   expect(actions.createAuthorEnrollment).toHaveBeenCalledWith(
  //     expect.anything(),
  //     {
  //       name: 'New',
  //       userId: 1
  //     }
  //   )
  // })
})

import { createLocalVue, mount } from '@vue/test-utils'
import Vuex from 'vuex'
import BootstrapVue from 'bootstrap-vue'
import CourseCreate from '@/components/course/course-list/course-create.vue'
import 'regenerator-runtime/runtime'

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(BootstrapVue)

describe('Course create', () => {
  let wrapper
  let vm
  let actions
  let nameInput
  let catInput
  let button
  beforeEach(() => {
    const getters = {
      courseLanguage: () => 'en',
      courseList: () => [
        { name: 'existing' }
      ],
      profile () {
        return {
          fullName: 'name'
        }
      },
      profileLanguage: () => 'en',
      userId: () => 1
    }
    actions = {
      courseCreate: () => Promise.resolve(),
      courseUpdateLanguage: () => Promise.resolve()
    }
    const store = new Vuex.Store({
      getters,
      actions
    })
    wrapper = mount(
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
    await catInput.setValue('individual')
    expect(button.attributes('disabled')).toBeFalsy()
    await nameInput.setValue('')
    expect(button.attributes('disabled')).toBeTruthy()
  })

  it('sets the correct data properties', async () => {
    await nameInput.setValue('Course Name')
    await catInput.setValue('individual')
    expect(vm.newCourse).toStrictEqual(expect.objectContaining({ name: 'Course Name', category: 'individual' }))
  })

  it('trims names properly', async () => {
    await nameInput.setValue('   some thing   ')
    await nameInput.trigger('blur')
    expect(nameInput.element.value).toBe('some thing')
  })

  it('detects reserved characters in new course name or category', async () => {
    await nameInput.setValue('Is anything correct?')
    await catInput.setValue('individual')
    await button.trigger('click')
    const msg = wrapper.find('#error-msg')
    expect(msg.text()).toBeTruthy()
    expect(vm.$router.push).not.toHaveBeenCalled()
    await nameInput.setValue('no reserved characters')
    await button.trigger('click')
    expect(msg.text()).toBeFalsy()
  })

  it('detects existing course names', async () => {
    await nameInput.setValue('existing')
    await catInput.setValue('individual')
    await button.trigger('click')
    const msg = wrapper.find('#error-msg')
    expect(msg.text()).toBeTruthy()
  })

  it('redirects to newly created course', async () => {
    await nameInput.setValue('New')
    await catInput.setValue('individual')
    await button.trigger('click')
    expect(vm.$router.push).toHaveBeenCalledWith('/courses/new')
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

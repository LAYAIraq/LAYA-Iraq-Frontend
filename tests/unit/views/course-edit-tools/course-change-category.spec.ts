import 'regenerator-runtime/runtime'
import { createLocalVue, mount } from '@vue/test-utils'
import CourseChangeCategory from '@/components/course/course-edit/course-category-change.vue'
import Vuex from 'vuex'
import { BootstrapVue } from 'bootstrap-vue'

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(BootstrapVue)

describe('Course changeCategory', () => {
  let getters
  let actions
  let state
  let mutations
  let wrapper
  let button
  let modalButtons
  let saveButton
  beforeEach(() => {
    state = {
      course: {
        name: 'test', category: 'education'
      }
    }
    getters = {
      profileLang: () => 'en',
      course: () => {
        return state.course
      },
      courseList: () => {
        return [
          { name: 'test', category: 'education' },
          { name: 'exists', category: 'test' }
        ]
      }
    }
    actions = {
      fetchCourseList: jest.fn(),
      updateCourse: jest.fn(() => { return Promise.resolve() })
    }
    mutations = {
      changeCourseCategory: jest.fn((category) => { state.course.category = category })
    }
    const store = new Vuex.Store({
      state,
      getters,
      mutations,
      actions
    })
    wrapper = mount(
      CourseChangeCategory, {
        mocks: {
          $route: {
            params: {
              step: 1
            }
          }
        },
        store,
        localVue
      }
    )
    expect(wrapper.exists()).toBeTruthy()
    modalButtons = wrapper.findAll('button')
    modalButtons.wrappers.forEach(wrap => {
      if (wrap.text() === 'Save') {
        saveButton = wrap
      }
      if (wrap.text() === 'Change Category') {
        button = wrap
      }
    })
  })

  it('prompts a modal when clicking button', async () => {
    const modal = wrapper.find('#author-change-category-confirm')
    expect(modal.exists()).toBeTruthy()
    expect(modal.isVisible()).toBeFalsy()
    expect(button.exists()).toBeTruthy()
    await button.trigger('click')
    expect(modal.isVisible()).toBeTruthy()
  })

  it('does not close, highlights input field and shows a warning when no input', async () => {
    await button.trigger('click')
    await saveButton.trigger('click')
    expect(mutations.changeCourseCategory).not.toHaveBeenCalled()
    expect(actions.updateCourse).not.toHaveBeenCalled()
    expect(wrapper.find('#author-change-category-confirm').isVisible()).toBeTruthy()
    expect(wrapper.find('input').classes()).toContain('border-danger')
    expect(wrapper.find('#input-warning').isVisible()).toBeTruthy()
  })

  it('does not close, highlights input field and shows a warning when input is same as current category', async () => {
    await button.trigger('click')
    await wrapper.find('input').setValue('education')
    await saveButton.trigger('click')
    expect(mutations.changeCourseCategory).not.toHaveBeenCalled()
    expect(actions.updateCourse).not.toHaveBeenCalled()
    expect(wrapper.find('#author-change-category-confirm').isVisible()).toBeTruthy()
    expect(wrapper.find('input').classes()).toContain('border-danger')
    expect(wrapper.find('#input-warning').isVisible()).toBeTruthy()
  })

  it('trims input when it has leading and/or trailing spaces', async () => {
    await button.trigger('click')
    await wrapper.find('input').setValue('  test  ')
    await saveButton.trigger('click')
    expect(mutations.changeCourseCategory).toHaveBeenCalledWith(expect.any(Object), 'test')
    expect(actions.updateCourse).toHaveBeenCalled()
    expect(wrapper.find('#author-change-category-confirm').isVisible()).toBeFalsy()
  })

  it('closes modal when input is valid', async () => {
    await button.trigger('click')
    await wrapper.find('input').setValue('newCategory')
    await saveButton.trigger('click')
    expect(mutations.changeCourseCategory).toHaveBeenCalledWith(expect.any(Object), 'newCategory')
    expect(actions.updateCourse).toHaveBeenCalled()
    expect(wrapper.find('#author-change-category-confirm').isVisible()).toBeFalsy()
  })
})

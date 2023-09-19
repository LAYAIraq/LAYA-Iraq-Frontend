import 'regenerator-runtime/runtime'
import { createLocalVue, mount } from '@vue/test-utils'
import CourseChangeCategory from '@/components/course/course-edit/course-category-change.vue'
import Vuex from 'vuex'
import { BootstrapVue } from 'bootstrap-vue'

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(BootstrapVue)

describe('CourseCategoryChange', () => {
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
        name: 'test', category: 'school'
      }
    }
    getters = {
      profileLanguage: () => 'en',
      course: () => {
        return state.course
      },
      courseList: () => {
        return [
          { name: 'test', category: 'school' },
          { name: 'exists', category: 'test' }
        ]
      }
    }
    actions = {
      courseListFetch: jest.fn(),
      courseUpdate: jest.fn(() => { return Promise.resolve() })
    }
    mutations = {
      courseCategoryChange: jest.fn((category) => { state.course.category = category })
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

  it.skip('does not close, highlights input field and shows a warning when input is same as current category', async () => {
    await button.trigger('click')
    await wrapper.find('select').setValue('school')
    await saveButton.trigger('click')
    expect(mutations.courseCategoryChange).not.toHaveBeenCalled()
    expect(actions.courseUpdate).not.toHaveBeenCalled()
    expect(wrapper.find('#author-change-category-confirm').isVisible()).toBeTruthy()
    expect(wrapper.find('select').classes()).toContain('border-danger')
    expect(wrapper.find('#input-warning').isVisible()).toBeTruthy()
  })

  it('closes modal when input is valid', async () => {
    await button.trigger('click')
    await wrapper.find('select').setValue('individual')
    await saveButton.trigger('click')
    expect(mutations.courseCategoryChange).toHaveBeenCalledWith(expect.any(Object), 'individual')
    expect(actions.courseUpdate).toHaveBeenCalled()
    expect(wrapper.find('#author-change-category-confirm').isVisible()).toBeFalsy()
  })
})

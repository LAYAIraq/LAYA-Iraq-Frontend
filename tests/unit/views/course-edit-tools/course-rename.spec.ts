import 'regenerator-runtime/runtime'
import { createLocalVue, mount } from '@vue/test-utils'
import CourseRename from '@/views/course-edit-tools/course-rename.vue'
import Vuex from 'vuex'
import { BootstrapVue } from 'bootstrap-vue'

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(BootstrapVue)

describe('Course rename', () => {
  let getters
  let actions
  let state
  let mutations
  let wrapper
  let button
  let modalButtons
  let renameButton
  beforeEach(() => {
    state = {
      course: {
        name: 'test'
      }
    }
    getters = {
      profileLang: () => 'en',
      course: () => {
        return state.course
      },
      courseList: () => {
        return [
          { name: 'test' },
          { name: 'exists' }
        ]
      }
    }
    actions = {
      updateRenamedCourse: jest.fn(() => { return Promise.resolve() })
    }
    mutations = {
      renameCourse: jest.fn((name) => { state.course.name = name })
    }
    const store = new Vuex.Store({
      state,
      getters,
      mutations,
      actions
    })
    wrapper = mount(
      CourseRename, {
        mocks: {
          $router: {
            replace: jest.fn()
          },
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
      if (wrap.text() === 'Rename') {
        renameButton = wrap
      }
      if (wrap.text() === 'Rename Course') {
        button = wrap
      }
    })
  })

  it('prompts a modal when clicking button', async () => {
    const modal = wrapper.find('#author-rename-course-confirm')
    expect(modal.exists()).toBeTruthy()
    expect(modal.isVisible()).toBeFalsy()
    expect(button.exists()).toBeTruthy()
    await button.trigger('click')
    expect(modal.isVisible()).toBeTruthy()
  })

  it('does not close, highlights input field and shows a warning when no input', async () => {
    await button.trigger('click')
    await renameButton.trigger('click')
    expect(mutations.renameCourse).not.toHaveBeenCalled()
    expect(actions.updateRenamedCourse).not.toHaveBeenCalled()
    expect(wrapper.find('#author-rename-course-confirm').isVisible()).toBeTruthy()
    expect(wrapper.find('input').classes()).toContain('border-danger')
    expect(wrapper.find('#no-input-error').isVisible()).toBeTruthy()
  })

  it('does not close, highlights input field and shows a warning when input is same as current name', async () => {
    await button.trigger('click')
    await wrapper.find('input').setValue('test')
    await renameButton.trigger('click')
    expect(mutations.renameCourse).not.toHaveBeenCalled()
    expect(actions.updateRenamedCourse).not.toHaveBeenCalled()
    expect(wrapper.find('#author-rename-course-confirm').isVisible()).toBeTruthy()
    expect(wrapper.find('input').classes()).toContain('border-danger')
    expect(wrapper.find('#same-name-error').isVisible()).toBeTruthy()
  })

  it('does not close, highlights input field and shows a warning when input is same as another course name', async () => {
    await button.trigger('click')
    await wrapper.find('input').setValue('exists')
    await renameButton.trigger('click')
    expect(mutations.renameCourse).not.toHaveBeenCalled()
    expect(actions.updateRenamedCourse).not.toHaveBeenCalled()
    expect(wrapper.find('#author-rename-course-confirm').isVisible()).toBeTruthy()
    expect(wrapper.find('input').classes()).toContain('border-danger')
    expect(wrapper.find('#duplicate-name-error').isVisible()).toBeTruthy()
  })

  it('trims input when it has leading and/or trailing spaces', async () => {
    await button.trigger('click')
    await wrapper.find('input').setValue('  test  ')
    await renameButton.trigger('click')
    expect(mutations.renameCourse).toHaveBeenCalledWith(expect.any(Object), 'test')
    expect(actions.updateRenamedCourse).toHaveBeenCalled()
    expect(wrapper.find('#author-rename-course-confirm').isVisible()).toBeFalsy()
  })

  it('closes modal when input is valid and changes route', async () => {
    await button.trigger('click')
    await wrapper.find('input').setValue('newName')
    await renameButton.trigger('click')
    expect(mutations.renameCourse).toHaveBeenCalledWith(expect.any(Object), 'newName')
    expect(await actions.updateRenamedCourse).toHaveBeenCalled()
    expect(wrapper.find('#author-rename-course-confirm').isVisible()).toBeFalsy()
    expect(wrapper.vm.$router.replace).toHaveBeenCalledWith(expect.objectContaining({ name: 'course-detail-view', params: { name: 'newName' } }))
  })
})

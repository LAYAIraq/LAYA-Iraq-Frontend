import { createLocalVue, mount } from '@vue/test-utils'
import Vuex from 'vuex'
import { BootstrapVue } from 'bootstrap-vue'
import 'regenerator-runtime/runtime'
import CourseList from '@/components/ly-course-list.vue'

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(BootstrapVue)
const consoleWarn = console.warn
const consoleErr = console.error

describe('laya course list', () => {
  let state
  let getters
  let actions
  let mutations
  let wrapper
  beforeEach(() => {
    jest.spyOn(console, 'warn').mockImplementation(() => {})
    state = {
      courseList: [
        { category: 'Test', courseId: 1, name: 'testtest', properties: { audio: true, simple: true, text: true, video: false, simpleLanguage: true } },
        { category: 'Video', courseId: 2, name: 'Video Test', properties: { audio: true, simple: true, text: true, video: true, simpleLanguage: true } },
        { category: 'Text', courseId: 3, name: 'Text Samples', properties: { audio: true, simple: true, text: true, video: false, simpleLanguage: true } },
        { category: 'SimpleLanguage', courseId: 4, name: 'Simple Language Test', properties: { audio: true, simple: true, text: true, video: false, simpleLanguage: true } }
      ]
    }
    getters = {
      mediaPrefs: () => {
        return { audio: true, simple: true, text: true, video: false }
      },
      profileLang: () => 'en',
      course: () => {
        return {
          name: 'Video Test',
          courseId: 2
        }
      },
      courseList: () => state.courseList
    }
    actions = {
      fetchCourse: jest.fn(() => Promise.resolve()),
      fetchSingleEnrollment: jest.fn(() => Promise.resolve({
        data: { sublist: [] }
      }))
    }
    mutations = {
      unsetCourseUpdated: jest.fn()
    }
    const store = new Vuex.Store({
      state,
      getters,
      mutations,
      actions
    })
    wrapper = mount(CourseList, {
      mocks: {
        $router: {
          push: jest.fn()
        }
      },
      store,
      localVue
    })
  })

  afterEach(() => {
    console.error = consoleErr
    console.warn = consoleWarn
  })

  it('filters correctly', async () => {
    expect(wrapper.findAll('.course').length).toBe(4)
    wrapper.setProps({ filter: 'Test' })
    await localVue.nextTick()
    expect(wrapper.findAll('.course').length).toBe(3)
  })

  it('sets button action correctly', async () => {
    wrapper.setProps({ filter: 'video' })
    await localVue.nextTick()
    const button = wrapper.find('a')
    await button.trigger('click')
    expect(wrapper.findAll('.indicate-icon').length).toBe(1)
    const modal = wrapper.find('#noncomplicit-confirm')
    expect(modal.exists()).toBeTruthy()
  })

  it('sets button action correctly (complicit course)', async () => {
    const button = wrapper.find('a')
    await button.trigger('click')
    expect(wrapper.vm.$router.push).toHaveBeenCalledWith('/courses/testtest/1')
  })

  it('loads new course when button is clicked', async () => {
    await wrapper.find('a').trigger('click') // choose 'testest' course
    expect(actions.fetchCourse).toHaveBeenCalled()
  })

  it('triggers watcher when courseList changes', async () => {
    const watchSpy = jest.spyOn(wrapper.vm, 'getComplicitCourses')
    state.courseList.push({ name: 'somenewcourse', courseId: 6, category: 'another', properties: { audio: true, simple: true, text: true, video: false, simpleLanguage: true } })
    await localVue.nextTick()
    expect(watchSpy).toHaveBeenCalled()
  })
})

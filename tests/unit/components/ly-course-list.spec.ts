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
  let getters
  let actions
  let mutations
  let wrapper
  beforeEach(() => {
    getters = {
      mediaPrefs: () => {
        return { audio: true, simple: true, text: true, video: false }
      },
      profileLang: () => 'en',
      course: () => {},
      courseList: () => [
        { category: 'Test', courseId: 1, name: 'testtest', properties: { simple: true } },
        { category: 'Video', courseId: 2, name: 'Video Test', properties: { video: true } },
        { category: 'Text', courseId: 3, name: 'Text Samples', properties: { text: true } },
        { category: 'SimpleLanguage', courseId: 4, name: 'Simple Language Test', properties: { simpleLanguage: true } }
      ]
    }
    actions = {
      fetchCourse: jest.fn(() => Promise.resolve())
    }
    mutations = {
      unsetCourseUpdated: jest.fn()
    }
    const store = new Vuex.Store({
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
    wrapper.setProps({ filter: 'Video' })
    await localVue.nextTick()
    const button = wrapper.find('a')
    await button.trigger('click')
    await localVue.nextTick()
    // expect(wrapper.vm.$router.push).toHaveBeenCalled()
    expect(wrapper.find('#noncomplicit-confirm').exists()).toBeTruthy()
  })
})

import { createLocalVue, mount } from '@vue/test-utils'
import Vuex from 'vuex'
import { BootstrapVue } from 'bootstrap-vue'
import 'regenerator-runtime/runtime'
import CourseList from '@/components/course/course-list/course-list.vue'

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
        { category: 'Video', courseId: 2, name: 'Video Test', properties: { audio: true, simple: true, text: false, video: true, simpleLanguage: true } },
        { category: 'Text', courseId: 3, name: 'Text Samples', properties: { audio: true, simple: true, text: true, video: false, simpleLanguage: true } },
        { category: 'SimpleLanguage', courseId: 4, name: 'Simple Language Test', properties: { audio: true, simple: true, text: true, video: false, simpleLanguage: true } },
        { category: 'Enrollment', courseId: 5, name: 'Enrollment Test', properties: { audio: false, simple: false, text: true, video: false, simpleLanguage: false, enrollment: true } }
      ]
    }
    getters = {
      mediaPrefs: () => {
        return { audio: true, simple: true, text: true, video: false }
      }, // courses #2 and #5 are not complicit
      profileLang: () => 'en',
      course: () => {
        return {
          name: 'Video Test',
          courseId: 2
        }
      },
      courseList: () => state.courseList,
      userId: () => 1
    }
    actions = {
      createEnrollment: jest.fn(() => Promise.resolve(5)), // mock the createEnrollment action, course #5 needs enrollment
      fetchCourse: jest.fn(() => Promise.resolve()),
      fetchEnrollment: jest.fn(() => Promise.resolve()),
      fetchSingleEnrollment: jest.fn(() => Promise.resolve({
        data: { sublist: [] }
      })),
      fetchUserEnrollments: jest.fn(() => Promise.resolve({
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
    expect(wrapper.findAll('.course').length).toBe(5)
    await wrapper.setProps({ filter: 'Test' })
    expect(wrapper.findAll('.course').length).toBe(4)
  })

  it('sets button action correctly', async () => {
    await wrapper.setProps({ filter: 'video' })
    const button = wrapper.find('a')
    await button.trigger('click')
    expect(wrapper.findAll('.indicate-icon').length).toBe(1)
    const modal = wrapper.find('#noncomplicit-confirm')
    expect(modal.exists()).toBeTruthy()
  })

  it('sets button action correctly (complicit course)', async () => {
    const button = wrapper.find('a')
    await button.trigger('click')
    expect(wrapper.vm.$router.push).toHaveBeenCalledWith({ name: 'course-detail-view', params: { name: 'testtest' }, path: '/courses' })
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

  it('shows enrollment button when enrollment is true', async () => {
    const courses = wrapper.findAll('.course')
    courses.wrappers.forEach((course, i) => {
      const button = course.find('a')
      if (i === 4) {
        expect(button.text()).toBe('Subscribe')
      } else {
        expect(button.text()).toBe('Start')
      }
    })
  })

  it('calls createEnrollment when enrollment button is clicked, changes text', async () => {
    await wrapper.setData({ complicitCourses: new Set([5]) }) // circumvent the content compliance check
    let button = wrapper.findAll('.course').at(4).find('a')
    await button.trigger('click')
    expect(actions.createEnrollment).toHaveBeenCalledWith(expect.any(Object), { courseId: 5, studentId: 1 })
    expect(wrapper.vm.enrolledIn.includes(5)).toBeTruthy()
    await localVue.nextTick()
    button = wrapper.findAll('.course').at(4).find('a')
    expect(button.text()).toBe('Start')
  })

  it('shows \'enrollment\' icon when enrollment is true', async () => {
    const courses = wrapper.findAll('.course')
    courses.wrappers.forEach((course, i) => {
      const propIcons = course.find('.course-props').findAll('i')
      let enrollmentIcon = false
      propIcons.wrappers.forEach((icon) => { // iterate through icons
        if (icon.classes().includes('fa-key')) { // check if video icon is visible
          enrollmentIcon = icon.isVisible()
        }
      })
      if (i === 4) { // course #5 has enrollment: true
        expect(enrollmentIcon).toBeTruthy()
      } else { // all other courses have enrollment: false
        expect(enrollmentIcon).toBeFalsy()
      }
    })
  })

  it('shows \'video\' icon when video is true', async () => {
    const courses = wrapper.findAll('.course')
    courses.wrappers.forEach((course, i) => {
      const propIcons = course.find('.course-props').findAll('i')
      let videoIcon = false
      propIcons.wrappers.forEach((icon) => { // iterate through icons
        if (icon.classes().includes('fa-play-circle')) { // check if video icon is visible
          videoIcon = icon.isVisible()
        }
      })
      if (i === 1) { // course #2 has video: true
        expect(videoIcon).toBeTruthy()
      } else { // all other courses have video: false
        expect(videoIcon).toBeFalsy()
      }
    })
  })

  it('shows \'text\' icon when text is true', async () => {
    const courses = wrapper.findAll('.course')
    courses.wrappers.forEach((course, i) => {
      const propIcons = course.find('.course-props').findAll('i')
      let textIcon = false
      propIcons.wrappers.forEach((icon) => { // iterate through icons
        if (icon.classes().includes('fa-envelope-open-text')) { // check if text icon is visible
          textIcon = icon.isVisible()
        }
      })
      if (i === 1) { // course #2, has text: false
        expect(textIcon).toBeFalsy()
      } else { // all other courses have text: true
        expect(textIcon).toBeTruthy()
      }
    })
  })

  it('shows \'simple language\' icon when simpleLanguage is true', async () => {
    const courses = wrapper.findAll('.course')
    courses.wrappers.forEach((course, i) => {
      const propIcons = course.find('.course-props').findAll('i')
      let simpleIcon = false
      propIcons.wrappers.forEach((icon) => { // iterate through icons
        if (icon.classes().includes('fa-check-circle')) { // check if simple language icon is visible
          simpleIcon = icon.isVisible()
        }
      })
      if (i === 4) { // course #5, has simpleLanguage: false
        expect(simpleIcon).toBeFalsy()
      } else { // all other courses have simpleLanguage: true
        expect(simpleIcon).toBeTruthy()
      }
    })
  })

  it('indicates non-compliant courses regarding user\'s media preferences', async () => {
    expect(wrapper.vm.complicitReady).toBeTruthy()
    expect(wrapper.findAll('.indicate-icon').length).toBe(2)
    const courses = wrapper.findAll('.course')
    courses.wrappers.forEach((course, i) => {
      const warnSign = course.find('.indicate-icon')
      if (i === 1 || i === 4) { // course #2 and #5 are non-compliant
        expect(warnSign.isVisible()).toBeTruthy()
      }
    })
  })

  it('shows modal when non-compliant course is clicked', async () => {
    const courses = wrapper.findAll('.course')
    await courses.at(1).find('a').trigger('click')
    expect(wrapper.find('#noncomplicit-confirm').isVisible()).toBeTruthy()
  })

  it('does not show modal when compliant course is clicked', async () => {
    const courses = wrapper.findAll('.course')
    await courses.at(0).find('a').trigger('click')
    expect(wrapper.find('#noncomplicit-confirm').isVisible()).toBeFalsy()
  })
})

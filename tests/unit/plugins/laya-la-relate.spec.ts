import { createLocalVue, mount } from '@vue/test-utils'
import Vuex from 'vuex'
import { BootstrapVue } from 'bootstrap-vue' // uncomment if component uses Bootstrap
import 'regenerator-runtime/runtime' // for async behavior in tests
import RelateCreate from '@/plugins/laya-la-relate/create.vue'
import RelateEdit from '@/plugins/laya-la-relate/edit.vue'
import RelateView from '@/plugins/laya-la-relate/view.vue'

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(BootstrapVue) // uncomment if component uses bootstrap
const stepInput = {
  title: { text: 'Title', simple: 'Simple Title', id: 1 },
  task: { text: 'Task', simple: 'Simple Task', id: 2 },
  taskAudio: 'task.mp3',
  pairs: [{
    label: 'Description',
    labelSimple: 'Simple Description',
    relation: 0,
    img: 'image.png',
    id: 3,
    audio: 'description.mp3'
  }],
  relations: ['Solution 1', 'Solution 2'],
  relationsSimple: ['Easy Solution 1', 'Easy Solution 2']
}

describe('Relate Create component', () => {
  let wrapper
  let getters
  let state
  beforeEach(() => {
    state = {
      simple: false
    }
    getters = {
      profileLang: () => 'en',
      courseSimple: () => state.simple
    }
    const store = new Vuex.Store({
      state,
      getters
    })
    // @ts-ignore
    wrapper = mount(RelateCreate, { // use mount if component uses bootstrap
      store,
      // stubs: ['router-link'], // uncomment if component has router links
      localVue
    })
  })

  it('shows a helper box when clicking the questionmark', async () => {
    await localVue.nextTick()
    const questionmark = wrapper.find('#questionmark')
    await questionmark.trigger('click')
    const helpText = wrapper.find('#helptext')
    expect(helpText.exists()).toBeTruthy()
  })

  it('has 8 input fields and 1 dropdown with 3 options', async () => {
    await localVue.nextTick()
    expect(wrapper.findAll('input').length).toBe(7)
    expect(wrapper.findAll('select').length).toBe(1)
    expect(wrapper.findAll('textarea').length).toBe(1)
    expect(wrapper.findAll('option').length).toBe(3)
  })

  it('provides alternative input for simple language', async () => {
    await localVue.nextTick()
    state.simple = true
    await localVue.nextTick()
    expect(wrapper.findAll('input').length).toBe(11)
    expect(wrapper.findAll('textarea').length).toBe(2)
  })

  it('allows adding relations and items', async () => {
    const buttons = wrapper.findAll('.btn-primary')
    expect(buttons.length).toBe(2)
    let expectedInputFields = wrapper.findAll('input').length
    await buttons.wrappers.forEach(button => {
      button.trigger('click')
      expect(wrapper.findAll('input').length === ++expectedInputFields)
    })
  })

  it('allows removing relations and items', async () => {
    const buttons = wrapper.findAll('.btn-danger')
    expect(buttons.length).toBe(3)
    let expectedInputFields = wrapper.findAll('input').length
    for (let i = 2; i >= 0; i--) {
      buttons.at(i).trigger('click')
      expect(wrapper.findAll('input').length === --expectedInputFields)
    }
  })
})

describe('Relate edit component', () => {
  it('loads data from store', () => {
    const getters = {
      profileLang: () => 'en',
      courseSimple: () => state.simple,
      content: () => state.content
    }
    const state = {
      simple: false,
      content: [
        { input: stepInput }
      ]
    }
    const store = new Vuex.Store({
      state,
      getters
    })
    // @ts-ignore
    const wrapper = mount(RelateEdit, { // use mount if component uses bootstrap
      mocks: {
        $route: {
          params: {
            step: 1
          }
        }
      },
      store,
      // stubs: ['router-link'], // uncomment if component has router links
      localVue
    })
    expect(wrapper.vm.$data).toStrictEqual(expect.objectContaining(state.content[0].input))
  })
})

describe('Relate View component', () => {
  let wrapper
  let getters
  let state
  let store
  beforeEach(() => {
    state = {
      simple: false
    }
    getters = {
      profileLang: () => 'en',
      courseSimple: () => state.simple,
      courseUpdated: () => false,
      content: () => [
        { input: stepInput }
      ],
      storeBusy: () => false
    }
    store = new Vuex.Store({
      state,
      getters
    })
    // @ts-ignore
    wrapper = mount(RelateView, { // use mount if component uses bootstrap
      mocks: {
        $route: {
          params: {
            step: 1
          }
        }
      },
      store,
      stubs: ['laya-audio-inline', 'laya-flag-icon'], // uncomment if component has router links
      localVue
    })
  })

  it('loads propData correctly', async () => {
    wrapper = mount(RelateView, { // use mount if component uses bootstrap
      mocks: {
        $route: {
          params: {
            step: 1
          }
        }
      },
      propsData: {
        previewData: stepInput
      },
      store,
      stubs: ['laya-audio-inline', 'laya-flag-icon'], // uncomment if component has router links
      localVue
    })
    expect(wrapper.vm.$data).toStrictEqual(expect.objectContaining(stepInput))
  })

  it('loads data from store correctly', async () => {
    expect(wrapper.vm.$data).toStrictEqual(expect.objectContaining(stepInput))
  })

  it('renders data correctly (no simple)', () => {
    expect(wrapper.find('#title').text()).toBe('Title')
    expect(wrapper.find('#task').text()).toBe('Task')
    expect(wrapper.find('.answer-text').text()).toBe('Description')
    const options = wrapper.findAll('option')
    expect(options.length).toBe(3)
    const optionTexts = []
    options.wrappers.forEach(wrap => optionTexts.push(wrap.text()))
    expect(optionTexts).toContain('Solution 1')
    expect(optionTexts).toContain('Solution 2')
  })

  it('renders data correctly (simple)', async () => {
    state.simple = true
    await localVue.nextTick()
    expect(wrapper.find('#title').text()).toBe('Simple Title')
    expect(wrapper.find('#task').text()).toBe('Simple Task')
    expect(wrapper.find('.answer-text').text()).toBe('Simple Description')
    const options = wrapper.findAll('option')
    expect(options.length).toBe(3)
    const optionTexts = []
    options.wrappers.forEach(wrap => optionTexts.push(wrap.text()))
    expect(optionTexts).toContain('Easy Solution 1')
    expect(optionTexts).toContain('Easy Solution 2')
  })

  it('shows modal when checking solutions w/o selecting any answer', async () => {
    await wrapper.find('.btn-link').trigger('click')
    expect(wrapper.find('#relate-missing-warning').exists()).toBeTruthy()
  })

  it('shows solutions after selecting every answer and clickling "check solution"', async () => {
    const options = wrapper.findAll('option')
    await options.at(1).setSelected()
    await wrapper.find('.btn-link').trigger('click')
    expect(wrapper.find('#solutions').exists()).toBeTruthy()
  })

  it('removes selection when clicking "Remove my choices"', async () => {
    const options = wrapper.find('select').findAll('option')
    await options.at(1).setSelected()
    await wrapper.find('.btn-warning').trigger('click')
    wrapper.vm.solution.forEach(sol => expect(sol).toBe(-1))
  })

  it('gives correct feedback on wrong answer', async () => {
    let wrongSolution
    for (const i in wrapper.vm.options) {
      if (wrapper.vm.options[i] === wrapper.vm.relations[1]) {
        wrongSolution = i
      }
    }
    wrapper.setData({ solution: [wrongSolution] })
    await wrapper.find('.btn-link').trigger('click')
    expect(wrapper.find('.text-danger').exists()).toBeTruthy()
  })

  it('gives correct feedback on correct answer', async () => {
    let correctSolution
    for (const i in wrapper.vm.options) {
      if (wrapper.vm.options[i] === wrapper.vm.relations[0]) {
        correctSolution = i
      }
    }
    wrapper.setData({ solution: [correctSolution] })
    await wrapper.find('.btn-link').trigger('click')
    expect(wrapper.find('.text-success').exists()).toBeTruthy()
  })
})

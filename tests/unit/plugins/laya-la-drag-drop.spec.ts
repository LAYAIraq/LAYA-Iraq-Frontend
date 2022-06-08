import { createLocalVue, mount, shallowMount } from '@vue/test-utils'
import Vuex from 'vuex'
import { BootstrapVue } from 'bootstrap-vue'
import DragDropCreate from '@/plugins/laya-la-drag-drop/create.vue'
import DragDropEdit from '@/plugins/laya-la-drag-drop/edit.vue'
import DragDropView from '@/plugins/laya-la-drag-drop/view.vue'
import 'regenerator-runtime/runtime'

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(BootstrapVue)
const contentInput = {
  title: {
    text: 'Title',
    simple: 'Simple Title'
  },
  task: {
    text: 'Task',
    simple: 'Simple Task'
  },
  taskAudio: {
    text: 'audio.mp3',
    simple: 'simple-audio.mp3'
  },
  items: [
    {
      category: 0,
      label: 'Item',
      simple: 'Simple Item'
    }
  ],
  categories: [
    {
      text: 'Cat 1',
      simple: 'Simple Cat 1'
    },
    {
      text: 'Cat 2',
      simple: 'Simple Cat 2'
    }
  ]
}

describe('Drag & drop create component', () => {
  let wrapper
  let getters
  let state
  beforeEach(() => {
    state = {
      courseSimple: true
    }
    getters = {
      courseSimple: () => state.courseSimple,
      profileLang: () => 'en'
    }
    const store = new Vuex.Store({
      state,
      getters
    })
    wrapper = mount(DragDropCreate, {
      directives: {
        'b-tooltip': () => {}
      },
      // stubs: ['b-jumbotron'],
      store,
      localVue
    })
  })

  it('shows a helper box when clicking the questionmark', async () => {
    const questionmark = wrapper.find('#questionmark')
    await questionmark.trigger('click')
    const helpText = wrapper.find('#helptext')
    expect(helpText.exists()).toBeTruthy()
  })

  it('allows simple alternatives for all input', async () => {
    await localVue.nextTick()
    const inputFields = wrapper.findAll('input')
    const textareas = wrapper.findAll('textarea')
    expect(inputFields.wrappers.filter(wrap => wrap.attributes('id').includes('simple')).length).toBe(5)
    expect(textareas.wrappers.filter(wrap => wrap.attributes('id').includes('simple')).length).toBe(1)
  })

  it('allows adding categories and answers', async () => {
    state.courseSimple = false
    await localVue.nextTick()
    const buttons = wrapper.findAll('.btn-primary')
    expect(buttons.length).toBe(2)
    let cats = wrapper.findAll('label').filter(label => label.attributes('for').includes('cat'))
    expect(cats.length).toBe(2)
    await buttons.wrappers[0].trigger('click')
    cats = wrapper.findAll('label').filter(label => label.attributes('for').includes('cat'))
    expect(cats.length).toBe(3)
    let items = wrapper.findAll('label').filter(label => label.attributes('for').includes('item'))
    expect(items.length).toBe(1)
    await buttons.wrappers[1].trigger('click')
    items = wrapper.findAll('label').filter(label => label.attributes('for').includes('item'))
    expect(items.length).toBe(2)
  })

  it('allows deleting categories and items', async () => {
    const deleteButtons = wrapper.findAll('.btn-danger').length
    for (let i = 0; i < deleteButtons; i++) {
      await wrapper.find('.btn-danger').trigger('click')
    }
    expect(wrapper.find('.btn-danger').exists()).toBeFalsy()
  })
})

describe('Drag & Drop edit component', () => {
  let wrapper
  let getters
  let state
  beforeEach(() => {
    getters = {
      courseSimple: () => true,
      content: () => [
        { input: contentInput }
      ],
      profileLang: () => 'en'
    }
    const store = new Vuex.Store({
      state,
      getters
    })
    wrapper = mount(DragDropEdit, {
      directives: {
        'b-tooltip': () => {}
      },
      mocks: {
        $route: {
          params: {
            step: 1
          }
        }
      },
      store,
      localVue
    })
  })

  it('loads data from store', async () => {
    const data = (({ tooltipOn, ...o }) => o)(wrapper.vm.$data)
    expect(data).toStrictEqual(contentInput)
  })
})

describe('Drag & Drop View Component', () => {
  let wrapper
  let getters
  let state
  let store
  beforeEach(() => {
    state = {
      courseSimple: false
    }
    getters = {
      courseSimple: () => state.courseSimple,
      courseUpdated: () => false,
      profileLang: () => 'en',
      storeBusy: () => false
    }
  })

  it('loads and renders prop data correctly', async () => {
    state.courseSimple = false
    getters.content = () => [{}]
    store = new Vuex.Store({
      state,
      getters
    })
    wrapper = shallowMount(DragDropView, {
      mocks: {
        $route: {
          params: {
            step: 1
          }
        }
      },
      propsData: {
        previewData: contentInput
      },
      store,
      stubs: ['laya-audio-inline', 'laya-flag-icon'],
      localVue
    })
    expect(wrapper.vm.$data).toStrictEqual(expect.objectContaining(contentInput))
    const item = wrapper.findAll('.item')
    expect(item.length).toBe(1)
    const rangeInput = item.wrappers[0].findAll('input')
    expect(rangeInput.length).toBe(1)
    expect(rangeInput.at(0).attributes('min')).toBe('0')
    expect(rangeInput.at(0).attributes('max')).toBe('1')
    const labels = item.at(0).findAll('b')
    expect(labels.at(0).text()).toBe('Cat 1')
    expect(labels.at(1).text()).toBe('Cat 2')
    expect(item.at(0).find('h3').text()).toBe('Item')
    expect(wrapper.find('h2').text()).toBe('Title')
    expect(wrapper.find('p').text()).toBe('Task')
  })

  it('loads and renders store data correctly', async () => {
    state.courseSimple = true
    getters.content = () => [{
      input: contentInput
    }]
    store = new Vuex.Store({
      state,
      getters
    })
    wrapper = shallowMount(DragDropView, {
      mocks: {
        $route: {
          params: {
            step: 1
          }
        }
      },
      store,
      stubs: ['laya-audio-inline', 'laya-flag-icon'],
      localVue
    })
    expect(wrapper.vm.$data).toStrictEqual(expect.objectContaining(contentInput))
    const item = wrapper.findAll('.item')
    const rangeInput = item.at(0).findAll('input')
    expect(rangeInput.length).toBe(1)
    expect(rangeInput.at(0).attributes('min')).toBe('0')
    expect(rangeInput.at(0).attributes('max')).toBe('1')
    const labels = item.at(0).findAll('b')
    expect(labels.at(0).text()).toBe('Simple Cat 1')
    expect(labels.at(1).text()).toBe('Simple Cat 2')
    expect(item.at(0).find('h3').text()).toBe('Simple Item')
    expect(wrapper.find('h2').text()).toBe('Simple Title')
    expect(wrapper.find('p').text()).toBe('Simple Task')
  })

  it('marks the correct check (wrong answer)', async () => {
    getters.content = () => [{
      input: contentInput
    }]
    store = new Vuex.Store({
      state,
      getters
    })
    wrapper = shallowMount(DragDropView, {
      mocks: {
        $route: {
          params: {
            step: 1
          }
        }
      },
      store,
      stubs: ['laya-audio-inline', 'laya-flag-icon'],
      localVue
    })
    await localVue.nextTick()
    const rangeInput = wrapper.find('input')
    expect(rangeInput.exists()).toBeTruthy()
    expect(rangeInput.attributes('aria-valuenow')).toBe('1')
    const button = wrapper.find('button')
    expect(button.text()).toBe('Check Solution')
    await button.trigger('click')
    expect(wrapper.find('h3').find('i').classes()).toStrictEqual(expect.arrayContaining(['text-danger']))
  })

  it('marks the correct check (correct answer)', async () => {
    getters.content = () => [{
      input: contentInput
    }]
    store = new Vuex.Store({
      state,
      getters
    })
    wrapper = shallowMount(DragDropView, {
      mocks: {
        $route: {
          params: {
            step: 1
          }
        }
      },
      store,
      stubs: ['laya-audio-inline', 'laya-flag-icon'],
      localVue
    })
    const rangeInput = wrapper.find('input')
    // console.log(rangeInput.element.value)
    await rangeInput.setValue(0)
    const button = wrapper.find('button')
    expect(button.text()).toBe('Check Solution')
    await button.trigger('click')
    expect(wrapper.find('h3').find('i').classes()).toStrictEqual(expect.arrayContaining(['text-success']))
  })

  it('shows the list of correct answers after clicking check', async () => {
    getters.content = () => [{
      input: contentInput
    }]
    store = new Vuex.Store({
      state,
      getters
    })
    wrapper = shallowMount(DragDropView, {
      mocks: {
        $route: {
          params: {
            step: 1
          }
        }
      },
      store,
      stubs: ['laya-audio-inline', 'laya-flag-icon'],
      localVue
    })
    const button = wrapper.find('button')
    expect(button.text()).toBe('Check Solution')
    await button.trigger('click')
    const solutions = wrapper.find('#solutions')
    expect(solutions.exists()).toBeTruthy()
    expect(solutions.findAll('div').length).toBe(2)
  })

  it('calls next content button function', async () => {
    getters.content = () => [{
      input: contentInput
    }]
    store = new Vuex.Store({
      state,
      getters
    })
    wrapper = shallowMount(DragDropView, {
      mocks: {
        $route: {
          params: {
            step: 1
          }
        }
      },
      propsData: {
        onFinish: [
          jest.fn()
        ]
      },
      store,
      stubs: ['laya-audio-inline', 'laya-flag-icon'],
      localVue
    })
    const button = wrapper.find('.btn-primary')
    await button.trigger('click')
    expect(wrapper.vm.onFinish[0]).toHaveBeenCalled()
  })
})

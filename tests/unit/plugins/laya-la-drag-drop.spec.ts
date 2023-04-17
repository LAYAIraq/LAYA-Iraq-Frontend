import { createLocalVue, mount, shallowMount } from '@vue/test-utils'
import Vuex from 'vuex'
import { BootstrapVue } from 'bootstrap-vue'
// import DragDropCreate from '@/plugins/laya-la-drag-drop/create.vue'
import DragDropEdit from '@/plugins/learning-assessment/category-matching/category-matching-edit.vue'
import DragDropView from '@/plugins/learning-assessment/category-matching/category-matching-view.vue'
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

// describe.skip('Drag & drop create component', () => {
//   let wrapper
//   let getters
//   let state
//   beforeEach(() => {
//     state = {
//       courseSimple: true
//     }
//     getters = {
//       courseSimple: () => state.courseSimple,
//       profileLang: () => 'en'
//     }
//     const store = new Vuex.Store({
//       state,
//       getters
//     })
//     wrapper = mount(DragDropCreate, {
//       directives: {
//         'b-tooltip': () => {}
//       },
//       // stubs: ['b-jumbotron'],
//       store,
//       localVue
//     })
//   })
//
//   it('shows a helper box when clicking the questionmark', async () => {
//     const questionmark = wrapper.find('#questionmark')
//     await questionmark.trigger('click')
//     const helpText = wrapper.find('#tooltipText')
//     expect(helpText.exists()).toBeTruthy()
//   })
//
//   it('allows simple alternatives for all input', async () => {
//     await localVue.nextTick()
//     const inputFields = wrapper.findAll('input')
//     const textareas = wrapper.findAll('textarea')
//     expect(inputFields.wrappers.filter(wrap => wrap.attributes('id').includes('simple')).length).toBe(5)
//     expect(textareas.wrappers.filter(wrap => wrap.attributes('id').includes('simple')).length).toBe(1)
//   })
//
//   it('allows adding categories and answers', async () => {
//     state.courseSimple = false
//     await localVue.nextTick()
//     const buttons = wrapper.findAll('.btn-primary')
//     expect(buttons.length).toBe(2)
//     let cats = wrapper.findAll('label').filter(label => label.attributes('for').includes('cat'))
//     expect(cats.length).toBe(2)
//     await buttons.wrappers[0].trigger('click')
//     cats = wrapper.findAll('label').filter(label => label.attributes('for').includes('cat'))
//     expect(cats.length).toBe(3)
//     let items = wrapper.findAll('label').filter(label => label.attributes('for').includes('item'))
//     expect(items.length).toBe(1)
//     await buttons.wrappers[1].trigger('click')
//     items = wrapper.findAll('label').filter(label => label.attributes('for').includes('item'))
//     expect(items.length).toBe(2)
//   })
//
//   it('allows deleting categories and items', async () => {
//     const deleteButtons = wrapper.findAll('.btn-danger').length
//     for (let i = 0; i < deleteButtons; i++) {
//       await wrapper.find('.btn-danger').trigger('click')
//     }
//     expect(wrapper.find('.btn-danger').exists()).toBeFalsy()
//   })
// })

describe('Drag & Drop edit component', () => {
  let wrapper
  let getters
  let state
  beforeEach(() => {
    getters = {
      courseSimple: () => true,
      courseContent: () => ({ test: contentInput }),
      profileLang: () => 'en',
      courseContentPathId: () => () => 'test',
      pathId: () => 'test'
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
            coursePath: 'test'
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
        viewData: contentInput,
        onFinish: [jest.fn()]
      },
      store,
      stubs: ['laya-audio-inline', 'laya-flag-icon'],
      localVue
    })
  })

  it('loads and renders prop data correctly', async () => {
    state.courseSimple = false
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

  it('marks the correct check (wrong answer)', async () => {
    const rangeInput = wrapper.find('input')
    expect(rangeInput.exists()).toBeTruthy()
    expect(rangeInput.attributes('aria-valuenow')).toBe('1')
    const button = wrapper.find('button')
    expect(button.text()).toBe('Check Solution')
    await button.trigger('click')
    expect(wrapper.find('h3').find('i').classes()).toStrictEqual(expect.arrayContaining(['text-danger']))
  })

  it('marks the correct check (correct answer)', async () => {
    const rangeInput = wrapper.find('input')
    // console.log(rangeInput.element.value)
    await rangeInput.setValue(0)
    const button = wrapper.find('button')
    expect(button.text()).toBe('Check Solution')
    await button.trigger('click')
    expect(wrapper.find('h3').find('i').classes()).toStrictEqual(expect.arrayContaining(['text-success']))
  })

  it('shows the list of correct answers after clicking check', async () => {
    const button = wrapper.find('button')
    expect(button.text()).toBe('Check Solution')
    await button.trigger('click')
    const solutions = wrapper.find('#solutions')
    expect(solutions.exists()).toBeTruthy()
    expect(solutions.findAll('div').length).toBe(2)
  })

  it('calls next content button function', async () => {
    const button = wrapper.find('.btn-primary')
    await button.trigger('click')
    expect(wrapper.vm.onFinish[0]).toHaveBeenCalled()
  })
})

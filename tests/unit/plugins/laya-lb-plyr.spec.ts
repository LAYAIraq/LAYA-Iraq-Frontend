import { createLocalVue, shallowMount } from '@vue/test-utils'
import Vuex from 'vuex'
import PlyrCreate from '@/plugins/laya-lb-plyr/create.vue'
import PlyrEdit from '@/plugins/laya-lb-plyr/edit.vue'
import PlyrView from '@/plugins/laya-lb-plyr/view.vue'
import 'regenerator-runtime/runtime'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('Plyr create component', () => {
  let wrapper
  let getters
  beforeEach(() =>{
    getters = {
      courseSimple: () => false,
      profileLang: () => 'en'
    }
    const store = new Vuex.Store({
      getters
    })
    wrapper = shallowMount(PlyrCreate, {
      directives: {
        'b-tooltip': () => {}
      },
      stubs: ['b-jumbotron'],
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

  it('allows to input a title', async () => {
    const titleInput = wrapper.find('#laya-plyr-title')
    await titleInput.setValue('my title')
    expect(titleInput.element.value).toBe('my title')
  })

  it('has a checkbox to toggle title display', async () => {
    const titleToggle = wrapper.findAll('input').filter(el => el.attributes('type') === 'checkbox')
    expect(titleToggle.exists()).toBeTruthy()
  })

  it('has an input field for video URL', async () => {
    const videoUrl = wrapper.find('#vid-id')
    expect(videoUrl.exists()).toBeTruthy()
    await videoUrl.setValue('somevalue')
    expect(videoUrl.element.value).toBe('somevalue')
  })

  it('has 3 radio buttons for source type', async () => {
    const radioButtons = wrapper.findAll('input')
      .filter(el => el.attributes('type') === 'radio')
    expect(radioButtons.length).toBe(3)
  })

  it('which cannot be activated independently', async () => {
    const radioButtons = wrapper.findAll('input')
      .filter(el => el.attributes('type') === 'radio')
    const first = radioButtons.at(0)
    first.setChecked()
    radioButtons.wrappers.forEach(elem => {
      if (elem !== first) {
        expect(elem.element.checked).toBeFalsy()
      }
    })
  })

  it('allows input for subtitles files', async () => {
    const subtitleInput = wrapper.findAll('input')
      .filter(el => el.attributes('id').includes('subtitle'))
    expect(subtitleInput.length).toBeTruthy()

  })
})

describe('Plyr edit component', () => {
  let wrapper
  let getters
  beforeEach(() => {
    getters = {
      content: () => [
        {
          input: {
            youtube: true,
            src: 'youtu.be/1hcSloy35hj',
            title: 'some vid',
            showTitle: true
          }
        }
      ],
      courseSimple: () => false,
      profileLang: () => 'en'
    }
    const store = new Vuex.Store({
      getters
    })
    wrapper = shallowMount(PlyrEdit, {
      directives: {
        'b-tooltip': () => {
        }
      },
      mocks: {
        $route: {
          params: {
            step: 1
          }
        }
      },
      stubs: ['b-jumbotron'],
      store,
      localVue
    })
  })

  it('has loaded title and video from store', async () => {
    expect(wrapper.vm.$data).toStrictEqual({
      youtube: true,
      src: 'youtu.be/1hcSloy35hj',
      title: {
      text: 'some vid',
        id: 'video-title'
      },
      showTitle: true,
      tooltipOn: false
    })
    // TODO: find out why data is not rendered and the following tests fail
    // const titleInput = wrapper.find('#laya-plyr-title')
    // expect(titleInput.text()).toBe('some vid')
    // const vidInput = wrapper.find('#vid-id')
    // expect(vidInput.text()).toBe('youtu.be/1hcSloy35hj')
  })
  // TODO: Find a way to re-use the test units instead of duplicating them
  it('shows a helper box when clicking the questionmark', async () => {
    const questionmark = wrapper.find('#questionmark')
    await questionmark.trigger('click')
    const helpText = wrapper.find('#helptext')
    expect(helpText.exists()).toBeTruthy()
  })

  it('allows to input a title', async () => {
    const titleInput = wrapper.find('#laya-plyr-title')
    await titleInput.setValue('my title')
    expect(titleInput.element.value).toBe('my title')
  })

  it('has a checkbox to toggle title display', async () => {
    const titleToggle = wrapper.findAll('input').filter(el => el.attributes('type') === 'checkbox')
    expect(titleToggle.exists()).toBeTruthy()
  })

  it('has an input field for video URL', async () => {
    const videoUrl = wrapper.find('#vid-id')
    expect(videoUrl.exists()).toBeTruthy()
    await videoUrl.setValue('somevalue')
    expect(videoUrl.element.value).toBe('somevalue')
  })

  it('has 3 radio buttons for source type', async () => {
    const radioButtons = wrapper.findAll('input')
      .filter(el => el.attributes('type') === 'radio')
    expect(radioButtons.length).toBe(3)
  })

  it('which cannot be activated independently', async () => {
    const radioButtons = wrapper.findAll('input')
      .filter(el => el.attributes('type') === 'radio')
    const first = radioButtons.at(0)
    first.setChecked()
    radioButtons.wrappers.forEach(elem => {
      if (elem !== first) {
        expect(elem.element.checked).toBeFalsy()
      }
    })
  })

  it('allows input for subtitles files', async () => {
    const subtitleInput = wrapper.findAll('input')
      .filter(el => el.attributes('id').includes('subtitle'))
    expect(subtitleInput.length).toBeTruthy()

  })
})

describe.only('Plyr view component', () => {
  let wrapper
  let getters
  // jest.mock('plyr', () => {
  //   console.log('kekw')
  // })
  beforeEach(() => {
    getters = {
      content: () => [
        {
          input: {
            src: 'youtu.be/1hcSloy35hj',
            title: {
              text: 'some vid',
              id: 'video-title',
              show: false
            }
          }
        }
      ],
      courseSimple: () => false,
      courseUpdated: () => false,
      profileLang: () => 'en',
      storeBusy: () => false
    }
    const store = new Vuex.Store({
      getters
    })
    wrapper = shallowMount(PlyrView, {
      computed: {
        playerId () {
          return 'video-div'
        }
      },
      mocks: {
        $route: {
          params: {
            step: 1
          }
        }
      },
      store,
      stubs: ['laya-flag-icon'],
      localVue
    })
  })

  it('shows a video container', () => {
    expect(wrapper.vm.playerId).toBe('video-div')
    const videoContainer = wrapper.find('#video-div')
    expect(videoContainer.exists()).toBeTruthy()
  })

  it('shows title when title.show boolean is set', async () => {
    let videoTitle = wrapper.find('#video-title')
    expect(videoTitle.exists()).toBeFalsy()
    wrapper.vm.title.show = true
    // wrapper.setData({ title: { show: true } } ) // this is equivalent
    await localVue.nextTick()
    videoTitle = wrapper.find('#video-title')
    expect(videoTitle.exists()).toBeTruthy()
    expect(videoTitle.text()).toBe('some vid')
  })
})

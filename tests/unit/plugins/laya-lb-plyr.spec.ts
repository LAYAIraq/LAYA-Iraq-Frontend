import { createLocalVue, mount, shallowMount } from '@vue/test-utils'
import Vuex from 'vuex'
import { BootstrapVue } from 'bootstrap-vue'
import PlyrCreate from '@/plugins/laya-lb-plyr/create.vue'
import PlyrEdit from '@/plugins/laya-lb-plyr/edit.vue'
import PlyrView from '@/plugins/laya-lb-plyr/view.vue'
import 'regenerator-runtime/runtime'

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(BootstrapVue)

describe('Plyr create component', () => {
  let wrapper
  let getters
  beforeEach(() => {
    getters = {
      courseSimple: () => true,
      profileLang: () => 'en'
    }
    const store = new Vuex.Store({
      getters
    })
    wrapper = mount(PlyrCreate, {
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

  it('allows to input a title', async () => {
    const titleInput = wrapper.find('#laya-plyr-title')
    await titleInput.setValue('my title')
    expect(titleInput.element.value).toBe('my title')
  })

  it('allows to input a simple title', async () => {
    const titleInput = wrapper.find('#laya-plyr-title-simple')
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

  it('shows an error with wrong URL input', async () => {
    const videoUrl = wrapper.find('#vid-id')
    const typeButton = wrapper.find('#platform-upload')
    await typeButton.trigger('click')
    await videoUrl.setValue('somevalue')
    expect(videoUrl.element.value).toBe('somevalue')
    const urlHint = wrapper.find('#url-hint')
    expect(urlHint.exists()).toBeTruthy()
  })

  it('shows no error with valid URL input', async () => {
    const videoUrl = wrapper.find('#vid-id')
    const typeButton = wrapper.find('#platform-upload')
    await typeButton.trigger('click')
    await videoUrl.setValue('http://ourmovie')
    // expect(videoUrl.element.value).toBe('somevalue')
    const urlHint = wrapper.find('#url-hint')
    expect(urlHint.exists()).toBeFalsy()
  })

  it('shows an error with wrong youtube URL input', async () => {
    const videoUrl = wrapper.find('#vid-id')
    const typeButton = wrapper.find('#platform-yt')
    await typeButton.trigger('click')
    await videoUrl.setValue('somevalue')
    expect(videoUrl.element.value).toBe('somevalue')
    const urlHint = wrapper.find('#url-hint')
    expect(urlHint.exists()).toBeTruthy()
  })

  it('shows no error with valid youtube URL', async () => {
    const videoUrl = wrapper.find('#vid-id')
    const typeButton = wrapper.find('#platform-yt')
    await typeButton.trigger('click')
    await videoUrl.setValue('https://www.youtube.com/watch?v=N7qMjY-gSDA')
    // expect(videoUrl.element.value).toBe('somevalue')
    const urlHint = wrapper.find('#url-hint')
    expect(urlHint.exists()).toBeFalsy()
  })

  it('shows no error with valid youtube ID', async () => {
    const videoUrl = wrapper.find('#vid-id')
    const typeButton = wrapper.find('#platform-yt')
    await typeButton.trigger('click')
    await videoUrl.setValue('N7qMjY-gSDA')
    // expect(videoUrl.element.value).toBe('somevalue')
    const urlHint = wrapper.find('#url-hint')
    expect(urlHint.exists()).toBeFalsy()
  })

  it('shows an error with wrong vimeo URL input', async () => {
    const videoUrl = wrapper.find('#vid-id')
    const typeButton = wrapper.find('#platform-vimeo')
    await typeButton.trigger('click')
    await videoUrl.setValue('somevalue')
    expect(videoUrl.element.value).toBe('somevalue')
    const urlHint = wrapper.find('#url-hint')
    expect(urlHint.exists()).toBeTruthy()
  })

  it('shows no error with valid vimeo URL', async () => {
    const videoUrl = wrapper.find('#vid-id')
    const typeButton = wrapper.find('#platform-vimeo')
    await typeButton.trigger('click')
    await videoUrl.setValue('https://vimeo.com/1235467689')
    // expect(videoUrl.element.value).toBe('somevalue')
    const urlHint = wrapper.find('#url-hint')
    expect(urlHint.exists()).toBeFalsy()
  })

  it('shows no error with valid vimeo ID', async () => {
    const videoUrl = wrapper.find('#vid-id')
    const typeButton = wrapper.find('#platform-vimeo')
    await typeButton.trigger('click')
    await videoUrl.setValue('1235467689')
    // expect(videoUrl.element.value).toBe('somevalue')
    const urlHint = wrapper.find('#url-hint')
    expect(urlHint.exists()).toBeFalsy()
  })

  it('shows hint when URL might not match platform', async () => {
    const videoUrl = wrapper.find('#vid-id')
    const typeButton = wrapper.find('#platform-vimeo')
    await typeButton.trigger('click')
    await videoUrl.setValue('https://youtu.be/2313hasdb123')
    // expect(videoUrl.element.value).toBe('somevalue')
    let urlHint = wrapper.find('#url-hint')
    expect(urlHint.exists()).toBeTruthy()
    const uploadButton = wrapper.find('#platform-upload')
    await uploadButton.trigger('click')
    urlHint = wrapper.find('#url-hint')
    expect(urlHint.exists()).toBeTruthy()
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
    const selfHostCheck = wrapper.find('#platform-upload')
    await selfHostCheck.trigger('click')
    const subtitleInput = wrapper.find('#caption-input')
    expect(subtitleInput.exists()).toBeTruthy()
    const addCaptionButton = subtitleInput.find('button')
    await addCaptionButton.trigger('click')
    let inputFields = subtitleInput.findAll('input')
    expect(inputFields.length).toBe(4)
    const typeSelector = subtitleInput.find('select')
    expect(typeSelector.exists())
    await inputFields.wrappers[3].trigger('click') // check radio button
    expect(inputFields.wrappers[3].element.checked).toBeTruthy()
    await wrapper.find('#delete-button-0').trigger('click')
    inputFields = subtitleInput.findAll('input')
    expect(inputFields.length).toBeFalsy()
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
            host: 'upload',
            src: 'youtu.be/1hcSloy35hj',
            title: {
              text: 'some vid',
              simple: 'Video',
              id: 'video-title'
            },
            captions: {
              tracks: [{
                kind: 'captions',
                label: 'English',
                srclang: 'en',
                src: 'someURL',
                default: true
              }],
              default: 0
            }
          }
        }
      ],
      courseSimple: () => true,
      profileLang: () => 'en'
    }
    const store = new Vuex.Store({
      getters
    })
    wrapper = mount(PlyrEdit, {
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
    await localVue.nextTick()
    const titleInput = wrapper.find('#laya-plyr-title')
    expect(titleInput.element.value).toBe('some vid')
    const simpleTitleInput = wrapper.find('#laya-plyr-title-simple')
    expect(simpleTitleInput.element.value).toBe('Video')
    const vidInput = wrapper.find('#vid-id')
    expect(vidInput.element.value).toBe('youtu.be/1hcSloy35hj')
  })

  it('has loaded captions array from store', async () => {
    const captionInput = wrapper.find('#caption-input')
    const inputList = captionInput.findAll('input')
    expect(inputList.length).toBe(4)
    // expect(inputList.wrappers[0].element.value).toBe('captions')
    expect(inputList.wrappers[0].element.value).toBe('English')
    expect(inputList.wrappers[1].element.value).toBe('en')
    expect(inputList.wrappers[2].element.value).toBe('someURL')
    expect(inputList.wrappers[3].element.checked).toBeTruthy()
    const typeSelect = captionInput.find('select')
    expect(typeSelect.element.value).toBe('captions')
  })
})

describe('Plyr view component', () => {
  let wrapper
  let getters
  // jest.mock('plyr', () => {
  //   console.log('kekw')
  // })
  beforeEach(() => {
    getters = {
      courseUpdated: () => false,
      profileLang: () => 'en',
      storeBusy: () => false
    }
  })

  it('shows a video container', () => {
    getters.content = () => [
      {
        input: {
          src: 'youtu.be/1hcSloy35hj',
          title: {
            text: 'some vid',
            id: 'video-title',
            show: false
          },
          host: 'youtube'
        }
      }
    ]
    getters.courseSimple = () => false
    const store = new Vuex.Store({
      getters
    })
    wrapper = shallowMount(PlyrView, {
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
    // expect(wrapper.vm.playerId).toBe('video-div')
    const videoContainer = wrapper.find(`#${wrapper.vm.playerId}`)
    expect(videoContainer.exists()).toBeTruthy()
  })

  it('shows title when title.show boolean is set', async () => {
    getters.content = () => [
      {
        input: {
          title: {
            text: 'some vid',
            id: 'video-title',
            show: false
          }
        }
      }
    ]
    getters.courseSimple = () => false
    const store = new Vuex.Store({
      getters
    })
    wrapper = shallowMount(PlyrView, {
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
    let videoTitle = wrapper.find('#video-title')
    expect(videoTitle.exists()).toBeFalsy()
    wrapper.vm.title.show = true
    // wrapper.setData({ title: { show: true } } ) // this is equivalent
    await localVue.nextTick()
    videoTitle = wrapper.find('#video-title')
    expect(videoTitle.exists()).toBeTruthy()
    expect(videoTitle.text()).toBe('some vid')
  })

  it('displays the simple title correctly', () => {
    getters.content = () => [
      {
        input: {
          src: 'youtu.be/1hcSloy35hj',
          title: {
            text: 'some vid',
            id: 'video-title',
            show: true,
            simple: 'Video'
          },
          host: 'youtube'
        }
      }
    ]
    getters.courseSimple = () => true
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
    const videoTitle = wrapper.find('#video-title')
    expect(videoTitle.exists()).toBeTruthy()
    expect(videoTitle.text()).toBe('Video')
  })

  it('shows previewData correctly', async () => {
    const store = new Vuex.Store({
      getters
    })
    wrapper = shallowMount(PlyrView, {
      propsData: {
        previewData: {
          src: 'youtu.be/1hcSloy35hj',
          title: {
            text: 'some vid',
            id: 'video-title',
            show: false
          },
          host: 'youtube'
        }
      },
      store,
      stubs: ['laya-flag-icon'],
      localVue
    })
    // await localVue.nextTick()
    // const videoTitle = wrapper.find('#video-title')
    // expect(videoTitle.exists()).toBeTruthy()
    // expect(videoTitle.text()).toBe('some vid')
    // const videoContainer = wrapper.find(`#${wrapper.vm.playerId}`)
    // expect(videoContainer.exists()).toBeTruthy()
  })
})

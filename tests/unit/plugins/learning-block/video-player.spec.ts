import { createLocalVue, mount, shallowMount } from '@vue/test-utils'
import Vuex from 'vuex'
import { BootstrapVue } from 'bootstrap-vue'
import VideoEdit from '@/plugins/learning-block/video-player/video-edit.vue'
import VideoView from '@/plugins/learning-block/video-player/video-view.vue'
import 'regenerator-runtime/runtime'

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(BootstrapVue)

describe('Video edit component', () => {
  let wrapper: any
  const getters = {
    courseContent: () => ({
      test: {
        host: 'upload',
        src: 'https://my-video.de',
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
    }),
    pathId: () => 'test',
    courseContentPathId: () => () => 'test',
    courseSimple: () => true,
    profileLanguage: () => 'en'
  }
  const store = new Vuex.Store({
    getters
  })
  const cleanMount = () => mount(VideoEdit, {
    directives: {
      'b-tooltip': () => {
      }
    },
    mocks: {
      $route: {
        params: {
          coursePath: 'test'
        }
      }
    },
    propsData: {
      edit: true
    },
    store,
    localVue
  })
  describe('new', () => {
    it('has empty input', () => {
      wrapper = shallowMount(VideoEdit, {
        directives: {
          'b-tooltip': () => {
          }
        },
        mocks: {
          $route: {
            params: {
              coursePath: 'new-video'
            }
          }
        },
        propsData: {
          edit: false
        },
        store,
        stubs: ['b-jumbotron'],
        localVue
      })
      expect(wrapper.find('#vid-id').element.value).toBeFalsy()
      expect(wrapper.vm.$data.title).toStrictEqual({
        text: '',
        flagged: false,
        show: false,
        id: ''
      })
      expect(wrapper.vm.$data.host).toBeFalsy()
    })
  })
  describe('edit', () => {
    describe('general functionality', () => {
      beforeAll(() => {
        wrapper = cleanMount()
      })
      it('shows a helper box when clicking the questionmark', async () => {
        const questionmark = wrapper.find('#questionmark')
        await questionmark.trigger('click')
        const helpText = wrapper.find('.jumbotron')
        expect(helpText.exists()).toBeTruthy()
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
    })

    describe('existing component', () => {
      beforeAll(() => {
        wrapper = cleanMount()
      })
      it('loads video input from store', async () => {
        expect(wrapper.find('#vid-id').element.value).toBe('https://my-video.de')
        expect(wrapper.find('#platform-upload').element.checked).toBeTruthy()
      })
      it('loads title from store', () => {
        expect(wrapper.vm.$data.title).toStrictEqual({ text: 'some vid', simple: 'Video', id: 'video-title' })
      })
    })

    describe('subtitles', () => {
      beforeAll(() => {
        wrapper = cleanMount()
      })
      it('renders subtitle caption table when self-hosted-video', () => {
        expect(wrapper.find('#caption-input').exists()).toBeTruthy()
      })
      it('does not when not self-hosted', async () => {
        await wrapper.find('#platform-yt').trigger('click')
        expect(wrapper.find('#caption-input').exists()).toBeFalsy()
        await wrapper.find('#platform-vimeo').trigger('click')
        expect(wrapper.find('#caption-input').exists()).toBeFalsy()
        await wrapper.find('#platform-upload').trigger('click') // turn back to upload
      })

      it('renders existing subtitle tracks', () => {
        const captionTrack = wrapper.find('#caption-input-track-0')
        expect(captionTrack.exists()).toBeTruthy()
        expect(captionTrack.find('#type-select-0').element.value).toBe('captions')
        expect(captionTrack.find('#srclang-input-0').element.value).toBe('en')
        expect(captionTrack.find('#label-input-0').element.value).toBe('English')
        expect(captionTrack.find('#src-input-0').element.value).toBe('someURL')
        expect(captionTrack.find('#default-check-0').element.checked).toBe(true)
        expect(captionTrack.find('#delete-button-0').exists()).toBe(true)
      })

      it('tracks can be deleted', async () => {
        await wrapper.find('#delete-button-0').trigger('click')
        expect(wrapper.find('#caption-input-track-0').exists()).toBeFalsy()
      })

      it('tracks can be added', async () => { // fails when run in isolation, depends on test before
        await wrapper.find('#add-caption').trigger('click')
        await wrapper.find('#add-caption').trigger('click')
        await wrapper.find('#add-caption').trigger('click')
        expect(wrapper.findAll('.input-track').length).toBe(3)
      })

      it('tracks can be edited', async () => {
        const captionTrack = wrapper.find('#caption-input-track-0')
        const captionType = captionTrack.find('#type-select-0')
        await captionType.setValue('subtitles')
        expect(captionType.element.value).toBe('subtitles')
        const captionLabel = captionTrack.find('#label-input-0')
        await captionLabel.setValue('subtitles')
        expect(captionLabel.element.value).toBe('subtitles')
        const captionLang = captionTrack.find('#srclang-input-0')
        await captionLang.setValue('de')
        expect(captionLang.element.value).toBe('de')
        const captionSrc = captionTrack.find('#srclang-input-0')
        await captionSrc.setValue('https://youtu.be/abcdefg')
        expect(captionSrc.element.value).toBe('https://youtu.be/abcdefg')
        const captionDef = captionTrack.find('#default-check-0')
        await captionDef.trigger('click')
        expect(captionDef.element.checked).toBeTruthy()
      })
    })
  })
})

describe('Video view component', () => {
  let wrapper
  let getters
  // jest.mock('plyr', () => {
  //   console.log('kekw')
  // })
  const input = {
    host: 'upload',
    src: 'youtu.be/1hcSloy35hj',
    title: {
      text: 'some vid',
      simple: 'Video',
      id: 'video-title',
      show: false
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
  beforeEach(() => {
    getters = {
      profileLanguage: () => 'en',
      courseSimple: () => false
    }
    const store = new Vuex.Store({
      getters
    })
    wrapper = shallowMount(VideoView, {
      mocks: {
        $route: {
          params: {
            coursePath: 'test'
          }
        }
      },
      propsData: {
        viewData: input
      },
      store,
      stubs: ['laya-flag-icon'],
      localVue
    })
  })

  it('shows a video container', () => {
    // expect(wrapper.vm.playerId).toBe('video-div')
    const videoContainer = wrapper.find('#video-player')
    expect(videoContainer.exists()).toBeTruthy()
  })

  it('shows title when title.show boolean is set', async () => {
    let videoTitle = wrapper.find('#video-title')
    expect(videoTitle.exists()).toBeFalsy()
    input.title.show = true
    // wrapper.setData({ title: { show: true } } ) // this is equivalent
    await localVue.nextTick()
    videoTitle = wrapper.find('#video-title')
    expect(videoTitle.exists()).toBeTruthy()
    expect(videoTitle.text()).toBe('some vid')
  })

  it('displays the simple title correctly', () => {
    getters.courseSimple = () => true
    const store = new Vuex.Store({
      getters
    })
    wrapper = shallowMount(VideoView, {
      mocks: {
        $route: {
          params: {
            coursePath: 'test'
          }
        }
      },
      propsData: {
        viewData: input
      },
      store,
      stubs: ['laya-flag-icon'],
      localVue
    })
    const videoTitle = wrapper.find('#video-title')
    expect(videoTitle.exists()).toBeTruthy()
    expect(videoTitle.text()).toBe('Video')
  })
})

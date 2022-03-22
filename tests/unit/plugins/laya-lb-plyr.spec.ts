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

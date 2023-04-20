import { createLocalVue, mount } from '@vue/test-utils'
import ScrollToTop from '@/components/helpers/scroll-to-top.vue'
import Vuex from 'vuex'
import 'regenerator-runtime/runtime'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('Scroll to top button', () => {
  let store
  let windowScroll
  let wrapper
  beforeEach(() => {
    windowScroll = window.scroll
    window.scroll = jest.fn()
    store = new Vuex.Store({
      getters: {
        profileLanguage: () => 'en'
      }
    })
    wrapper = mount(
      ScrollToTop, {
        localVue,
        store
      }
    )
  })
  it('does not render when offset < 200', async () => {
    // const scrollButtonLayer = wrapper.findComponent({ name: 'LyScrollToTop' })
    // expect(scrollButtonLayer.attributes('style')).toBe('display: none;')
    // const scrollButton = scrollButtonLayer.find('button')
    // window.scroll(null, 201)
    const scrollButtonLayer = wrapper.find('.scroll-to-top')
    expect(scrollButtonLayer.attributes('style')).toBe('display: none;')
  })

  afterEach(() => {
    wrapper.destroy()
    window.scroll = windowScroll
  })

  it('renders when offset > 200 and scrolls when clicked', async () => {
    const scrollListener = jest.spyOn(window, 'scroll')
    const vm = wrapper.vm as any
    vm.show = true
    await localVue.nextTick()
    const scrollButtonLayer = wrapper.find('.scroll-to-top')
    expect(scrollButtonLayer.attributes('style')).toBeFalsy()
    const button = wrapper.find('button')
    await button.trigger('click')
    expect(scrollListener).toHaveBeenCalledWith({
      top: 0,
      behavior: 'smooth'
    })
    vm.scrollTreshold()
  })
})

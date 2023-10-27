import { createLocalVue, shallowMount } from '@vue/test-utils'
import Vuex from 'vuex'
import ContentTitleEdit from '@/components/helpers/content-title-edit.vue'
import 'regenerator-runtime/runtime'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('content title edit component', () => {
  let wrapper: any
  let store: any
  const spy = jest.fn()
  describe('courseSimple is true', () => {
    beforeEach(() => {
      store = new Vuex.Store({
        getters: {
          courseSimple: () => true,
          profileLanguage: () => 'en'
        }
      })
      wrapper = shallowMount(ContentTitleEdit, {
        mocks: {
          $emit: spy
        },
        propsData: {
          title: {
            text: 'test title',
            simple: 'simple test title',
            show: false
          }
        },
        store,
        localVue
      })
    })

    it('allows to input a title', async () => {
      const titleInput = wrapper.find('#title')
      await titleInput.setValue('my title')
      expect(titleInput.element.value).toBe('my title')
      expect(spy).toHaveBeenCalledWith('set-title', {
        text: 'my title',
        simple: 'simple test title',
        show: false
      })
    })

    it('allows to input a simple title', async () => {
      const titleInput = wrapper.find('#title-simple')
      await titleInput.setValue('my title')
      expect(titleInput.element.value).toBe('my title')
      expect(spy).toHaveBeenCalledWith('set-title', {
        text: 'test title',
        simple: 'my title',
        show: false
      })
    })

    it('has a checkbox to toggle title display', async () => {
      const titleToggle = wrapper.find('#show-title-tick')
      expect(titleToggle.exists()).toBeTruthy()
      expect(titleToggle.element.checked).toBeFalsy()
      await titleToggle.trigger('click')
      expect(titleToggle.element.checked).toBeTruthy()
      // FIXME localTitle.show does not change
      // expect(wrapper.vm.$data.titleLocal.show).toBeTruthy()
      // expect(spy).toHaveBeenLastCalledWith('set-title', {
      //   text: 'test title',
      //   simple: 'simple test title',
      //   show: true
      //
    })

    it('shows message when title is empty', async () => {
      await wrapper.find('#title').setValue('')
      expect(wrapper.find('#title-empty').exists()).toBeTruthy()
    })

    it('does not when it is not empty', () => {
      expect(wrapper.find('#title-empty').exists()).toBeFalsy()
    })
  })

  describe('courseSimple is false', () => {
    it('no input for simple title', async () => {
      store = new Vuex.Store({
        getters: {
          courseSimple: () => false,
          profileLanguage: () => 'en'
        }
      })
      wrapper = shallowMount(ContentTitleEdit, {
        mocks: {
          $emit: spy
        },
        propsData: {
          title: {
            text: 'test title',
            show: false
          }
        },
        store,
        localVue
      })
      expect(wrapper.find('#title-simple').exists()).toBeFalsy()
    })
  })
})

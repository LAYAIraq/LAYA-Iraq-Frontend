import { createLocalVue, mount, shallowMount } from '@vue/test-utils'
import cloneDeep from 'lodash.clonedeep'
import ProfileView from '@/components/user-views/profile.vue'
import Vuex from 'vuex'
import { BootstrapVue } from 'bootstrap-vue'
import 'regenerator-runtime/runtime'
import sampleApplication from '../../../mocks/sample-application.json'
import editor from '@/store/modules/applications'

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(BootstrapVue)

describe.skip('profile view', () => {
  let mutations
  let profileState
  let getters
  let actions
  let wrapper
  let vm
  let state
  let store
  let spy
  let commitSpy
  let dispatchSpy

  beforeEach(() => {
    state = {
      pwdRepeat: '',
      author: false,
      application: null
    }
    // jest.resetAllMocks()
    getters = {
      profileLanguage: () => 'en',
      passwordRepeat: () => state.pwdRepeat,
      password: () => 'secret12',
      isAuthor: () => state.author
      // userApplication: () => state.application
    }
    profileState = {
      author: false,
      avatar: 'mypic.png',
      email: 'admin@laya',
      language: 'en',
      preferencesFont: {},
      preferencesLanguages: {},
      preferencesMedia: {},
      username: 'admin',
      realm: null,
      emailVerified: false,
      id: 1,
      pwdRepeat: ''
    }

    mutations = {
      preferencesSet: jest.fn((prefs) => {
        profileState.prefs = prefs
      })
    }

    actions = {
      saveProfile: jest.fn(),
      changePassword: jest.fn()
    }
    store = new Vuex.Store({
      state,
      getters,
      modules: {
        profile: {
          state: profileState,
          getters: {
            profile: () => profileState,
            prefs () {
              return {
                font: profileState.preferencesFont,
                language: profileState.preferencesLanguages,
                media: profileState.preferencesMedia
              }
            },
            preferencesFont: () => profileState.preferencesFont,
            preferencesLanguages: () => profileState.preferencesLanguages,
            preferencesMedia: () => profileState.preferencesMedia,
            userId: () => profileState.id
          },
          mutations,
          actions
        },
        editor: cloneDeep(editor)
      }
    })
    spy = jest.spyOn(console, 'error').mockImplementation() // exists to silence console errors
    commitSpy = jest.spyOn(store, 'commit')
    dispatchSpy = jest.spyOn(store, 'dispatch').mockImplementation(() => Promise.resolve(true))
    wrapper = mount(ProfileView, {
      // data () {
      //   return {
      //     passwordOk: true
      //   }
      // },
      directives: {
        'b-tooltip': () => {
        }
      },
      localVue,
      store,
      stubs: [
        'password-input'
      ]
    })
    vm = wrapper.vm as any
  })

  it('saves media input as chosen', async () => {
    await wrapper.setData({ passwordOk: true })
    const mediaPrefChecks = wrapper.findAll('input')
    expect(mediaPrefChecks.length).toBe(20)
    mediaPrefChecks.wrappers.forEach((wrapper) => {
      // console.log(wrapper)
      if (wrapper.attributes('type') === 'checkbox') {
        wrapper.setChecked(true)
      }
    })
    expect(vm.prefs.media).toStrictEqual({
      text: true,
      video: true,
      audio: true,
      simple: true
    })
    const saveButton = wrapper.find('#save-profile')
    await saveButton.trigger('click')
    await localVue.nextTick()
    expect(mutations.preferencesSet).toHaveBeenCalledWith(
      expect.objectContaining({ id: 1 }), expect.objectContaining({
        media: {
          text: true,
          video: true,
          audio: true,
          simple: true
        }
      }))
    const inputFields = wrapper.findAll('input').filter(elem => elem.attributes('type') === 'checkbox')
    inputFields.setChecked(false)
    await saveButton.trigger('click')
    expect(mutations.preferencesSet).toHaveBeenLastCalledWith(
      expect.objectContaining({ id: 1 }), expect.objectContaining({
        media: {
          text: false,
          video: false,
          audio: false,
          simple: false
        }
      }))
    inputFields.at(1).setChecked(true)
    inputFields.at(3).setChecked(true)
    await saveButton.trigger('click')
    expect(mutations.preferencesSet).toHaveBeenLastCalledWith(
      expect.objectContaining({ id: 1 }), expect.objectContaining({
        media: {
          text: false,
          video: false,
          audio: true,
          simple: true
        }
      }))
    expect(dispatchSpy).toHaveBeenCalledWith('profileUpdate')
    // expect(actions.passwordUpdate).toHaveBeenCalled()
    // expect(actions.profileUpdate).toHaveBeenCalledTimes(3)
  })

  it('disables button when password input wrong', async () => {
    await wrapper.setData({ passwordOk: true })
    const button = wrapper.find('#save-profile')
    expect(button.attributes('disabled')).toBeUndefined()
    await wrapper.setData({ passwordOk: false })
    expect(wrapper.vm.passwordInputOk).toBeFalsy()
    expect(button.attributes('disabled')).toBe('disabled')
  })

  it('calls store methods on destroy', () => {
    wrapper.destroy()
    expect(dispatchSpy).toHaveBeenCalledWith('profileUpdate')
    expect(commitSpy).toHaveBeenCalledWith('preferencesSet', expect.any(Object))
  })

  // it('sets correct size when range is set', async () => {
  //   // FIXME: is stubbed in shallow mount, doesn't work with mount either
  //   // const fontSelector = wrapper.find('.custom-range')
  //   // expect(fontSelector.exists()).toBeTruthy()
  //   // fontSelector = fontSelector.wrappers.filter(wrapper => wrapper.attributes('type') === 'range')
  //   // expect(fontSelector.exists()).toBeTruthy()
  //   vm.chosenSize = 1
  //   await localVue.nextTick()
  //   expect(vm.chosenSize).toBe(1)
  // })

  it('shows toast when password is saved', async () => {
    actions.passwordUpdate = jest.fn(() => Promise.resolve())
    store = new Vuex.Store({
      state,
      getters,
      modules: {
        profile: {
          state: profileState,
          getters: {
            profile () {
              return profileState
            },
            preferencesFont: () => profileState.preferencesFont,
            preferencesMedia: () => profileState.preferencesMedia
          },
          mutations,
          actions
        },
        editor
      }
    })
    wrapper = shallowMount(ProfileView, {
      directives: {
        'b-tooltip': () => {
        }
      },
      store,
      localVue,
      stubs: [
        'password-input'
      ]
    })
    state.repeatPwd = 'secret12'
    // const toastSpy = jest.spyOn(wrapper.vm.$bvToast, 'show')
    // expect(wrapper.find('#submit-ok').exists()).toBeFalsy()
    await wrapper.setData({ passwordOk: true })
    const button = wrapper.find('#save-profile')
    await button.trigger('click')
    expect(actions.passwordUpdate).toHaveBeenCalled()
    // await localVue.nextTick()
    expect(wrapper.find('#submit-ok').exists()).toBeTruthy()
  }) // FIXME: succeeds but doesn't really test the toast

  it('shows toast when password saving failed', async () => {
    actions.passwordUpdate = jest.fn(() => Promise.reject(new Error('fail')))
    store = new Vuex.Store({
      state,
      getters,
      modules: {
        profile: {
          state: profileState,
          getters: {
            profile () {
              return profileState
            },
            preferencesFont: () => profileState.preferencesFont,
            preferencesMedia: () => profileState.preferencesMedia
          },
          mutations,
          actions
        },
        editor
      }
    })
    wrapper = shallowMount(ProfileView, {
      directives: {
        'b-tooltip': () => {
        }
      },
      store,
      localVue,
      stubs: [
        'password-input'
      ]
    })
    state.repeatPwd = 'secret12'
    await wrapper.setData({ passwordOk: true })
    const button = wrapper.find('button')
    await button.trigger('click')
    expect(actions.passwordUpdate).toHaveBeenCalled()
    expect(wrapper.find('#submit-failed').exists()).toBeTruthy()
  }) // FIXME: succeeds but doesn't really test the toast

  it('shows application button for non-authors', async () => {
    await wrapper.setData({ applicationNew: true })
    expect(wrapper.find('#application-button').exists()).toBeTruthy()
    expect(wrapper.find('#author-application').exists()).toBeTruthy()
  })

  it('doesn`t for non-authors', async () => {
    state.author = true
    await localVue.nextTick()
    expect(wrapper.find('#application-button').exists()).toBeFalsy()
    expect(wrapper.find('#author-application').exists()).toBeFalsy()
  })

  it('shows application modal when clicking application button', async () => {
    await wrapper.setData({ applicationNew: true })
    const button = wrapper.find('#application-button')
    await button.trigger('click')
    const applicationForm = wrapper.find('#author-application-form')
    expect(applicationForm.exists()).toBeTruthy()
  })

  it('shows application form has for name, aoe, instution and application', async () => {
    await wrapper.setData({ applicationNew: true })
    await wrapper.find('#application-button').trigger('click')
    const applicationForm = wrapper.find('#author-application-form')
    expect(applicationForm.find('#applicant-name').exists()).toBeTruthy()
    expect(applicationForm.find('#applicant-institution').exists()).toBeTruthy()
    expect(applicationForm.find('#applicant-expertise').exists()).toBeTruthy()
    expect(applicationForm.find('#applicant-text').exists()).toBeTruthy()
  })

  it('tries to dispatch an application onCreated', () => {
    expect(dispatchSpy).toHaveBeenCalledWith('userApplicationFetch', 1)
  })

  // it('pre-fills the application should it exist', async () => { // tested watcher that is removed
  //   // const watchSpy = jest.spyOn(vm.watch, 'userApplication')
  //   store.commit('applicationAdd', sampleApplication)
  //   expect(store.getters.userApplication).toStrictEqual(sampleApplication)
  //   // expect(watchSpy).toHaveBeenCalled()
  //   await localVue.nextTick()
  //   const applicationForm = wrapper.find('#author-application-form')
  //   expect(applicationForm.find('#applicant-name').element.value).toBe('Dr. A. Rsehole')
  //   expect(applicationForm.find('#applicant-institution').element.value).toBe('Institute of Proctology, MIT')
  //   expect(applicationForm.find('#applicant-expertise').element.value).toBe('Bullshitting')
  //   expect(applicationForm.find('#applicant-text').element.value).toBe('I am a laureate PhD in Bovine Proctology and want to shed some light on the field')
  // })

  it('updates data in store if application changed', async () => {
    store.commit('applicationAdd', sampleApplication)
    await wrapper.setData({ applicationNew: false })
    await wrapper.find('#edit-application-button').trigger('click')
    await wrapper.find('#applicant-expertise').setValue('Bovine Defecation')
    // await wrapper.find('.btn.btn-primary').trigger('click')
    const applicationSaveButton = wrapper.find('.btn.btn-success')
    expect(applicationSaveButton.text()).toBe('Save application')
    await applicationSaveButton.trigger('click') // click ok button on modal, saving the application
    expect(commitSpy).toHaveBeenLastCalledWith('applicationEdit', expect.objectContaining({
      areaOfExpertise: 'Bovine Defecation'
    }))
    expect(store.getters.applicationList[0]).toStrictEqual(
      expect.objectContaining({ areaOfExpertise: 'Bovine Defecation' })
    )
    expect(store.getters.userApplication).toStrictEqual(
      expect.objectContaining({ areaOfExpertise: 'Bovine Defecation' })
    )
  })

  it('gives option to edit and withdraw when applications exists', () => {
    store.commit('applicationAdd', sampleApplication)
    const applicationButtons = wrapper.find('#author-application').findAll('button')
    expect(applicationButtons.length).toBe(2)
    expect(applicationButtons.at(0).attributes('id')).toBe('edit-application-button')
    expect(applicationButtons.at(1).attributes('id')).toBe('withdraw-application-button')
  })

  it('shows application modal when clicking edit application button', async () => {
    store.commit('applicationAdd', sampleApplication)
    await wrapper.find('#edit-application-button').trigger('click')
    // expect(button.exists()).toBeTruthy()
    expect(wrapper.find('#author-application-form').exists()).toBeTruthy()
  })

  it('shows withdrawal modal when clicking withdraw application button', async () => {
    store.commit('applicationAdd', sampleApplication)
    await wrapper.find('#withdraw-application-button').trigger('click')
    const withdrawModal = wrapper.find('#application-withdraw-modal')
    expect(withdrawModal.exists()).toBeTruthy()
  })

  it('calls decideOn when withdrawal is confirmed', async () => {
    store.commit('applicationAdd', sampleApplication)
    await wrapper.find('#withdraw-application-button').trigger('click')
    const withdrawModal = wrapper.find('#application-withdraw-modal')
    await withdrawModal.find('.btn.btn-warning').trigger('click')
    await localVue.nextTick()
    expect(commitSpy).toHaveBeenLastCalledWith('applicationDecide', {
      applicationId: 1,
      decision: 'withdrawn'
    })
    wrapper.destroy()
    expect(dispatchSpy).toHaveBeenCalledWith('userApplicationDecide')
  })

  it('shows hint that user withdrew if they did', async () => {
    store.commit('applicationAdd', sampleApplication)
    await wrapper.find('#withdraw-application-button').trigger('click')
    const withdrawModal = wrapper.find('#application-withdraw-modal')
    await withdrawModal.find('.btn.btn-warning').trigger('click')
    expect(wrapper.find('#application-withdrawn').exists()).toBeTruthy()
  })

  it('dispatches userApplicationUpdate onDestroy if one exisited', async () => {
    wrapper.setData({ applicationNew: false })
    store.commit('applicationAdd', sampleApplication)
    expect(store.getters.applicationList.length).toBe(1)
    await localVue.nextTick()
    // expect(wrapper.vm.applicationNew).toBeFalsy()
    wrapper.destroy()
    expect(dispatchSpy).toHaveBeenLastCalledWith('userApplicationUpdate',
      sampleApplication
    )
  })

  it('dispatches userApplicationCreate onDestroy if application is new', async () => {
    expect(store.getters.applicationList.length).toBe(0)
    await wrapper.setData({ applicationNew: true })
    // dispatchSpy = jest.spyOn(store, 'dispatch').mockImplementation(() => Promise.reject(new Error('fail')))
    await wrapper.find('#application-button').trigger('click')
    await wrapper.find('#applicant-expertise').setValue('Post-Modern Literary Theory')
    await wrapper.find('#applicant-institution').setValue('Institute of Literature, Harvard')
    await wrapper.find('#applicant-name').setValue('Dr. Francois Lyotard')
    await wrapper.find('#applicant-text').setValue('Guys cmon you know me')
    await wrapper.find('.btn.btn-success').trigger('click') // click ok button on modal, sending the application
    // expect(wrapper.vm.applicationNew).toBeTruthy()
    // expect(methodSpy).toHaveBeenCalled()
    // expect(commitSpy).toHaveBeenCalledWith('applicationAdd', expect.any(Object))
    // expect(store.getters.userApplication).toBeTruthy()
    await localVue.nextTick()
    wrapper.destroy()
    expect(dispatchSpy).toHaveBeenLastCalledWith('userApplicationCreate',
      expect.objectContaining({
        areaOfExpertise: 'Post-Modern Literary Theory',
        fullName: 'Dr. Francois Lyotard',
        applicationText: 'Guys cmon you know me',
        applicantId: store.getters.userId,
        institution: 'Institute of Literature, Harvard'
      })
    )
  })
})

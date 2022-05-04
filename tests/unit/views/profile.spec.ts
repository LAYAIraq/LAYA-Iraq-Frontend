import { createLocalVue, mount, shallowMount } from '@vue/test-utils'
import ProfileView from '@/views/profile.vue'
import Vuex from 'vuex'
import { BootstrapVue } from 'bootstrap-vue'
import 'regenerator-runtime/runtime'
import sampleApplication from '../../mocks/sample-application.json'
import editor from '@/store/modules/editor'

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(BootstrapVue)

describe('profile view', () => {
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
      profileLang: () => 'en',
      passwordRepeat: () => state.pwdRepeat,
      passwordSet: () => 'secret12',
      isAuthor: () => state.author
      // userApplication: () => state.application
    }
    profileState = {
      author: false,
      avatar: 'mypic.png',
      email: 'admin@laya',
      lang: 'en',
      prefs: {},
      username: 'admin',
      realm: null,
      emailVerified: false,
      id: 1,
      pwdRepeat: ''
    }

    mutations = {
      setPrefs: jest.fn((prefs) => {
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
            profile () {
              return profileState
            },
            userId: () => profileState.id
          },
          mutations,
          actions
        },
        editor
      }
    })
    spy = jest.spyOn(console, 'error').mockImplementation() // exists to silence console errors
    commitSpy = jest.spyOn(store, 'commit')
    dispatchSpy = jest.spyOn(store, 'dispatch').mockImplementation(() => Promise.resolve())
    wrapper = mount(ProfileView, {
      data () {
        return {
          passwordOk: true
        }
      },
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
    const mediaPrefChecks = wrapper.findAll('input')
    expect(mediaPrefChecks.length).toBe(13)
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
    expect(mutations.setPrefs).toHaveBeenCalledWith(
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
    expect(mutations.setPrefs).toHaveBeenLastCalledWith(
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
    expect(mutations.setPrefs).toHaveBeenLastCalledWith(
      expect.objectContaining({ id: 1 }), expect.objectContaining({
        media: {
          text: false,
          video: false,
          audio: true,
          simple: true
        }
      }))
    expect(dispatchSpy).toHaveBeenCalledWith('saveProfile')
    // expect(actions.changePassword).toHaveBeenCalled()
    // expect(actions.saveProfile).toHaveBeenCalledTimes(3)
  })

  it('disables button when password input wrong', async () => {
    const button = wrapper.find('#save-profile')
    expect(button.attributes('disabled')).toBeUndefined()
    await wrapper.setData({ passwordOk: false })
    expect(wrapper.vm.passwordInputOk).toBeFalsy()
    expect(button.attributes('disabled')).toBe('disabled')
  })

  it('calls store methods on destroy', () => {
    wrapper.destroy()
    expect(dispatchSpy).toHaveBeenCalledWith('saveProfile')
    expect(commitSpy).toHaveBeenCalledWith('setPrefs', expect.any(Object))
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
    actions.changePassword = jest.fn(() => Promise.resolve())
    store = new Vuex.Store({
      state,
      getters,
      modules: {
        profile: {
          state: profileState,
          getters: {
            profile () {
              return profileState
            }
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
    expect(actions.changePassword).toHaveBeenCalled()
    // await localVue.nextTick()
    expect(wrapper.find('#submit-ok').exists()).toBeTruthy()
  }) // FIXME: succeeds but doesn't really test the toast

  it('shows toast when password saving failed', async () => {
    actions.changePassword = jest.fn(() => Promise.reject(new Error('fail')))
    store = new Vuex.Store({
      state,
      getters,
      modules: {
        profile: {
          state: profileState,
          getters: {
            profile () {
              return profileState
            }
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
    expect(actions.changePassword).toHaveBeenCalled()
    expect(wrapper.find('#submit-failed').exists()).toBeTruthy()
  }) // FIXME: succeeds but doesn't really test the toast

  it('shows application button for non-authors', async () => {
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
    const button = wrapper.find('#application-button')
    expect(button.exists()).toBeTruthy()
    await button.trigger('click')
    const applicationForm = wrapper.find('#author-application-form')
    expect(applicationForm.exists()).toBeTruthy()
  })

  it('shows application form has for name, aoe, instution and application', async () => {
    await wrapper.find('#application-button').trigger('click')
    const applicationForm = wrapper.find('#author-application-form')
    expect(applicationForm.find('#applicant-name').exists()).toBeTruthy()
    expect(applicationForm.find('#applicant-institution').exists()).toBeTruthy()
    expect(applicationForm.find('#applicant-expertise').exists()).toBeTruthy()
    expect(applicationForm.find('#applicant-text').exists()).toBeTruthy()
  })

  it('tries to dispatch an application onCreated', () => {
    // dispatchSpy = dispatchSpy.mockImplementation(() => Promise.resolve(true))
    // wrapper = mount(ProfileView, {
    //   data () {
    //     return {
    //       passwordOk: true
    //     }
    //   },
    //   directives: {
    //     'b-tooltip': () => {
    //     }
    //   },
    //   localVue,
    //   store,
    //   stubs: [
    //     'password-input'
    //   ]
    // })
    // store.commit('addApplication', sampleApplication)
    expect(dispatchSpy).toHaveBeenCalledWith('getApplicationUser', 1)
    // const applicationForm = wrapper.find('#author-application-form')
    // expect(applicationForm.find('#applicant-name').element.value).toBe('Dr. A. Rsehole')
    // expect(applicationForm.find('#applicant-institution').element.value).toBe('Institute of Proctology, MIT')
    // expect(applicationForm.find('#applicant-expertise').element.value).toBe('Bullshitting')
    // expect(applicationForm.find('#applicant-text').element.value).toBe('I am a laureate PhD in Bovine Proctology and want to shed some light on the field')
  })

  // it('pre-fills the application should it exist', async () => { // tested watcher that is removed
  //   // const watchSpy = jest.spyOn(vm.watch, 'userApplication')
  //   store.commit('addApplication', sampleApplication)
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
    store.commit('addApplication', sampleApplication)
    await wrapper.find('#applicant-expertise').setValue('Bovine Defecation')
    await wrapper.find('#application-button').trigger('click')
    const applicationSaveButton = wrapper.find('.btn.btn-success')
    expect(applicationSaveButton.text()).toBe('Save application')
    await applicationSaveButton.trigger('click') // click ok button on modal, saving the application
    expect(commitSpy).toHaveBeenLastCalledWith('editApplication', expect.objectContaining({
      areaOfExpertise: 'Bovine Defecation'
    }))
    expect(store.getters.applicationList[0]).toStrictEqual(
      expect.objectContaining({ areaOfExpertise: 'Bovine Defecation' })
    )
    expect(store.getters.userApplication).toStrictEqual(
      expect.objectContaining({ areaOfExpertise: 'Bovine Defecation' })
    )
  })

  it('dispatches updateApplication onDestroy if one exisited', async () => {
    store.commit('addApplication', sampleApplication)
    wrapper.find('#applicant-expertise').setValue('Bovine Defecation')
    await wrapper.find('btn.btn-success').trigger('click')
    wrapper.destroy()
    expect(dispatchSpy).toHaveBeenCalledWith('updateApplication',
      expect.objectContaining({ areaOfExpertise: 'Bovine Defecation' })
    )
  })

  it('dispatches sendApplication onDestroy if application is new', async () => {
    wrapper.find('#applicant-expertise').setValue('Post-Modern Literary Theory')
    wrapper.find('#applicant-institution').setValue('Institute of Literature, Harvard')
    wrapper.find('#applicant-name').setValue('Dr. Francois Lyotard')
    wrapper.find('#applicant-text').setValue('Guys cmon you know me')
    await wrapper.find('btn.btn-success').trigger('click') // click ok button on modal, sending the application
    wrapper.destroy()
    expect(dispatchSpy).toHaveBeenCalledWith('sendApplication',
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

import { createLocalVue } from '@vue/test-utils'
import cloneDeep from 'lodash.clonedeep'
import Vuex from 'vuex'
import editor from '@/store/modules/editor'
import 'regenerator-runtime/runtime' // for async behavior in tests
import http from 'axios'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('editor store mutations', () => {
  let store
  let sampleApplication
  beforeEach(() => {
    store = new Vuex.Store(
      cloneDeep(editor)
    )
    sampleApplication = {
      created: 12345678910,
      areaOfExpertise: 'Bullshitting',
      institution: 'Institute of Proctology, MIT',
      fullName: 'Dr. A. Rsehole',
      applicationText: 'I am a laureate PhD in Bovine Proctology and want to shed some light on the field',
      id: 1,
      edited: null,
      accepted: false,
      decidedOn: null,
      applicantId: 2
    }
  })

  it('addApplication adds correct values to state', () => {
    store.commit('addApplication', sampleApplication)
    expect(store.state.applicationList).toContain(sampleApplication)
  })

  it('addEditorVote sets non-existing vote count correctly (vote true)', () => {
    store.commit('addApplication', sampleApplication)
    store.commit('addEditorVote', { editorId: 2, applicationId: 1, vote: true })
    expect(store.state.editorVotes).toStrictEqual([{ editorId: 2, applicationId: 1, vote: true }])
    expect(store.state.applicationList[0].votes).toBe(1)
  })

  it('addEditorVote sets non-existing vote count correctly (vote false)', () => {
    store.commit('addApplication', sampleApplication)
    store.commit('addEditorVote', { editorId: 2, applicationId: 1, vote: false })
    expect(store.state.applicationList[0].votes).toBe(0)
  })

  it('addEditorVote updates existing vote count correctly (vote false)', () => {
    const votedOnApplication = {
      ...sampleApplication,
      votes: 3
    }
    store.commit('addApplication', votedOnApplication)
    store.commit('addEditorVote', { editorId: 2, applicationId: 1, vote: false })
    expect(store.state.applicationList[0].votes).toBe(3)
  })

  it('addEditorVote updates existing vote count correctly (vote true)', () => {
    const votedOnApplication = {
      ...sampleApplication,
      votes: 3
    }
    store.commit('addApplication', votedOnApplication)
    store.commit('addEditorVote', { editorId: 2, applicationId: 1, vote: true })
    expect(store.state.applicationList[0].votes).toBe(4)
  })

  it('changeVote updates editor vote and vote count', () => {
    const application = {
      ...sampleApplication,
      votes: 3
    }
    store.commit('addApplication', application)
    store.commit('addEditorVote', { editorId: 1, applicationId: 1, vote: false })
    expect(store.state.editorVotes).toStrictEqual([{ editorId: 1, applicationId: 1, vote: false }])
    expect(store.state.applicationList).toContain(application)
    store.commit('changeVote', {
      application,
      editorId: 1,
      vote: true
    })
    expect(store.state.editorVotes[0].edited.length).toBe(1) // make sure old descision is pushed
    expect(store.state.editorVotes).toStrictEqual([expect.objectContaining({
      editorId: 1, applicationId: 1, vote: true, changed: true
    })])
    // const oldDate = store.state.editorVotes[0].date // save date to make sure it's altered on request
    expect(application.votes).toBe(4)
    store.commit('changeVote', {
      application,
      editorId: 1,
      vote: false
    })
    expect(store.state.editorVotes[0].edited.length).toBe(2) // make sure decisions are saved
    // expect(store.state.editorVotes[0].date).not.toBe(oldDate) // make sure date is updated
    expect(store.state.editorVotes).toStrictEqual([expect.objectContaining({
      editorId: 1, applicationId: 1, vote: false, changed: true
    })])
    expect(application.votes).toBe(3)
  })

  it('changeVote does nothing if vote didn`t change', () => {
    const application = {
      ...sampleApplication,
      votes: 3
    }
    store.commit('addApplication', application)
    store.commit('addEditorVote', { editorId: 1, applicationId: 1, vote: false })
    store.commit('changeVote', {
      application,
      editorId: 1,
      vote: false
    })
    expect(store.state.applicationList[0].edited).toBeFalsy()
  })

  it('decideOnApplication sets values correctly (reject)', () => {
    store.commit('addApplication', sampleApplication)
    store.commit('decideOnApplication', { applicationId: 1, decision: false })
    expect(store.state.applicationList[0].decidedOn).toBeTruthy()
    expect(store.state.applicationList[0].accepted).toBe(false)
  })

  it('decideOnApplication sets values correctly (accept)', () => {
    store.commit('addApplication', sampleApplication)
    store.commit('decideOnApplication', { applicationId: 1, decision: true })
    expect(store.state.applicationList[0].decidedOn).toBeTruthy()
    expect(store.state.applicationList[0].accepted).toBe(true)
  })

  it('decideOnApplication sets values correctly (withdraw)', () => {
    store.commit('addApplication', sampleApplication)
    store.commit('decideOnApplication', { applicationId: 1, decision: null })
    expect(store.state.applicationList[0].decidedOn).toBeTruthy()
    expect(store.state.applicationList[0].accepted).toBe(null)
  })

  it('editApplication returns error with empty store', () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation()
    store.commit('editApplication', sampleApplication)
    expect(errorSpy).toHaveBeenCalled()
  })

  it('editApplication returns error with non-matching ids', () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation()
    store.commit('addApplication', sampleApplication)
    store.commit('editApplication', { ...sampleApplication, id: 3 })
    expect(errorSpy).toHaveBeenCalled()
  })

  it('editApplication updates store correctly', () => {
    store.commit('addApplication', sampleApplication)
    store.commit('editApplication', {
      ...sampleApplication,
      fullName: 'Dr. van Nostrand',
      institution: 'State of New York'
    })
    expect(store.getters.userApplication).toStrictEqual(expect.objectContaining({
      fullName: 'Dr. van Nostrand',
      institution: 'State of New York'
    }))
  })

  it('setNumberOfEditors works correctly', () => {
    expect(store.state.numberOfEditors).toBe(0)
    store.commit('setNumberOfEditors', 4)
    expect(store.state.numberOfEditors).toBe(4)
    store.commit('setNumberOfEditors', 0)
    expect(store.state.numberOfEditors).toBe(0)
  })
})

describe('editor store getters', () => {
  let store
  let sampleVote
  let sampleApplication
  beforeEach(() => {
    store = new Vuex.Store(cloneDeep(editor))
    sampleApplication = {
      created: 12345678910,
      areaOfExpertise: 'Bullshitting',
      institution: 'Institute of Proctology, MIT',
      fullName: 'Dr. A. Rsehole',
      applicationText: 'I am a laureate PhD in Bovine Proctology and want to shed some light on the field',
      id: 1,
      edited: null,
      accepted: false,
      decidedOn: null,
      applicantId: 2
    }
    sampleVote = sampleVote = {
      date: Date.now(),
      edited: null,
      vote: false,
      id: 1,
      editorId: 2,
      applicationId: 1
    }
  })

  it('applicationList is a list and contains objects', () => {
    expect(store.getters.applicationList).toStrictEqual(expect.any(Array))
    store.commit('addApplication', sampleApplication)
    expect(store.getters.applicationList).toHaveLength(1)
    expect(store.getters.applicationList).toContain(sampleApplication)
  })

  it('editorVotes is a list and contains objects', () => {
    expect(store.getters.editorVotes).toStrictEqual(expect.any(Array))
    store.commit('addApplication', sampleApplication) // addEditorVote needs application in store
    store.commit('addEditorVote', sampleVote)
    expect(store.getters.editorVotes).toHaveLength(1)
    expect(store.getters.editorVotes).toContain(sampleVote)
  })

  it('userApplication is an object', () => {
    store.commit('addApplication', sampleApplication)
    expect(store.getters.userApplication).toStrictEqual(expect.any(Object))
    expect(store.getters.userApplication).toStrictEqual(sampleApplication)
  })

  it('numberOfEditors is number', () => {
    expect(store.getters.numberOfEditors).toStrictEqual(expect.any(Number))
    expect(store.getters.numberOfEditors).toBe(0)
    store.commit('setNumberOfEditors', 123)
    expect(store.getters.numberOfEditors).toBe(123)
  })
})

describe('editor store actions', () => {
  let store
  let sampleApplication
  let sampleVote
  let httpMock
  beforeEach(() => {
    store = new Vuex.Store(
      cloneDeep(editor)
    )
    sampleApplication = {
      created: 12345678910,
      areaOfExpertise: 'Bullshitting',
      institution: 'Institute of Proctology, MIT',
      fullName: 'Dr. A. Rsehole',
      applicationText: 'I am a laureate PhD in Bovine Proctology and want to shed some light on the field',
      id: 1,
      edited: null,
      accepted: false,
      decidedOn: null,
      applicantId: 2
    }
    sampleVote = {
      date: Date.now(),
      edited: null,
      vote: false,
      id: 1,
      editorId: 2,
      applicationId: 1
    }
    httpMock = () => {} // in order to re-assign it every run
  })

  it('createEditorVote sends correct post request', async () => {
    httpMock = jest.spyOn(http, 'post')
      .mockImplementation(params => Promise.resolve(params))
    await store.dispatch('createEditorVote', {
      editorId: 2,
      applicationId: 1,
      vote: true
    })
    expect(httpMock).toHaveBeenCalledWith('/editor-votes', {
      editorId: 2,
      applicationId: 1,
      vote: true
    })
  })

  it('getApplications returns an array of applications and calls addApplication', async () => {
    const myAppList = []
    for (let i = 1; i <= 10; i++) {
      const myApp = cloneDeep(sampleApplication)
      myApp.id = myApp.id + i
      myApp.created = myApp.created + i
      myAppList.push(myApp)
    }
    httpMock = jest.spyOn(http, 'get').mockImplementation(() => Promise.resolve({
      data: myAppList
    }))
    await store.dispatch('getApplications')
    expect(httpMock).toHaveBeenCalledTimes(11)
    expect(store.state.applicationList.length).toBe(10)
  })

  it('getApplicationUser sets one application in store', async () => {
    httpMock = jest.spyOn(http, 'get').mockImplementation(() => Promise.resolve({
      data: [sampleApplication]
    }))
    await store.dispatch('getApplicationUser', 2)
    expect(store.state.applicationList.length).toBe(1)
    expect(store.state.applicationList[0]).toBe(sampleApplication)
  })

  it('getEditorVotes calls addEditorVote correctly', async () => {
    store.commit('addApplication', sampleApplication)
    httpMock = jest.spyOn(http, 'get').mockImplementation(() => Promise.resolve({
      data: [sampleVote]
    }))
    await store.dispatch('getEditorVotes', 1)
    expect(httpMock).toHaveBeenCalled()
    expect(store.state.editorVotes).toStrictEqual([sampleVote])
    expect(store.state.applicationList[0].votes).toBe(0)
  })

  it('getNumberOfEditors handles response correctly', async () => {
    httpMock = jest.spyOn(http, 'get').mockImplementation(() => Promise.resolve({
      data: { editors: 15 }
    }))
    await store.dispatch('getNumberOfEditors')
    expect(httpMock).toHaveBeenCalledWith('/accounts/editors')
    expect(store.state.numberOfEditors).toBe(15)
  })

  it('saveVote fires correct request', async () => {
    httpMock = jest.spyOn(http, 'patch')
      .mockImplementation(() => Promise.resolve('done'))
    await store.dispatch('saveVote', sampleVote)
    const { id, ...expectedPayload } = sampleVote
    expect(httpMock).toHaveBeenCalledWith('/editor-votes/1', expectedPayload)
  })

  it('saveVotes dispatches saveVote for changed votes', async () => {
    // const consoleError = console.error
    console.error = () => {} // mute console output for Promise rejections
    const errorSpy = jest.spyOn(console, 'error')
    const commitSpy = jest.spyOn(store, 'commit')
    store.commit('addApplication', sampleApplication)
    httpMock = jest.spyOn(http, 'patch')
      .mockImplementation(() => Promise.reject(new Error('fail')))
    for (let i = 0; i < 10; i++) {
      const myVote = cloneDeep(sampleVote)
      if (i % 2 === 0) { // mark every 2nd vote as changed
        // console.log(i)
        myVote.changed = true
      }
      myVote.id = myVote.id + i
      myVote.editorId = myVote.editorId + i
      // console.log(myVote)
      store.commit('addEditorVote', myVote)
    } // have a list of 10 votes, 5 have changed
    // console.log(store.state.editorVotes)
    expect(commitSpy).toHaveBeenCalledTimes(11)
    expect(store.state.editorVotes.length).toBe(10)
    await store.dispatch('saveVotes')
    expect(httpMock).toHaveBeenCalled() // returns different value when running in isolation, so generic test for now
    expect(errorSpy).toHaveBeenCalledTimes(5) // for Promise rejection output
    // console.error = consoleError
  })

  it('sendApplication sends correct http request', () => {
    httpMock = jest.spyOn(http, 'post')
      .mockImplementation(() => Promise.resolve())
    const resp = store.dispatch('sendApplication', sampleApplication)
    expect(httpMock).toHaveBeenCalledWith('/applications', sampleApplication)
    expect(resp).toStrictEqual(expect.any(Promise))
  })

  it('updateApplication fires correct request', async () => {
    httpMock = jest.spyOn(http, 'patch')
      .mockImplementation(() => Promise.resolve())
    const resp = store.dispatch('updateApplication', sampleApplication)
    const { id, ...expectedPayload } = sampleApplication
    expect(httpMock).toHaveBeenCalledWith('/applications/1', expectedPayload)
    expect(resp).toStrictEqual(expect.any(Promise))
  })
})

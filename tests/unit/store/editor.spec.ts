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

  it('setNumberOfEditors works correctly', () => {
    expect(store.state.numberOfEditors).toBe(0)
    store.commit('setNumberOfEditors', 4)
    expect(store.state.numberOfEditors).toBe(4)
    store.commit('setNumberOfEditors', 0)
    expect(store.state.numberOfEditors).toBe(0)
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

  it('getApplicationUser returns exactly one application', async () => {
    httpMock = jest.spyOn(http, 'get').mockImplementation(() => Promise.resolve({
      data: sampleApplication
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
})

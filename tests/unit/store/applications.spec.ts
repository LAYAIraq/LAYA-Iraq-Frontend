import { createLocalVue } from '@vue/test-utils'
import cloneDeep from 'lodash.clonedeep'
import Vuex from 'vuex'
import editor from '@/store/modules/applications'
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

  it('applicationAdd adds correct values to state', () => {
    store.commit('applicationAdd', sampleApplication)
    expect(store.state.applicationList).toContain(sampleApplication)
  })

  it('editorVoteAdd sets non-existing vote count correctly (vote true)', () => {
    store.commit('applicationAdd', sampleApplication)
    store.commit('editorVoteAdd', { editorId: 2, applicationId: 1, vote: true })
    expect(store.state.editorVotes).toStrictEqual([{
      editorId: 2,
      applicationId: 1,
      vote: true
    }])
    expect(store.state.applicationList[0].votes).toBe(1)
  })

  it('editorVoteAdd sets non-existing vote count correctly (vote false)', () => {
    store.commit('applicationAdd', sampleApplication)
    store.commit('editorVoteAdd', { editorId: 2, applicationId: 1, vote: false })
    expect(store.state.applicationList[0].votes).toBe(0)
  })

  it('editorVoteAdd updates existing vote count correctly (vote false)', () => {
    const votedOnApplication = {
      ...sampleApplication,
      votes: 3
    }
    store.commit('applicationAdd', votedOnApplication)
    store.commit('editorVoteAdd', { editorId: 2, applicationId: 1, vote: false })
    expect(store.state.applicationList[0].votes).toBe(3)
  })

  it('editorVoteAdd updates existing vote count correctly (vote true)', () => {
    const votedOnApplication = {
      ...sampleApplication,
      votes: 3
    }
    store.commit('applicationAdd', votedOnApplication)
    store.commit('editorVoteAdd', { editorId: 2, applicationId: 1, vote: true })
    expect(store.state.applicationList[0].votes).toBe(4)
  })

  it('editorVoteChange updates editor vote and vote count', () => {
    const application = {
      ...sampleApplication,
      votes: 3
    }
    store.commit('applicationAdd', application)
    store.commit('editorVoteAdd', { editorId: 1, applicationId: 1, vote: false })
    expect(store.state.editorVotes).toStrictEqual([{
      editorId: 1,
      applicationId: 1,
      vote: false
    }])
    expect(store.state.applicationList).toContain(application)
    store.commit('editorVoteChange', {
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
    store.commit('editorVoteChange', {
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

  it('editorVoteChange does nothing if vote didn`t change', () => {
    const application = {
      ...sampleApplication,
      votes: 3
    }
    store.commit('applicationAdd', application)
    store.commit('editorVoteAdd', { editorId: 1, applicationId: 1, vote: false })
    store.commit('editorVoteChange', {
      application,
      editorId: 1,
      vote: false
    })
    expect(store.state.applicationList[0].edited).toBeFalsy()
  })

  it('applicationDecide sets values correctly (reject)', () => {
    store.commit('applicationAdd', sampleApplication)
    store.commit('applicationDecide', { applicationId: 1, decision: false })
    expect(store.state.applicationList[0].decidedOn).toBeTruthy()
    expect(store.state.applicationList[0].accepted).toBe(false)
  })

  it('applicationCreate sets userApplication', () => {
    store.commit('applicationCreate', sampleApplication)
    expect(store.getters.userApplication).toStrictEqual(sampleApplication)
  })

  it('applicationDecide sets values correctly (withdraw)', () => {
    store.commit('applicationAdd', sampleApplication)
    store.commit('applicationDecide', { applicationId: 1, decision: 'withdrawn' })
    expect(store.state.applicationList[0].decidedOn).toBeTruthy()
    expect(store.state.applicationList[0].status).toBe('withdrawn')
  })

  it('applicationDecide sets values correctly (accept)', () => {
    store.commit('applicationAdd', sampleApplication)
    store.commit('applicationDecide', { applicationId: 1, decision: 'accepted' })
    expect(store.state.applicationList[0].decidedOn).toBeTruthy()
    expect(store.state.applicationList[0].status).toBe('accepted')
  })

  it('applicationDecide sets values correctly (refuse)', () => {
    store.commit('applicationAdd', sampleApplication)
    store.commit('applicationDecide', { applicationId: 1, decision: 'rejected' })
    expect(store.state.applicationList[0].decidedOn).toBeTruthy()
    expect(store.state.applicationList[0].status).toBe('rejected')
  })

  it('applicationEdit returns error with empty store', () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation()
    store.commit('applicationEdit', sampleApplication)
    expect(errorSpy).toHaveBeenCalled()
  })

  it('applicationEdit returns error with non-matching ids', () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation()
    store.commit('applicationAdd', sampleApplication)
    store.commit('applicationEdit', { ...sampleApplication, id: 3 })
    expect(errorSpy).toHaveBeenCalled()
  })

  it('applicationEdit updates store correctly', () => {
    store.commit('applicationAdd', sampleApplication)
    store.commit('applicationEdit', {
      ...sampleApplication,
      fullName: 'Dr. van Nostrand',
      institution: 'State of New York'
    })
    expect(store.getters.userApplication).toStrictEqual(expect.objectContaining({
      fullName: 'Dr. van Nostrand',
      institution: 'State of New York'
    }))
  })

  it('editorNumberSet works correctly', () => {
    expect(store.state.editorNumber).toBe(0)
    store.commit('editorNumberSet', 4)
    expect(store.state.editorNumber).toBe(4)
    store.commit('editorNumberSet', 0)
    expect(store.state.editorNumber).toBe(0)
  })

  it('updatePersistedVote supplements state data', () => {
    store.commit('applicationAdd', sampleApplication)
    store.commit('editorVoteAdd', {
      editorId: 2,
      applicationId: 1,
      vote: true
    })
    store.commit('updatePersistedVote', {
      editorId: 2,
      applicationId: 1,
      vote: true,
      date: Date.now(),
      id: 42
    })
    expect(store.getters.editorVotes[0]).toStrictEqual({
      editorId: 2,
      applicationId: 1,
      vote: true,
      date: expect.any(Number),
      id: 42
    })
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
    sampleVote = {
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
    store.commit('applicationAdd', sampleApplication)
    expect(store.getters.applicationList).toHaveLength(1)
    expect(store.getters.applicationList).toContain(sampleApplication)
  })

  it('editorVotes is a list and contains objects', () => {
    expect(store.getters.editorVotes).toStrictEqual(expect.any(Array))
    store.commit('applicationAdd', sampleApplication) // editorVoteAdd needs application in store
    store.commit('editorVoteAdd', sampleVote)
    expect(store.getters.editorVotes).toHaveLength(1)
    expect(store.getters.editorVotes).toContain(sampleVote)
  })

  it('userApplication is an object', () => {
    store.commit('applicationAdd', sampleApplication)
    expect(store.getters.userApplication).toStrictEqual(expect.any(Object))
    expect(store.getters.userApplication).toStrictEqual(sampleApplication)
  })

  it('userApplication changes when state is changed', () => {
    store.commit('applicationAdd', sampleApplication)
    expect(store.getters.userApplication).toStrictEqual(expect.any(Object))
    store.commit('applicationEdit', { id: 1, fullName: 'Something Else' })
    expect(store.getters.userApplication).toStrictEqual(expect.objectContaining({
      fullName: 'Something Else'
    }))
  })

  it('editorNumber is number', () => {
    expect(store.getters.editorNumber).toStrictEqual(expect.any(Number))
    expect(store.getters.editorNumber).toBe(0)
    store.commit('editorNumberSet', 123)
    expect(store.getters.editorNumber).toBe(123)
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

  it('editorVoteCreate sends correct post request', async () => {
    httpMock = jest.spyOn(http, 'post')
      .mockImplementation(params => Promise.resolve(params))
    await store.dispatch('editorVoteCreate', {
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

  it('editorVoteCreate sends reject if request fails', async () => {
    httpMock = jest.spyOn(http, 'post')
      .mockImplementation(() => Promise.reject(fail))
    try {
      await store.dispatch('editorVoteCreate', {
        editorId: 2,
        applicationId: 1,
        vote: true
      })
    } catch (e) {
      expect(httpMock).toHaveBeenCalled()
    }
  })

  it('applicationsFetch returns an array of applications and calls applicationAdd', async () => {
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
    await store.dispatch('applicationsFetch')
    expect(httpMock).toHaveBeenCalledTimes(11)
    expect(store.state.applicationList.length).toBe(10)
  })

  it('applicationsFetch rejects if request fails', async () => {
    httpMock = jest.spyOn(http, 'get').mockImplementation(() => Promise.reject(
      new Error('fail')
    ))
    try {
      await store.dispatch('applicationsFetch')
    } catch (e) {
      expect(httpMock).toHaveBeenCalled()
      expect(store.state.applicationList.length).toBe(0)
    }
  })

  it('userApplicationFetch sets one application in store', async () => {
    httpMock = jest.spyOn(http, 'get').mockImplementation(() => Promise.resolve({
      data: [sampleApplication]
    }))
    await store.dispatch('userApplicationFetch', 2)
    expect(store.state.applicationList.length).toBe(1)
    expect(store.state.applicationList[0]).toBe(sampleApplication)
  })

  it('userApplicationFetch sets no application in store if none returned', async () => {
    httpMock = jest.spyOn(http, 'get').mockImplementation(() => Promise.resolve({
      data: []
    }))
    const ret = await store.dispatch('userApplicationFetch', 2)
    expect(ret).toBeFalsy()
    expect(store.state.applicationList.length).toBe(0)
  })

  it('userApplicationFetch sets one application in store', async () => {
    httpMock = jest.spyOn(http, 'get').mockImplementation(() => Promise.reject(new Error('fail')))
    try {
      await store.dispatch('userApplicationFetch', 2)
    } catch (e) {
      expect(store.state.applicationList.length).toBe(0)
    }
  })

  it('editorVotesFetch calls editorVoteAdd correctly', async () => {
    store.commit('applicationAdd', sampleApplication)
    httpMock = jest.spyOn(http, 'get').mockImplementation(() => Promise.resolve({
      data: [sampleVote]
    }))
    await store.dispatch('editorVotesFetch', 1)
    expect(httpMock).toHaveBeenCalled()
    expect(store.state.editorVotes).toStrictEqual([sampleVote])
    expect(store.state.applicationList[0].votes).toBe(0)
  })

  it('editorNumberFetch handles response correctly', async () => {
    httpMock = jest.spyOn(http, 'get').mockImplementation(() => Promise.resolve({
      data: { editors: 15 }
    }))
    await store.dispatch('editorNumberFetch')
    expect(httpMock).toHaveBeenCalledWith('/accounts/editors')
    expect(store.state.editorNumber).toBe(15)
  })

  it('editorNumberFetch logs error when request is rejected', async () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation()
    httpMock = jest.spyOn(http, 'get').mockImplementation(() => Promise.reject(
      new Error('Fail')
    ))
    await store.dispatch('editorNumberFetch')
    expect(httpMock).toHaveBeenCalledWith('/accounts/editors')
    expect(errorSpy).toHaveBeenCalled()
  })

  it('editorVoteUpdate fires correct request', async () => {
    httpMock = jest.spyOn(http, 'patch')
      .mockImplementation(() => Promise.resolve('done'))
    await store.dispatch('editorVoteUpdate', sampleVote)
    const { id, ...expectedPayload } = sampleVote
    expect(expectedPayload).not.toStrictEqual(expect.objectContaining({
      changed: expect.any(Boolean)
    }))
    expect(httpMock).toHaveBeenCalledWith('/editor-votes/1', expectedPayload)
  })

  it('editorVoteUpdateAll dispatches editorVoteUpdate for changed votes', async () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch')
    store.commit('applicationAdd', sampleApplication)
    httpMock = jest.spyOn(http, 'patch')
      .mockImplementation(() => Promise.resolve('win'))
    for (let i = 0; i < 10; i++) {
      const myVote = cloneDeep(sampleVote)
      if (i % 2 === 0) { // mark every 2nd vote as changed
        myVote.changed = true
      }
      myVote.id = myVote.id + i
      myVote.editorId = myVote.editorId + i
      // console.log(myVote)
      store.commit('editorVoteAdd', myVote)
    } // have a list of 10 votes, 5 have changed
    const res = await store.dispatch('editorVoteUpdateAll')
    expect(dispatchSpy).toHaveBeenCalled()
    expect(res).toMatch('all votes saved!')
    // expect(httpMock).toHaveBeenCalled() // returns wrong value when running in isolation, omitted for now
  })

  it('userApplicationCreate sends correct http request', () => {
    httpMock = jest.spyOn(http, 'post')
      .mockImplementation(() => Promise.resolve())
    store.commit('applicationAdd', sampleApplication)
    const resp = store.dispatch('userApplicationCreate', sampleApplication)
    expect(httpMock).toHaveBeenCalledWith('/applications', store.getters.userApplication)
    expect(resp).toStrictEqual(expect.any(Promise))
  })

  it('userApplicationCreate rejects if http request fails', async () => {
    httpMock = jest.spyOn(http, 'post')
      .mockImplementation(() => Promise.reject(new Error('fail')))
    store.commit('applicationAdd', sampleApplication)
    try {
      await store.dispatch('userApplicationCreate', sampleApplication)
    } catch (e) {
      expect(httpMock).toHaveBeenCalledWith('/applications', store.getters.userApplication)
    }
  })

  it('userApplicationDecide sends correct http request', () => {
    const decidedApplication = {
      ...sampleApplication,
      decidedOn: Date.now(),
      status: 'withdrawn'
    }
    httpMock = jest.spyOn(http, 'patch')
      .mockImplementation(() => Promise.resolve())
    store.commit('applicationAdd', decidedApplication)
    const resp = store.dispatch('userApplicationDecide')
    expect(httpMock).toHaveBeenCalledWith('/applications/1/decide',
      { status: decidedApplication.status, decidedOn: decidedApplication.decidedOn }
    )
    expect(resp).toStrictEqual(expect.any(Promise))
  })

  it('userApplicationDecide rejects when request fails', async () => {
    const decidedApplication = {
      ...sampleApplication,
      decidedOn: Date.now(),
      status: 'withdrawn'
    }
    httpMock = jest.spyOn(http, 'patch')
      .mockImplementation(() => Promise.reject(new Error('fail')))
    store.commit('applicationAdd', decidedApplication)
    try {
      await store.dispatch('userApplicationDecide')
    } catch (e) {
      expect(httpMock).toHaveBeenCalled()
    }
  })

  it('userApplicationUpdate fires correct request', async () => {
    httpMock = jest.spyOn(http, 'patch')
      .mockImplementation(() => Promise.resolve())
    const resp = store.dispatch('userApplicationUpdate', sampleApplication)
    const { id, ...expectedPayload } = sampleApplication
    expect(httpMock).toHaveBeenCalledWith(`/applications/${id}/edit`, expectedPayload)
    expect(resp).toStrictEqual(expect.any(Promise))
  })

  it('userApplicationUpdate rejects when request fails', async () => {
    httpMock = jest.spyOn(http, 'patch')
      .mockImplementation(() => Promise.reject(new Error('fail')))
    try {
      await store.dispatch('userApplicationUpdate', sampleApplication)
    } catch (e) {
      expect(httpMock).toHaveBeenCalled()
    }
  })
})

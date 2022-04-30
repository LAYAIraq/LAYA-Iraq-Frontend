import { createLocalVue } from '@vue/test-utils'
import cloneDeep from 'lodash.clonedeep'
import Vuex from 'vuex'
import editor from '@/store/modules/editor'
import 'regenerator-runtime/runtime' // for async behavior in tests
import http from 'axios'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('editor store module', () => {
  let store
  let httpMock
  beforeEach(() => {
    store = new Vuex.Store(
      cloneDeep(editor)
    )
  })

  it('mutation addEditorVote works changes state', () => {
    store.commit('addEditorVote', { editorId: '2', applicationId: '1', vote: true })
    expect(store.state.editorVotes).toStrictEqual([{ editorId: '2', applicationId: '1', decision: true }])
  })

  it('mutation changeVote updates editor vote and vote count', () => {
    const application = {
      id: '1',
      votes: 3
    }
    store.state.applicationList.push(application)
    store.state.editorVotes.push({ editorId: '1', applicationId: '1', decision: false })
    expect(store.state.applicationList).toContain(application)
    store.commit('changeVote', {
      application,
      editorId: '1',
      vote: true
    })
    expect(store.state.editorVotes).toStrictEqual([{
      editorId: '1', applicationId: '1', decision: true, changed: true
    }])
    expect(application.votes).toBe(4)
    store.commit('changeVote', {
      application,
      editorId: '1',
      vote: false
    })
    expect(store.state.editorVotes).toStrictEqual([{
      editorId: '1', applicationId: '1', decision: false, changed: true
    }])
    expect(application.votes).toBe(3)
  })

  it('action createEditorVote sends correct post request', async () => {
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

  it('action getEditorVotes calls addEditorVote correctly', async () => {
    httpMock = jest.spyOn(http, 'get').mockImplementation(() => Promise.resolve({
      data: [{
        date: '2022-04-26T14:08:47.042Z',
        edited: null,
        vote: false,
        id: 1,
        editorId: 2,
        applicationId: 1
      }]
    }))
    await store.dispatch('getEditorVotes', 1)
    expect(httpMock).toHaveBeenCalled()
    expect(store.state.editorVotes).toStrictEqual([{
      editorId: 2, applicationId: 1, decision: false
    }])
  })

  it('action saveEditedVotes sends correct patch request', async () => {
    httpMock = jest.spyOn(http, 'patch').mockImplementation(params => Promise.resolve(params)
    )
    store.state.editorVotes = {
      1: { 2: { decision: false, changed: true } },
      2: { 3: { decision: true, changed: null } }
    }
    await store.dispatch('saveEditedVotes')
    expect(httpMock).toHaveBeenCalledWith('/editor-votes', expect.objectContaining({ editorId: '2', applicationId: '1', vote: false }))
  })
})

import { createLocalVue, mount } from '@vue/test-utils'
import cloneDeep from 'lodash.clonedeep'
import EditorPanel from '@/views/editor-panel.vue'
import Vuex from 'vuex'
import { BootstrapVue } from 'bootstrap-vue'
import 'regenerator-runtime/runtime'
import sampleApplication from '../../mocks/sample-application.json'
import sampleVote from '../../mocks/sample-vote.json'
import editor from '@/store/modules/editor'

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(BootstrapVue)

describe('editor panel', () => {
  let actions
  let commitSpy
  let dispatchSpy
  let getters
  let mutations
  let state
  let store
  let wrapper
  beforeEach(() => {
    state = {
      role: 'editor'
    }
    getters = {
      profileLang: () => 'en',
      isEditor: () => state.role === 'editor',
      userId: () => 42
    }

    store = new Vuex.Store({
      state,
      getters,
      modules: {
        editor: cloneDeep(editor)
      }
    })
    commitSpy = jest.spyOn(store, 'commit')
    dispatchSpy = jest.spyOn(store, 'dispatch')
      .mockImplementation(() => Promise.resolve())

    for (let i = 0; i < 10; i++) { // fill store with applications and votes
      const randomBool = () => {
        return Math.round(Math.random()) === 1
      }
      const randomId = () => {
        return Math.ceil(Math.random() * 10)
      }
      const app = { ...sampleApplication }
      app.id += i
      app.applicantId += i
      store.commit('addApplication', app)
      const vote1 = sampleVote
      vote1.id += (2 * i)
      vote1.vote = randomBool()
      vote1.applicationId = 1 + i
      vote1.editorId = randomId() % 3
      store.commit('addEditorVote', vote1)
      const vote2 = sampleVote
      vote2.id += (2 * i)
      vote2.vote = randomBool()
      vote2.applicationId = 1 + i
      vote2.editorId = randomId() % 3
      store.commit('addEditorVote', vote2)
    }

    wrapper = mount(EditorPanel, {
      store,
      mocks: {
        $router: {
          replace: jest.fn()
        }
      },
      localVue
    })
  })

  it('redirects non-editors', () => {
    state.role = 'author'
    wrapper = mount(EditorPanel, {
      store,
      mocks: {
        $router: {
          replace: jest.fn()
        }
      },
      localVue
    })
    expect(wrapper.vm.$router.replace).toHaveBeenCalledWith('/')
  })

  it('fetches editor votes onCreated', () => {
    expect(store.getters.applicationList.length).toBe(10)
    expect(store.getters.editorVotes.length).toBe(20)
    expect(dispatchSpy).toHaveBeenCalledWith('getApplications')
  })

  it('shows as many rows as there are applications', () => {
    expect(wrapper.findAll('.application-entry').length).toBe(10)
  })

  it('shows the correct name, institution and vote count for each application', () => {
    const applicationEntries = wrapper.findAll('.application-entry')
    for (const i in store.getters.applicationList) {
      expect(applicationEntries.at(i).find('.vote-count').text() ===
        String(store.getters.applicationList[i].votes)).toBeTruthy()
      expect(applicationEntries.at(i).find('.applicant-name').text() ===
        String(store.getters.applicationList[i].fullName)).toBeTruthy()
      expect(applicationEntries.at(i).find('.applicant-institution').text() ===
        String(store.getters.applicationList[i].institution)).toBeTruthy()
    }
  })

  it('shows modal containing correct values when clicking "view application"',
    async () => {
      await wrapper.find('.btn-secondary').trigger('click')
      const {
        applicationText,
        areaOfExpertise,
        fullName,
        institution
      } = wrapper.vm
      const modal = wrapper.find('#view-application')
      expect(modal.attributes('style')).not.toBe('display: none;')
      expect(modal.find('#modal-name').text()).toBe(fullName)
      expect(modal.find('#modal-text').text()).toBe(applicationText)
      expect(modal.find('#modal-expertise').text()).toBe(areaOfExpertise)
      expect(modal.find('#modal-institution').text()).toBe(institution)
    })

  it('increments count of application when editor votes yes', async () => {
    await wrapper.find('.btn-secondary').trigger('click')
    let voteCount = wrapper.vm.currentApplication.votes
    expect(wrapper.find('.btn-success').attributes('disabled')).toBeUndefined()
    await wrapper.find('.btn-success').trigger('click')
    await localVue.nextTick()
    expect(commitSpy).toHaveBeenLastCalledWith('addEditorVote', expect.objectContaining({
      editorId: 42,
      vote: true
    }))
    expect(wrapper.find('.vote-count').text()).toBe(String(++voteCount))
  })

  it('decreases count of application when editor revokes vote', async () => {
    store.commit('addEditorVote', { applicationId: 1, editorId: 42, vote: true })
    const modalButton = wrapper.find('.btn-secondary')
    await modalButton.trigger('click')
    const modal = wrapper.find('#view-application')
    const approveButton = modal.find('.btn-success')
    const revokeButton = modal.find('.btn-danger')
    let voteCount = wrapper.vm.currentApplication.votes
    expect(approveButton.attributes('disabled')).toBe('disabled')
    expect(revokeButton.attributes('disabled')).toBeUndefined()
    await revokeButton.trigger('click')
    await localVue.nextTick()
    expect(store.getters.applicationList[0].votes).toBe(--voteCount)
    expect(commitSpy).toHaveBeenLastCalledWith('changeVote', expect.objectContaining({
      editorId: 42,
      vote: false
    }))

    expect(wrapper.find('.vote-count').text()).toBe(String(voteCount))
  })
})

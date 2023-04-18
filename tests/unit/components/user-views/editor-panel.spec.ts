import { createLocalVue, mount } from '@vue/test-utils'
import cloneDeep from 'lodash.clonedeep'
import EditorPanel from '@/components/user-views/editor-panel.vue'
import Vuex from 'vuex'
import Storage from 'vue-ls'
import { BootstrapVue } from 'bootstrap-vue'
import 'regenerator-runtime/runtime'
import sampleApplication from '../../../mocks/sample-application.json'
import sampleVote from '../../../mocks/sample-vote.json'
import editor from '@/store/modules/editor'

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(BootstrapVue)
localVue.use(Storage, { name: 'ls', namespace: 'vuejs__', storage: 'local' })

describe('editor panel', () => {
  // let actions
  let commitSpy
  let dispatchSpy
  let getters
  // let mutations
  let state
  let store
  let wrapper
  beforeAll(() => {
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
    store.commit('setNumberOfEditors', 42)

    // fill store with data
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
      const vote1 = cloneDeep(sampleVote)
      vote1.id += (2 * i)
      vote1.vote = randomBool()
      vote1.applicationId = 1 + i
      vote1.editorId = randomId() % 3
      store.commit('addEditorVote', vote1)
      const vote2 = { ...sampleVote }
      vote2.id += (2 * i) + 1
      vote2.vote = randomBool()
      vote2.applicationId = 1 + i
      vote2.editorId = randomId() % 3
      store.commit('addEditorVote', vote2)
    }
  })
  beforeEach(() => {
    commitSpy = jest.spyOn(store, 'commit')
    dispatchSpy = jest.spyOn(store, 'dispatch')
      .mockImplementation(() => Promise.resolve())

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
      expect(applicationEntries.at(i).find('.application-status').text())
        .toMatch(/(Approved)|(\d\s*\n?\/\s*\d)/)
      if (applicationEntries.at(i).find('.vote-count').exists()) {
        expect(applicationEntries.at(i).find('.vote-count').text())
          .toBe(String(store.getters.applicationList[i].votes))
      }
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
    expect(store.getters.editorVotes.some(e => e.editorId === 42)).toBeFalsy()
    const myApplication = wrapper.findAll('.application-entry').at(0)
    await myApplication.find('.btn-secondary').trigger('click')
    const voteCount = wrapper.vm.currentApplication.votes
    expect(wrapper.vm.existingVote).toBeFalsy()
    expect(wrapper.vm.approved).toBeFalsy()
    expect(wrapper.find('#approve-button').attributes('disabled')).toBeUndefined()
    await wrapper.find('#approve-button').trigger('click')
    await localVue.nextTick()
    expect(commitSpy).toHaveBeenLastCalledWith('addEditorVote', expect.objectContaining({
      editorId: 42,
      vote: true
    }))
    expect(myApplication.find('.vote-count').text()).toBe(String(voteCount + 1))
  })

  it('decreases count of application when editor revokes vote', async () => {
    if (store.getters.editorVotes.some(e => e.editorId === 42)) {
      store.commit('changeVote', {
        application: store.getters.applicationList[0],
        editorId: 42,
        vote: true
      })
    } else {
      store.commit('addEditorVote', { applicationId: 1, editorId: 42, vote: true })
    }
    const modalButton = wrapper.find('.btn-secondary')
    await modalButton.trigger('click')
    const modal = wrapper.find('#view-application')
    const approveButton = modal.find('.btn-success')
    const revokeButton = modal.find('.btn-danger')
    const voteCount = wrapper.vm.currentApplication.votes
    expect(approveButton.attributes('disabled')).toBe('disabled')
    expect(revokeButton.attributes('disabled')).toBeUndefined()
    await revokeButton.trigger('click')
    await localVue.nextTick()
    expect(store.getters.applicationList[0].votes).toBe(voteCount - 1)
    expect(commitSpy).toHaveBeenLastCalledWith('changeVote', expect.objectContaining({
      editorId: 42,
      vote: false
    }))
    expect(wrapper.find('.vote-count').text()).toBe(String(voteCount - 1))
  })

  it('increases count of application when editor changes vote from no to yes', async () => {
    if (store.getters.editorVotes.some(e => e.editorId === 42)) {
      store.commit('changeVote', {
        application: store.getters.applicationList[0],
        editorId: 42,
        vote: false
      })
    } else {
      store.commit('addEditorVote', { applicationId: 1, editorId: 42, vote: false })
    }
    const modalButton = wrapper.find('.btn-secondary')
    await modalButton.trigger('click')
    const modal = wrapper.find('#view-application')
    const approveButton = modal.find('.btn-success')
    const revokeButton = modal.find('.btn-danger')
    const voteCount = wrapper.vm.currentApplication.votes
    expect(approveButton.attributes('disabled')).toBeUndefined()
    expect(revokeButton.attributes('disabled')).toBe('disabled')
    await approveButton.trigger('click')
    await localVue.nextTick()
    expect(store.getters.applicationList[0].votes).toBe(voteCount + 1)
    expect(commitSpy).toHaveBeenLastCalledWith('changeVote', expect.objectContaining({
      editorId: 42,
      vote: true
    }))
    // await localVue.nextTick()
    // expect(wrapper.find('.vote-count').text()).toBe(String(voteCount + 1))
  })

  it('shows editor`s decision for each application', async () => {
    for (let i = 1; i <= 10; i++) { // have all decisions in editorVotes
      if (i % 3 !== 0) { // leave out every third application
        store.commit('addEditorVote', {
          applicationId: i,
          editorId: 42,
          vote: (i % 2 === 0) // approve if index is even
        })
      }
    }
    await localVue.nextTick()
    expect(store.getters.editorVotes.some(el => el.editorId === 42 && el.applicationId % 3 === 0)).toBeFalsy()
    const applications = wrapper.findAll('.application-entry')
    for (let i = 1; i < applications.length; i++) {
      const editorStatus = applications.at(i - 1).find('.editor-decision').text()
      expect(editorStatus).toMatch(/(Approved)|(Rejected)|(Awaiting decision)/)
    }
  })

  it('shows approved button when application reaches threshold, "0 / 3" else',
    async () => {
      store.getters.applicationList.forEach(a => {
        const i = store.getters.applicationList.findIndex(el => el === a)
        a.votes = i % 2 === 0 ? 3 : 0
      })
      await localVue.nextTick()
      const applications = wrapper.findAll('.application-status')
      applications.wrappers.forEach(wrap => {
        expect(wrap.text()).toMatch(/(Approved)|(\d\s*\n?\/\s*3)/)
      })
    })

  it('saves votes beforeDestroy', () => {
    wrapper.destroy()
    expect(dispatchSpy).toHaveBeenCalledWith('saveVotes')
  })
})

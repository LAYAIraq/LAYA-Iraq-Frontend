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
      isEditor: () => state.role === 'editor'
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
})

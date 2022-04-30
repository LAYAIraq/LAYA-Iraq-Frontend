import http from 'axios'

export default {
  state: {
    applicationList: [],
    editorVotes: []
  },
  getters: {
    applicationList: (state: { applicationList: Array<object> }) => state.applicationList,
    editorVotes: (state: { editorVotes: Array<object> }) => state.editorVotes
  },
  mutations: {
    /**
     * function addEditorVote: push editorVote into editorVotes array
     *
     * Author: cmc
     *
     * Last Updated: April 30, 2022
     * @param state contains editorVotes array
     * @param applicationId id for application
     * @param editorId id for editor
     * @param vote boolean for decision
     */
    addEditorVote (
      state: { editorVotes: Array<object> },
      { applicationId, editorId, vote } : {
      applicationId: number,
      editorId: number,
      vote: boolean
      }
    ) {
      state.editorVotes.push({ applicationId, editorId, decision: vote })
    },
    /**
     * function changeVote: change value for editor's vote on application, call only if
     *  vote for editor already exists
     *
     * Author: cmc
     *
     * Last Updated: April 30, 2022
     * @param state state variables
     * @param application reference to state.applicationList entry
     * @param editorId id of voting editor
     * @param vote true if endorsed, false if not
     */
    changeVote (state: {
        // applicationsList: [{ (id): number, votes: number }],
        editorVotes: Array<{
          applicationId: number,
          editorId: number,
          decision: boolean,
          changed?: boolean
        }>
      }, { application, editorId, vote }: {
      application : { id: number, votes: number },
      editorId: number,
      vote: boolean
      }
    ) {
      const editorVote = state.editorVotes.find(elem =>
        elem.editorId === editorId && elem.applicationId === application.id
      ) // return vote for application and editor
      if (editorVote.decision !== vote) {
        editorVote.changed = true
        vote
          ? application.votes++ // vote changed from no to yes, increment count
          : application.votes-- // vote changed from yes to no, decrement count
      } else {
        console.log('Vote not changed')
      }
      editorVote.decision = vote
    }
  },
  actions: {
    /**
     * function createEditorVote: persist vote in database
     *
     * Author: cmc
     *
     * Last Updated: April 28, 2022
     * @param state state variables
     * @param applicationId id of vote application
     * @param editorId id of voting editor
     * @param vote value of vote
     */
    createEditorVote ({ state }, { applicationId, editorId, vote } : {
      applicationId: number,
      editorId: number,
      vote: boolean,
    }) {
      http.post('/editor-votes', {
        applicationId: applicationId,
        editorId: editorId,
        vote: vote
      })
        .catch(err => console.error(err))
    },

    /**
     * function getEditorVotes: retrieve exisiting votes for specified application
     *
     * Author: cmc
     *
     * Last Updated: April 28, 2022
     * @param commit used to alter state
     * @param applicationId the application for which we retrieve the votes
     */
    getEditorVotes ({ commit }, applicationId: number) {
      return new Promise((resolve, reject) => {
        http.get('/editor-votes', { params: { filter: { where: { applicationId: applicationId } } } })
          .then(resp => {
            resp.data.forEach(voteEntry => {
              commit('addEditorVote', {
                applicationId: applicationId,
                editorId: voteEntry.editorId,
                vote: voteEntry.vote
              })
            })
            resolve('editor votes loaded')
          })
          .catch(err => reject(err))
      })
    },

    /**
     * function saveEditedVote: send patch request for changed vote
     *
     * Author: cmc
     *
     * Last Updated: April 30, 2022
     * @param state for signature
     * @param data payload for patch request
     */
    saveEditedVote ({ state }, data: {
      applicationId: number,
      editorId: number,
      id: number,
      vote: boolean
    }) {
      const { id, ...updateData } = data
      http.patch(`/editor-votes/${data.id}`, {
        updateData,
        date: Date.now()
      })
        .catch(err => console.error(err))
    },

    /**
     * update changed votes in database
     *
     * Author: cmc
     *
     * Last Updated: April 28, 2022
     * @param state has editorVotes property
     * @param dispatch store dispatch function
     */
    saveEditedVotes ({ state, dispatch }) {
      // iterate through all keys in editorVotes (i.e. each application)
      state.editorVotes.forEach(vote => {
        // if vote has changed, update in database
        if (typeof (vote.changed) !== 'undefined') {
          dispatch('saveEditedVote', { ...vote })
        }
      })
    },

    /**
     * function saveVote: send post request for new vote
     *
     * Author: cmc
     *
     * Last Updated: April 30, 2022
     * @param state for signature
     * @param data payload for post request
     */
    saveVote ({ state }, data: {
      applicationId: number,
      editorId: number,
      vote: boolean
    }) {
      http.post('/editor-votes', { ...data })
        .catch(err => console.error(err))
    },

    /**
     * function saveVotes: send post requests for all new votes
     *
     * Author: cmc
     *
     * Last Updated: April 30, 2022
     * @param state for signature
     * @param dispatch dispatch function
     */
    saveVotes ({ state, dispatch }) {
      // iterate through all keys in editorVotes (i.e. each application)
      state.editorVotes.forEach(vote => {
        // if vote has not changed, i.e. is new, persist in database
        if (typeof (vote.changed) === 'undefined') {
          dispatch('saveVote', { ...vote })
        }
      })
    },

    /**
     * function sendApplication: send post request for application
     *
     * Author: cmc
     *
     * Last Updated: April 30, 2022
     * @param state for signature
     * @param data payload for post request
     */
    sendApplication ({ state }, data: object) {
      return new Promise((resolve, reject) => {
        http.post('/applications', data)
          .then(resp => resolve(resp))
          .catch(err => reject(err))
      })
    },

    /**
     * function updateApplication: send patch request for application
     *
     * Author: cmc
     *
     * Last Updated: April 30, 2022
     * @param state for signature
     * @param data payload for patch request
     */
    updateApplication ({ state }, data: { id: number }) {
      const { id, ...updateData } = data
      return new Promise((resolve, reject) => {
        http.patch(`/applications/${data.id}`, {
          updateData
        })
          .then(resp => resolve(resp))
          .catch(err => reject(err))
      })
    }
  }
}

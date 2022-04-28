import http from 'axios'

export default {
  state: {
    applicationList: [],
    editorVotes: {}
  },
  getters: {
    applicationList: (state: { applicationList: Array<object> }) => state.applicationList,
    editorVotes: (state: { editorVotes: object }) => state.editorVotes
  },
  mutations: {
    addEditorVote ({ state }, { applicationId, editorId, vote } : {
      applicationId: string,
      editorId: string,
      vote: boolean
    }) {
      state.editorVotes[applicationId][editorId].decision = vote
    },
    /**
     * function changeVote: change value for editor's vote on application, create
     *  database entry if not present
     *
     * Author: cmc
     *
     * Last Updated: April 28, 2022
     * @param state state variables
     * @param commit state commit function
     * @param dispatch state dispatch function
     * @param application reference to state.applicationList entry
     * @param editorId id of voting editor
     * @param vote true if endorsed, false if not
     */
    async changeVote ({ state, commit, dispatch }: {
      state: {
        applicationsList: [{id: string, votes: number}],
        editorVotes: object
      },
      commit: Function,
      dispatch: Function
    }, { application, editorId, vote }: {
      application : { id: string, votes: number },
      editorId: string,
      vote: boolean
    }) {
      // check if votes are stored yet, retrieve if not
      const applicationsVotes = state.editorVotes[application.id]
      if (applicationsVotes && Object.keys(applicationsVotes).length !== 0) {
        await dispatch('getEditorVotes', application.id)
      }
      // create vote in database if not present, increment vote count
      if (typeof (applicationsVotes[editorId]) !== 'undefined') {
        commit('addEditorVote', {
          applicationId: application.id,
          editorId: editorId,
          vote: vote
        })
        if (vote) application.votes++
      // indicate that vote changed and change vote count accordingly
      } else if (applicationsVotes[editorId].decision !== vote) {
        applicationsVotes[editorId].changed = true
        vote ? application.votes++ : application.votes--
      } else {
        console.log('Vote not changed')
      }
      applicationsVotes[editorId].decision = vote
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
      applicationId: string,
      editorId: string,
      vote: boolean
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
    getEditorVotes ({ commit }, applicationId: string) {
      return new Promise((resolve, reject) => {
        http.get('/editor-votes', { params: { filter: { where: { applicationId: applicationId } } } })
          .then((resp) => {
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
     * update changed votes in database
     *
     * Author: cmc
     *
     * Last Updated: April 28, 2022
     * @param state has editorVotes property
     */
    saveEditedVotes ({ state }) {
      // iterate through all keys in editorVotes (i.e. each application)
      Object.keys(state.editorVotes).forEach(applicationId => {
        // iterate through all keys for each application (i.e. each vote)
        Object.keys(state.editorVotes[applicationId]).forEach(editorId => {
          // if vote has changed, update in database
          if (state.editorVotes[applicationId][editorId].changed) {
            http.patch('/editor-votes', {
              applicationId: applicationId,
              editorId: editorId,
              vote: state.editorVotes[applicationId][editorId].vote,
              date: Date.now()
            })
              .catch(err => console.error(err))
          }
        })
      })
    }
  }
}

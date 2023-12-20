/**
 * Filename: applications.ts
 * Use: organize editor application votes
 * Author: cmc
 * Since: v1.2.0
 */
import http from 'axios'
import Vue from 'vue'

export default {
  state: {
    applicationList: [],
    editorNumber: 0,
    editorVotes: []
  },
  getters: {
    applicationList: (state: { applicationList: Array<{
      applicationText: string,
      areaOfExpertise: string,
      fullName: string,
      id: number,
      institution: string,
      votes?: number
    }> }) => state.applicationList,
    editorVotes: (state: { editorVotes: Array<{
      applicationId: number,
      editorId: number,
      vote: boolean
    }> }) => state.editorVotes,
    editorNumber: (state: { editorNumber: number }) => state.editorNumber,
    userApplication: (state: { applicationList: [{
      id: number,
      applicationText: string,
      areaOfExpertise: string,
      fullName: string,
      institution: string
    }] }) => state.applicationList[0]
  },
  mutations: {
    /**
     * function applicationAdd: append application to applicationList
     *
     * Author: cmc
     *
     * Last Updated: May 1, 2022
     * @param state contains applicationList
     * @param application item to append
     */
    applicationAdd (state: { applicationList: Array<object> }, application: object) {
      state.applicationList.push(application)
    },

    /**
     * function applicationCreate: create new application in applicationList
     *
     * Author: cmc
     *
     * Last Updated: May 1, 2022
     * @param state contains applicationList
     * @param application item to append
     */
    applicationCreate (state: { applicationList: [] }, application: object) {
      Vue.set(state.applicationList, 0, application)
    },

    /**
     * applicationDecide: use to decide on application
     *
     * Author: cmc
     *
     * Last Updated: May 1, 2022
     * @param state
     * @param data application: reference to object in state, decision: one of
     *  'withdrawn', 'accepted', 'rejected'
     */
    applicationDecide (state: {
                         applicationList: Array<{
                           status?: string,
                           decidedOn?: number,
                           id: number
                         }>
                       }, data: {
                         applicationId: number,
                         decision: string
                       }
    ) {
      const app = state.applicationList.find(app => app.id === data.applicationId)
      app.status = data.decision
      app.decidedOn = Date.now()
    },

    /**
     * function applicationEdit: only call for applicants, updated instance returned by
     *  userApplication getter
     *
     *  Author: cmc
     *
     *  Last Updated: May 3, 2022
     * @param state contains applicationList with exactly one element
     * @param data updated
     */
    applicationEdit (state: { applicationList: [{ id: number }?] }, data: { id: number }) {
      if (state.applicationList.length === 0) {
        console.error('empty applicationList!')
      } else if (state.applicationList[0].id !== data.id) {
        console.error('IDs don`t match!')
      } else {
        // console.log(data)
        Vue.set(state.applicationList, 0, { ...state.applicationList[0], ...data }) // to retain reactivity
        // state.applicationList[0] = { ...state.applicationList[0], ...data }
        // console.log(state.applicationList[0])
      }
    },

    /**
     * cleatApplicationList: reset application list
     *
     * Author: cmc
     *
     * Last Updated: May 17, 2022
     * @param state contains applicationList
     */
    applicationListClear (state: { applicationList: Array<object> }) {
      state.applicationList = []
    },

    /**
     * function editorNumberSet: set number of editors
     *
     * Author: cmc
     *
     * Last Updated: May 1, 2022
     * @param state contains editorNumber
     * @param num number to set
     */
    editorNumberSet (state: { editorNumber: number }, num: number) {
      state.editorNumber = num
    },

    /**
     * function editorVoteAdd: push editorVote into editorVotes array, update
     *  application`s vote count accordingly
     *
     * Author: cmc
     *
     * Last Updated: April 30, 2022
     * @param state contains editorVotes array
     * @param vote object representing editor vote
     */
    editorVoteAdd (
      state: {
        applicationList: Array<{ id: number, votes?: number }>
        editorVotes: Array<object>
      },
      vote: { applicationId: number, vote: boolean, changed?: boolean }
    ) {
      // vote.changed = true // flag changed to be persisted by editorVoteUpdateAll
      state.editorVotes.push(vote)
      const associatedApplication = state.applicationList.find(
        elem => elem.id === vote.applicationId
      )
      const applicationIdx = state.applicationList.findIndex(el =>
        el === associatedApplication)
      associatedApplication.votes = associatedApplication.votes // depending if votes already exist
        ? vote.vote
          ? ++associatedApplication.votes // increment if vote is true
          : associatedApplication.votes // do nothing if vote is false
        : vote.vote // votes non-exisitent yet
          ? 1 // set to 1 if vote true
          : 0 // else
      Vue.set(state.applicationList, applicationIdx, associatedApplication)
    },

    /**
     * function editorVoteChange: change value for editor's vote on application, call only if
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
    editorVoteChange (state: {
        applicationList: [{ id: number, votes: number }],
        editorVotes: Array<{
          applicationId: number,
          date: number,
          editorId: number,
          vote: boolean,
          edited: Array<{ date: number, vote: boolean }>,
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
      const applicationIdx = state.applicationList.findIndex(el => el === application)
      if (editorVote.vote !== vote) { // push old decision to edited array, update
        editorVote.changed = true
        editorVote.edited
          ? editorVote.edited.push({ date: editorVote.date, vote: editorVote.vote })
          : editorVote.edited = [{ date: editorVote.date, vote: editorVote.vote }]
        editorVote.date = Date.now()
        vote
          ? application.votes++ // vote changed from no to yes, increment count
          : application.votes-- // vote changed from yes to no, decrement count
        Vue.set(state.applicationList, applicationIdx, application)
      } /* else {
        console.log('Vote not changed')
      } */
      editorVote.vote = vote
    },

    /**
     * function updatePersistedVote: change state after new vote is saved in db
     *
     * Author: cmc
     * @param state has editorVotes
     * @param data vote supplemented by created, id
     */
    updatePersistedVote (
      state: { editorVotes: Array<{
          applicationId: number,
          editorId: number
      }>},
      data: {
      editorId: number, applicationId: number
    }) {
      const editorVoteIdx = state.editorVotes.findIndex(
        el => el.editorId === data.editorId && el.applicationId === data.applicationId
      )
      Vue.set(state.editorVotes, editorVoteIdx, data)
    }
  },
  actions: {
    /**
     * applicationsFetch: get 10 undecided applications, when n already in state
     *  skip n
     *
     * Author: cmc
     *
     * Last Updated: May 1, 2022
     * @param store internal properties
     * @returns Promise
     */
    applicationsFetch ({ state, commit, dispatch }) {
      return new Promise((resolve, reject) => {
        http.get('applications', {
          params: {
            filter: {
              limit: 10,
              order: 'created DESC',
              skip: state.applicationList.length,
              where: {
                decidedOn: null
              }
            }
          }
        })
          .then(resp => {
            resp.data.forEach(async (application) => {
              commit('applicationAdd', application)
              await dispatch('editorVotesFetch', application.id)
                .catch(err => reject(err))
            })
          })
          .catch(err => reject(err))
          .finally(() => resolve('applications loaded!'))
      })
    },

    /**
     * function editorNumberFetch: retrieve number of editors from db
     *
     * Author: cmc
     *
     * Last Updated: May 1, 2022
     * @param commit state mutation
     */
    editorNumberFetch ({ commit }) {
      http.get('/accounts/editors')
        .then(resp => commit('editorNumberSet', resp.data.editors))
        .catch(err => console.error(err))
    },

    /**
     * function editorVoteCreate: persist vote in database, update editorVote
     *  entry with persisted data
     *
     * Author: cmc
     *
     * Last Updated: April 28, 2022
     * @param state state variables
     * @param commit state mutation
     * @param applicationId id of vote application
     * @param editorId id of voting editor
     * @param vote value of vote
     */
    editorVoteCreate ({ state, commit }, { applicationId, editorId, vote } : {
      applicationId: number,
      editorId: number,
      vote: boolean,
    }) {
      return new Promise((resolve, reject) => {
        http.post('/editor-votes', {
          applicationId: applicationId,
          editorId: editorId,
          vote: vote
        })
          .then(resp => {
            commit('updatePersistedVote', resp.data)
            resolve(resp.data)
          })
          .catch(err => reject(err))
      })
    },

    /**
     * function editorVotesFetch: retrieve existing votes for specified application
     *
     * Author: cmc
     *
     * Last Updated: April 28, 2022
     * @param commit used to alter state
     * @param applicationId the application for which we retrieve the votes
     */
    editorVotesFetch ({ commit }, applicationId: number) {
      return new Promise((resolve, reject) => {
        http.get('/editor-votes', {
          params: {
            filter: {
              where: { applicationId: applicationId }
            }
          }
        })
          .then(resp => {
            resp.data.forEach(voteEntry => {
              commit('editorVoteAdd', voteEntry)
            })
            resolve('editor votes loaded')
          })
          .catch(err => reject(err))
      })
    },

    /**
     * function editorVoteUpdate: send post request for vote
     *
     * Author: cmc
     *
     * Last Updated: April 30, 2022
     * @param state for signature
     * @param data payload for post request
     */
    editorVoteUpdate ({ state }, data: { id: number }) {
      const { id, ...updatedVote } = data
      // console.log(updatedVote)
      return new Promise((resolve, reject) => {
        http.patch(`/editor-votes/${data.id}`, updatedVote)
          .then(resp => resolve(resp.data))
          .catch(err => reject(err))
      })
    },

    /**
     * function editorVoteUpdateAll: send patch requests for all changed votes,
     *  dispatch editorVoteCreate for new votes
     *
     * Author: cmc
     *
     * Last Updated: April 30, 2022
     * @param state for signature
     * @param dispatch dispatch function
     */
    editorVoteUpdateAll ({ state, dispatch }) {
      // iterate through all keys in editorVotes (i.e. each application)
      return new Promise((resolve, reject) => {
        state.editorVotes.forEach(async vote => {
          // if vote has changed, persist in database
          if (vote.changed) {
            if (vote.id) { // vote existed before
              const { changed, ...voteToSave } = vote // strip changed property
              await dispatch('editorVoteUpdate', voteToSave)
                .catch(err => reject(err))
            } else { // new vote, no ID yet
              const { changed, ...newVote } = vote
              await dispatch('editorVoteCreate', newVote)
                .catch(err => reject(err))
            }
          }
        })
        resolve('all votes saved!')
      })
    },

    /**
     * function userApplicationCreate: send post request for application
     *
     * Author: cmc
     *
     * Last Updated: April 30, 2022
     * @param getters consists userApplication
     */
    userApplicationCreate ({ getters }) {
      return new Promise((resolve, reject) => {
        http.post('/applications', getters.userApplication)
          .then(resp => resolve(resp))
          .catch(err => reject(err))
      })
    },

    /**
     * function userApplicationDecide: send patch request for decided
     *  application
     *
     * Author: cmc
     *
     * Last Updated: May 6, 2022
     * @param getters consists userApplication
     */
    userApplicationDecide ({ getters }) {
      const { id, status, decidedOn } = getters.userApplication
      return new Promise((resolve, reject) => {
        http.patch(`/applications/${id}/decide`, { decidedOn, status })
          .then(resp => resolve(resp))
          .catch(err => reject(err))
      })
    },

    /**
     * userApplicationFetch: return user's application if it exists
     *
     * Author: cmc
     *
     * Last Updated: May 1, 2022
     * @param state store state
     * @param commit state mutations
     * @param userId id for user
     */
    userApplicationFetch ({ state, commit }, userId: number) {
      return new Promise((resolve, reject) => {
        http.get('applications',
          { params: { filter: { where: { applicantId: userId } } } }
        )
          .then(resp => {
            if (resp.data.length === 1) {
              commit('applicationAdd', resp.data[0])
              resolve(true)
            } else { // no application for userId
              resolve(false)
            }
          })
          .catch(err => reject(err))
      })
    },

    /**
     * function userApplicationUpdate: send patch request for application
     *
     * Author: cmc
     *
     * Last Updated: April 30, 2022
     * @param state for signature
     * @param data payload for patch request
     */
    userApplicationUpdate ({ state }, data: { id: number }) {
      const { id, ...updateData } = data
      return new Promise((resolve, reject) => {
        http.patch(`/applications/${data.id}/edit`, updateData)
          .then(resp => resolve(resp))
          .catch(err => reject(err))
      })
    }
  }
}

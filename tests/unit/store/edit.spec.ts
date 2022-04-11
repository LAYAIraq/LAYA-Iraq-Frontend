import cloneDeep from 'lodash.clonedeep'
import edit from '@/store/modules/edit'
import { createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'

// FIXME: probably related to this: https://github.com/facebook/jest/issues/10147
// jest.mock('http', () => ({
//   get: () => Promise.resolve('value'),
//   post: () => Promise.resolve('value'),
//   patch: () => Promise.resolve('value'),
//   all: () => Promise.resolve('value')
// }))

const localVue = createLocalVue()
localVue.use(Vuex)

describe('store module edit', () => {
  const store = new Vuex.Store({
    modules: {
      edit: cloneDeep(edit)
    }
  })
  // dummy test to make test suite pass
  it('returns correct thingy', () => {
    expect(store.getters.courseUpdated).toBeFalsy()
  })

  // it('fires deleteCourse()', () => {
  //   store.dispatch('deleteCourse')
  //   expect(store.state).toBeDefined()
  // })
})

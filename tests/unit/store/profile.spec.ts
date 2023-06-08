import cloneDeep from 'lodash.clonedeep'
import profile from '@/store/modules/profile'
import Vuex from 'vuex'
import { createLocalVue } from '@vue/test-utils'

const localVue = createLocalVue()
localVue.use(Vuex)
describe('profile store module', () => {
  let store
  const { state, getters, mutations, actions } = profile
  describe('mutations', () => {
    beforeAll(() => {
      store = new Vuex.Store(
        {
          modules: {
            profile
          }
        }
      )
    })
    describe('institution', () => {
      it('is set to param value', () => {
        expect(state.institution).toBeFalsy()
        store.commit('institutionSet', 'testname')
        expect(state.institution).toBe('testname')
      })
      it('will be overwritten when set before', () => {
        expect(state.institution).toBe('testname')
        store.commit('institutionSet', 'newName')
        expect(state.institution).toBe('newName')
      })
      it('can be set to empty string', () => {
        store.commit('institutionSet', '')
        expect(state.institution).toBeFalsy()
      })
    })
    describe('email', () => {
      it('is set to param value', () => {
        expect(state.email).toBeFalsy()
        store.commit('emailSet', 'testname')
        expect(state.email).toBe('testname')
      })
      it('will be overwritten when set before', () => {
        expect(state.email).toBe('testname')
        store.commit('emailSet', 'newName')
        expect(state.email).toBe('newName')
      })
      it('can be set to empty string', () => {
        store.commit('emailSet', '')
        expect(state.email).toBeFalsy()
      })
    })
    describe('fullName', () => {
      it('is set to param value', () => {
        expect(state.fullName).toBeFalsy()
        store.commit('fullNameSet', 'testname')
        expect(state.fullName).toBe('testname')
      })
      it('will be overwritten when set before', () => {
        expect(state.fullName).toBe('testname')
        store.commit('fullNameSet', 'newName')
        expect(state.fullName).toBe('newName')
      })
      it('can be set to empty string', () => {
        store.commit('fullNameSet', '')
        expect(state.fullName).toBeFalsy()
      })
    })
    describe('username', () => {
      it('is set to param value', () => {
        expect(state.username).toBeFalsy()
        store.commit('usernameSet', 'testname')
        expect(state.username).toBe('testname')
      })
      it('will be overwritten when set before', () => {
        expect(state.username).toBe('testname')
        store.commit('usernameSet', 'newName')
        expect(state.username).toBe('newName')
      })
      it('can be set to empty string', () => {
        store.commit('usernameSet', '')
        expect(state.username).toBeFalsy()
      })
    })
    describe('language', () => {
      it('is set to param value', () => {
        expect(state.language).toBe('en')
        store.commit('languageSet', 'de')
        expect(state.language).toBe('de')
      })
      it('will be set to "en" when setting unsupported language', () => {
        expect(state.language).toBe('de')
        store.commit('languageSet', 'gr')
        expect(state.language).toBe('de')
      })
      it('can\'t be set to empty string', () => {
        store.commit('languageSet', '')
        expect(state.language).not.toBeFalsy()
      })
    })
    describe('occupation', () => {
      it('is set to param value', () => {
        expect(state.occupation).toBeFalsy()
        store.commit('occupationSet', 'testname')
        expect(state.occupation).toBe('testname')
      })
      it('will be overwritten when set before', () => {
        expect(state.occupation).toBe('testname')
        store.commit('occupationSet', 'newName')
        expect(state.occupation).toBe('newName')
      })
      it('can be set to empty string', () => {
        store.commit('occupationSet', '')
        expect(state.occupation).toBeFalsy()
      })
    })
    describe('preferences', () => {
      it('has initial state', () => {
        expect(state.preferencesFont).toStrictEqual(expect.objectContaining({
          chosen: 'standard',
          size: 18
        }))
        expect(state.preferencesLanguages).toStrictEqual(expect.objectContaining({
          english: true,
          german: false,
          arabic: false,
          kurdish: false
        }))
        expect(state.preferencesMedia).toStrictEqual(expect.objectContaining({
          audio: false,
          simple: false,
          text: true,
          video: true
        }))
      })
      it('doesn\'t change if setter is empty', () => {
        store.commit('preferencesSet', {})
        expect(state.preferencesFont).toStrictEqual(expect.objectContaining({
          chosen: 'standard',
          size: 18
        }))
        expect(state.preferencesLanguages).toStrictEqual(expect.objectContaining({
          english: true,
          german: false,
          arabic: false,
          kurdish: false
        }))
        expect(state.preferencesMedia).toStrictEqual(expect.objectContaining({
          audio: false,
          simple: false,
          text: true,
          video: true
        }))
      })
      it('keeps settings that are not touched', () => {
        store.commit('preferencesSet', {
          language: {
            kurdish: true
          },
          font: {
            size: 20
          },
          media: {
            audio: true
          }
        })
        expect(state.preferencesLanguages).toStrictEqual(
          expect.objectContaining({ kurdish: true, english: true })
        )
        expect(state.preferencesFont).toStrictEqual(
          expect.objectContaining({ chosen: 'standard', size: 20 })
        )
        expect(state.preferencesMedia).toStrictEqual(
          expect.objectContaining({ audio: true, simple: false })
        )
      })
    })
    describe('profile', () => {
      it('is set to what is put in', () => {
        const prfl = {
          username: 'test',
          email: 'test@laya',
          institution: 'vechta',
          occupation: 'professor',
          fullName: 'test User',
          avatar: 'avatar.jpg',
          language: 'de'
        }
        store.commit('profileSet', prfl)
        expect(state).toStrictEqual(
          expect.objectContaining(prfl)
        )
      })
    })
  })
})

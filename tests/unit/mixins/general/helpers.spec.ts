import { filterObject, kebabToCamel, camelToRender } from '@/mixins/general/helpers'

describe('helpers.ts', () => {
  describe('filterObject', () => {
    const testObj = {
      a: 'a',
      b: 'b',
      c: 'c',
      d: {
        e: 'e',
        f: 'f'
      }
    }
    it('should return the same object if no keys are passed', () => {
      expect(filterObject(null, testObj)).toEqual(testObj)
    })
    it('should return an object with only the passed keys', () => {
      expect(filterObject(['a', 'c'], testObj)).toEqual({ a: 'a', c: 'c' })
    })
    it('should work with a single key', () => {
      expect(filterObject(['a'], testObj)).toEqual({ a: 'a' })
    })
    it('should work with nested keys', () => {
      expect(filterObject(['d'], testObj, 'e')).toEqual({ d: 'e' })
    })
  })

  describe('kebabToCamel', () => {
    it('should convert kebab case strings to camel case', () => {
      expect(kebabToCamel('kebab-case')).toEqual('kebabCase')
    })
    it('should work with multiple hyphens', () => {
      expect(kebabToCamel('kebab-case-string')).toEqual('kebabCaseString')
    })
    it('should work with single character strings', () => {
      expect(kebabToCamel('a')).toEqual('a')
    })
    it('should work with empty strings', () => {
      expect(kebabToCamel('')).toEqual('')
    })
    it('should work with numbers', () => {
      expect(kebabToCamel('1')).toEqual('1')
    })
  })
  describe('camelToRender', () => {
    it('should convert camel case strings to separated uppercase words', () => {
      expect(camelToRender('camelCase')).toEqual('Camel Case')
    })
    it('should work with multiple words', () => {
      expect(camelToRender('camelCaseString')).toEqual('Camel Case String')
    })
    it('should work with single character strings', () => {
      expect(camelToRender('a')).toEqual('A')
    })
    it('should work with empty strings', () => {
      expect(camelToRender('')).toEqual('')
    })
    it('should work with numbers', () => {
      expect(camelToRender('testNumber1')).toEqual('Test Number 1')
    })
  })
})

import { flattenValidatorObjects, template, get } from '../../src/utils'
import { flattenedValidatorObject, validationObject } from './testData'

describe('utils.js', () => {
  describe('flattenValidatorObjects', () => {
    it('returns array of validation objects', () => {
      expect(flattenValidatorObjects(validationObject)).toEqual(flattenedValidatorObject)
    })
  })

  describe('template', () => {
    it('throws appropriate errors', () => {
      expect(() => template('A string')).toThrowError()
      expect(() => template({}, 'string')).toThrowError()
    })

    it('replaces dot notated values with provided ones', () => {
      expect(template('A string with {deeply.nested.attributes}', { deeply: { nested: { attributes: 'attributes' } } })).toEqual('A string with attributes')
    })

    it('returns empty if not found', () => {
      expect(template('A string {attribute}', {})).toEqual('A string ')
    })
  })

  describe('get', () => {
    it('returns undefined if no value', () => {
      expect(get({}, 'a')).toEqual(undefined)
    })
    it('returns the proper value', () => {
      expect(get({ a: { b: 'b' } }, 'a.b')).toEqual('b')
    })
    it('returns the fallback if not found', () => {
      expect(get({ a: 'a' }, 'b', 'fallback')).toEqual('fallback')
    })
  })
})

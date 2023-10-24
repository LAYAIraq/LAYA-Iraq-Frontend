import { slugify, unslugify, validateSlug } from '@/mixins/general/slugs'
import { getNumberBetween1and10 } from '../../../helpers/random-input'

describe('slugs', () => {
  describe('slugify', () => {
    it('converts strings to slugs', () => {
      const strings = ['Hello World', 'Hello World!', 'Hello World!!', 'Hello World!!!']
      const expectedSlug = 'hello-world'
      strings.forEach((string) => {
        const slug = slugify(string)
        expect(validateSlug(slug)).toBeTruthy()
        expect(slug).toBe(expectedSlug)
      })
    })

    it('converts random sentences to valid slugs', () => {
      const noOfWords = getNumberBetween1and10() * 2 // random number between 1 and 10
      const chars = '()[]{}!@#$%^&*'
      const letters = 'abcdefghijklmnopqrstuvwxyz'
      const spaces = ' -_ '
      const getRandomItem = () => {
        let str = ''
        str = str + spaces[Math.floor(Math.random() * spaces.length)]
        if (Math.random() > 0.75) {
          str = str + chars[Math.floor(Math.random() * chars.length)]
          if (Math.random() > 0.5) {
            str = str + spaces[Math.floor(Math.random() * spaces.length)]
          }
        }
        return str
      }

      let sentence = ''
      for (let i = 0; i < noOfWords; i++) {
        const noOfLetters = getNumberBetween1and10() // random number between 1 and 10

        let word = ''
        for (let j = 0; j < noOfLetters; j++) {
          word += letters.charAt(Math.floor(Math.random() * 26))
          // console.log(word)
        }
        const space = i === noOfWords - 1 ? '' : getRandomItem()
        sentence += word + space
        // console.log(sentence)
      }
      // console.log(sentence)
      const slug = slugify(sentence)
      // console.log(slug)
      expect(validateSlug(slug)).toBeTruthy()
    })

    it('does useful things when given an arabic string', () => {
      const arabicString = 'مرحبا بالعالم'
      const slug = slugify(arabicString)
      expect(slug).toBeTruthy()
      expect(validateSlug(slug)).toBeTruthy()
      expect(slug).toBe('mr7ba-bal3alm')
    })

    it('can work with BIDI strings', () => {
      const arabicString = 'مرحبا بالعالم my friend'
      const slug = slugify(arabicString)
      expect(slug).toBeTruthy()
      expect(validateSlug(slug)).toBeTruthy()
      expect(slug).toBe('mr7ba-bal3alm-my-friend')
    })

    it('converts all arabic letters to latin', () => {
      const slug = slugify('أبتثجحخدذرزسشصضطظعغفقكلمنهويىة')
      expect(validateSlug(slug)).toBeTruthy()
      expect(slug).toBe('2btthj7khddhrzssh9dh6th38fqklmnhwiah')
    })

    it('does something with farsi letters, too', () => {
      const slug = slugify('آا بپتثجچحخدذرزژسشصضطظعغفقکگلمنهوی')
      expect(validateSlug(slug)).toBeTruthy()
    })

    it('converts arabic numbers to latin numbers', () => {
      const arabicString = '١٢٣٤٥٦٧٨٩٠'
      const slug = slugify(arabicString)
      expect(slug).toBeTruthy()
      expect(validateSlug(slug)).toBeTruthy()
      expect(slug).toBe('1234567890')
    })

    it('adds spaces when converting arabic numbers', () => {
      const arabicString = '١٢٣ ٤٥٦٧٨٩٠'
      const slug = slugify(arabicString)
      expect(slug).toBeTruthy()
      expect(validateSlug(slug)).toBeTruthy()
      expect(slug).toBe('123-4567890')
    })

    it.skip('adds spaces between letters and numbers when converting arabic numbers', () => { // skipped b/c not sure if this is desirable
      const arabicString = '١٢٣٤٥٦٧٨٩٠abc'
      const slug = slugify(arabicString)
      expect(slug).toBeTruthy()
      expect(validateSlug(slug)).toBeTruthy()
      expect(slug).toBe('1234567890-abc')
    })
  })

  describe('unslugify', () => {
    it('converts slugs to space separated uppercase words', () => {
      const slugs = ['hello-world', 'hello-world!', 'hello-world!!', 'hello-world!!!', 'very-complicated-slug-lacking-brevity']
      const expectedStrings = ['Hello World', 'Hello World!', 'Hello World!!', 'Hello World!!!', 'Very Complicated Slug Lacking Brevity']
      slugs.forEach((slug, index) => {
        const string = unslugify(slug)
        expect(string).toBe(expectedStrings[index])
      })
    })
  })
})

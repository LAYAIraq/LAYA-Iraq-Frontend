/**
 * @file handle slugs
 * @author cmc
 * @since v1.3.0
 */
import { arabicToChat } from '@/mixins/general/arabic-strings'

/**
 * @description converts string to slug
 * @author mathewbyrne, edited by cmc
 * @see https://gist.github.com/mathewbyrne/1280286
 *  @param text string to convert
 */
export const slugify = (text: string): string => {
  // check if there are non-latin letters
  // eslint-disable-next-line no-control-regex
  const nonLatin = text.match(/[^\u0000-\u00ff]/)
  if (nonLatin) {
    // replace arabic letters with latin letters
    text = arabicToChat(text)
  }
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w-]+/g, '') // Remove all non-word chars
    .replace(/_/g, '-') // Replace _ with -
    .replace(/--+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, '') // Trim - from end of text
}

/**
 * @description reverse slugification, omitting punctuation
 * @author cmc
 * @param text slug
 * @returns capitalized spaced words
 */
export const unslugify = (text: string): string => {
  const words = text.split('-')
  const newWords = []
  for (const word of words) {
    newWords.push(word.charAt(0).toUpperCase() + word.slice(1))
  }
  return newWords.join(' ')
}

/**
 * @description validates slug
 * @param slug slug to validate
 */
export const validateSlug = (slug: string): boolean => {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)
}

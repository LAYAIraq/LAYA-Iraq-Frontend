/**
 * @fileOverview functions to validate different types of data
 * @since 1.3.0
 */

/**
 * @description validates slug
 * @param slug slug to validate
 */
export const validateSlug = (slug: string): boolean => {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)
}

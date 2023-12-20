/**
 * Filename: files.ts
 * Use: Return Strings and Icon for MIME Types
 * Creator: cmc
 * Since: v1.1.0
 */

import { mapGetters } from 'vuex'
import * as locale from '@/assets/i18n'
export default {
  computed: {
    ...mapGetters(['profileLanguage']),

    /**
     * types(): filter i18n file for mimeType keys
     *
     * Author: cmc
     *
     * Last Updated: May 5, 2021
     */
    types () {
      const types = {}

      // filter i18n file for key containing 'files'
      for (const key in locale[this.profileLanguage]) {
        if (Object.prototype.hasOwnProperty
          .call(locale[this.profileLanguage], key)) {
          if (/files/.test(key) === true) {
            // add to types in scope
            types[key] = locale[this.profileLanguage][key]
          }
        }
      }
      return types
    }
  },
  methods: {

    /**
     * function fileIcon: returns a fas class for expected MIME types
     *
     * Author: cmc
     *
     * Last Updated: April 28, 2021
     */
    fileIcon (type: string) {
      // List of official MIME Types: http://www.iana.org/assignments/media-types/media-types.xhtml
      const iconClasses = {
        // Media
        image: 'fas fa-file-image',
        audio: 'fas fa-file-audio',
        video: 'fas fa-file-video',
        // Documents
        'application/pdf': 'fas fa-file-pdf',
        'application/msword': 'fas fa-file-word',
        'application/vnd.ms-word': 'fas fa-file-word',
        'application/vnd.oasis.opendocument.text': 'fas fa-file-word',
        'application/vnd.openxmlformatsfficedocument.wordprocessingml':
          'fas fa-file-word',
        'application/vnd.ms-excel': 'fas fa-file-excel',
        'application/vnd.openxmlformatsfficedocument.spreadsheetml':
          'fas fa-file-excel',
        'application/vnd.oasis.opendocument.spreadsheet': 'fas fa-file-excel',
        'application/vnd.ms-powerpoint': 'fas fa-file-powerpoint',
        'application/vnd.openxmlformatsfficedocument.presentationml':
          'fas fa-file-powerpoint',
        'application/vnd.oasis.opendocument.presentation': 'fas fa-file-powerpoint',
        'text/plain': 'fas fa-file-alt',
        'text/html': 'fas fa-file-code',
        'application/json': 'fas fa-file-code',
        // Archives
        'application/gzip': 'fas fa-file-archive',
        'application/zip': 'fas fa-file-archive'
      }

      for (const key in iconClasses) {
        if (Object.prototype.hasOwnProperty.call(iconClasses, key)) {
          if (type.search(key) === 0) {
            // Found it
            return iconClasses[key]
          }
        }
      }
      return 'fas fa-file'
    },

    /**
     * Function fileSize: verbalize file size
     *
     * Author: cmc
     *
     * Last Updated: April 1, 2021
     * @param size size of a file
     * @returns a string making the size human-readable
     */
    fileSize (size: number) {
      if (size > 1024 * 1024) {
        const mbsize = Math.round(size / 1024 / 1024 * 10) / 10
        return `${mbsize} MBytes`
      } else if (size > 1024) {
        const kbsize = Math.round(size / 1024 * 10) / 10
        return `${kbsize} kBytes`
      } else {
        return `${size} Bytes`
      }
    },

    /**
     * Function fileTypeString: return textual description of file type
     *
     * Author: cmc
     *
     * Last Updated: April 28, 2021
     *
     * @param {string} type mime type of http request
     */
    fileTypeString (type: string) {
      const fileClasses = {
        // Media
        image: 'image',
        audio: 'audio',
        video: 'video',
        // Documents
        'application/pdf': 'pdf',
        'application/msword': 'word',
        'application/vnd.ms-word': 'word',
        'application/vnd.oasis.opendocument.text': 'openDoc',
        'application/vnd.openxmlformatsfficedocument.wordprocessingml':
          'openDoc',
        'application/vnd.ms-excel': 'excel',
        'application/vnd.openxmlformatsfficedocument.spreadsheetml':
          'openSpread',
        'application/vnd.oasis.opendocument.spreadsheet': 'openSpread',
        'application/vnd.ms-powerpoint': 'powerPoint',
        'application/vnd.openxmlformatsfficedocument.presentationml':
          'openPres',
        'application/vnd.oasis.opendocument.presentation': 'openPres',
        'text/plain': 'text',
        'text/html': 'html',
        'application/json': 'json',
        // Archives
        'application/gzip': 'gzip',
        'application/zip': 'zip'
      }

      for (const key in fileClasses) {
        if (Object.prototype.hasOwnProperty.call(fileClasses, key)) {
          if (type.search(key) === 0) {
            // Found it
            return this.types['files.' + key]
          }
        }
      }
      return this.types['files.file']
    }
  }
}

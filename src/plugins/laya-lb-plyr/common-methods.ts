/**
 * Filename: common-methods.ts
 * Use: reduce redudancy in edit.vue and create.vue
 * Creator: cmc
 * Date: April 1, 2022
 * Dependencies:
 */
import { locale, tooltipIcon } from '@/mixins'
import captionTypes from '@/misc/caption-types'

export default {
  mixins: [
    locale,
    tooltipIcon
  ],

  data () {
    return {
      src: '',
      host: '',
      title: {
        text: '',
        flagged: false,
        show: false,
        id: ''
      },
      videoFlag: {
        flagged: false,
        id: ''
      },
      captions: {
        default: null,
        tracks: []
      }
    }
  },

  computed: {
    /**
     * urlMsg: return warning if URL is not supported
     *
     * Author: cmc
     *
     * Last Updated: April 1, 2022
     */
    urlMsg () {
      if (!this.correctURL && this.validUrl) {
        return this.i18n['layaPlyr.wrongPlatform']
      } else if (!this.correctURL) {
        const choices = {
          upload: this.i18n['layaPlyr.wrongURL'],
          vimeo: this.i18n['layaPlyr.wrongVimeoId'],
          youtube: this.i18n['layaPlyr.wrongYoutubeId']
        }
        return choices[this.host]
      } else if (this.host === 'upload' && (this.validYtUrl || this.validVimeoUrl)) {
        return this.i18n['layaPlyr.wrongPlatform']
      } else {
        return null
      }
    },

    /**
     * correctURL: checks if video is on yt or vimeo
     *
     * Author: cmc
     *
     * Last Updated: March 31, 2022
     */
    correctURL () {
      if (this.host === 'upload') {
        return this.validUrl
      } else if (this.host === 'vimeo') {
        return this.validVimeoUrl
      } else if (this.host === 'youtube') {
        return this.validYtUrl
      } else { // no input set yet
        return true
      }
    },

    /**
     * captionTypes: returns the W3C caption types excluding metadata
     * @returns {[string, string, string, string]}
     */
    captionTypes () {
      return captionTypes
    },

    /**
     * function validUrl: check if string is a valid URL according to RFC 3886
     *
     * Author: cmc
     *
     * Last Updated: March 31, 2022
     */
    validUrl () {
      if (this.src === '') return false
      let url
      try {
        // eslint-disable-next-line prefer-const
        url = new URL(this.src)
      } catch (_) {
        return false
      }
      return url.protocol === 'http:' || url.protocol === 'https:'
    },

    /**
     * function validVimeoUrl: check if URL contains vimeo or consists of Numbers
     *
     * Author: cmc
     *
     * Last Updated: March 31, 2022
     */
    validVimeoUrl () {
      return (this.validUrl)
        ? this.src.includes('vimeo')
        : /^\d+$/.test(this.src) // matcher for vimeo IDs
    },

    /**
     * function validYtUrl: check if URL contains vimeo or consists of Numbers
     *
     * Author: cmc
     *
     * Last Updated: March 31, 2022
     */
    validYtUrl () {
      return (this.validUrl)
        ? this.src.includes('youtu')
        : (/^([0-9a-zA-Z]|-)+$/.test(this.src) && this.src.length === 11) // matcher for yt IDs
    }
  },
  methods: {
    /**
     * function addCaption: add caption object to caption tracks array
     *
     * Author: cmc
     *
     * Last Updated: April 1, 2022
     */
    addCaption () {
      this.captions.tracks.push({
        kind: null,
        label: '',
        srclang: '',
        src: ''
      })
    },

    /**
     * function makeDefault: make element at index i the default track
     *
     * Author: cmc
     *
     * Last Updated: April 1, 2022
     * @param {number} i index for new default element
     */
    makeDefault (i) {
      this.captions.default = i
    },

    /**
     * function removeCaption: remove caption at given index
     *
     * Author: cmc
     *
     * Last Updated: April 1, 2022
     * @param {number} idx index at which to delete
     */
    removeCaption (idx) {
      this.captions.tracks.splice(idx, 1)
    },

    /**
     * function setHost: set host variable to val
     *
     * Author: cmc
     *
     * Last Updated: March 31, 2022
     * @param {string} str one of 'youtube', 'vimeo' or 'upload'
     */
    setHost (str) {
      this.host = str
    }
  }
}

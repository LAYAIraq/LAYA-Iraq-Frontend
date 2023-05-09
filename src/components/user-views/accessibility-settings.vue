<!--
  Filename: accessibility-settings.vue
  Use: Accessibility Settings, such as content preferences and text size
  Creator: nv
  Since: v1.3.0
-->
<template>
  <div>
    <div class="container">
      <div class="row">
        <form
          class="w-100"
          style="margin-top: 1rem"
        >
          <h3 :class="langIsAr? 'text-right' : 'text-left'">
            {{ y18n('profile.accessibility') }}
          </h3>
          <hr>
          <!-- Default Media Forms -->
          <div class="form-group row">
            <label class="col-sm-3 col-form-label">{{ y18n('profile.defmedia.label') }}</label>
            <div class="col-sm-9 d-inline-flex justify-content-between align-items-center">
              <!-- Text -->
              <div class="checkbox-inline">
                <label>
                  <input
                    v-model="preferencesMedia.text"
                    type="checkbox"
                  >
                  {{ y18n('profile.defmedia.text') }}
                </label>
              </div>
              <!-- Simple -->
              <div class="checkbox-inline">
                <label>
                  <input
                    v-model="preferencesMedia.simple"
                    type="checkbox"
                  >
                  {{ y18n('profile.defmedia.simple') }}
                </label>
              </div>
              <!-- Video -->
              <div class="checkbox-inline">
                <label>
                  <input
                    v-model="preferencesMedia.video"
                    type="checkbox"
                  >
                  {{ y18n('profile.defmedia.video') }}
                </label>
              </div>
              <!-- Audio -->
              <div class="checkbox-inline">
                <label>
                  <input
                    v-model="preferencesMedia.audio"
                    type="checkbox"
                  >
                  {{ y18n('profile.defmedia.audio') }}
                </label>
              </div>
            </div>
          </div>
          <!-- Language Options -->
          <div class="form-group row">
            <label class="col-sm-3 col-form-label">
              {{ y18n('profile.languagePreference.label') }}
            </label>
            <div class="col-sm-9 d-inline-flex justify-content-between align-items-center">
              <!-- English -->
              <div class="checkbox-inline">
                <label>
                  <input
                    v-model="preferencesLanguages.english"
                    type="checkbox"
                  >
                  {{ y18n('profile.language.english') }}
                </label>
              </div>
              <!-- German -->
              <div class="checkbox-inline">
                <label>
                  <input
                    v-model="preferencesLanguages.german"
                    type="checkbox"
                  >
                  {{ y18n('profile.language.german') }}
                </label>
              </div>
              <!-- Arabic -->
              <div class="checkbox-inline">
                <label>
                  <input
                    v-model="preferencesLanguages.arabic"
                    type="checkbox"
                  >
                  {{ y18n('profile.language.arabic') }}
                </label>
              </div>
              <!-- Kurdish -->
              <div class="checkbox-inline">
                <label>
                  <input
                    v-model="preferencesLanguages.kurdish"
                    type="checkbox"
                  >
                  {{ y18n('profile.language.kurdish') }}
                </label>
              </div>
            </div>
          </div>
          <!-- Font Options -->
          <div class="form-group row">
            <label class="col-sm-3 col-form-label">
              {{ y18n('profile.fontOptions') }}
            </label>
            <div
              class="col-sm-9 d-inline-flex justify-content-between align-items-center"
            >
              <div class="input-inline">
                <label>
                  {{ y18n('profile.font') }}
                  <b-form-select
                    v-model="preferencesFont.chosen"
                  >
                    <b-form-select-option
                      v-for="(opt, i) in fontOptionsIntro"
                      :key="i"
                      :value="opt.value"
                      :class="`laya-font-${opt.value}`"
                    >
                      <span :class="opt.value? `laya-font-${opt.value}`:''">
                        {{ opt.text }}
                      </span>
                    </b-form-select-option>
                  </b-form-select>
                </label>
              </div>
              <!-- Font Size -->
              <div>
                <label>
                  {{ y18n('profile.fontSize') }}
                  <b-form-input
                    v-model="sizeChosen"
                    type="range"
                    min="0"
                    :max="fontSizeOptions.length-1"
                  ></b-form-input>
                </label>
                <div class="d-flex justify-content-between w-100">
                  <div
                    v-for="(opt, i) in fontSizeOptions"
                    :key="`text-option-${i}`"
                  >
                    {{ opt }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <strong class="form-text text-center">{{ formMsg }}</strong>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { locale } from '@/mixins'
import { mapGetters, mapMutations } from 'vuex'
import fontOptions from '@/options/font-options'
import fontSizeOptions from '@/options/font-size-options'

export default {
  name: 'AccessibilitySettings',
  mixins: [locale],
  data () {
    return {
      formMsg: '',
      languages: '',
      prefs: {}
    }
  },
  computed: {
    ...mapGetters([
      'preferencesFont',
      'preferencesLanguages',
      'preferencesMedia',
      'profile',
      'userId'
    ]),
    /**
     * fontOptionsIntro(): add placeholder in locale to fontOptions
     *
     * Author: cmc
     *
     * Last Updated: September 22, 2021
     */
    fontOptionsIntro () {
      return [
        { value: null, text: this.y18n('profile.fontChoose') },
        ...fontOptions
      ]
    },
    /**
     * fontSizeOptions(): add font size options
     *
     * Author: cmc
     *
     * Last Updated: September 22, 2021
     */
    fontSizeOptions () {
      return fontSizeOptions
    },
    /**
     * sizeChosen: returns index of chosen size in fontSizeOptions,
     *  sets pref.font.size when changed
     *
     * Author: cmc
     *
     * Last Updated: April 26, 2023 by nv
     * @returns {number} index in fontSizeOptions array
     */
    sizeChosen: {
      get () {
        return this.fontSizeOptions.indexOf(this.preferencesFont.size)
      },
      set (newVal) {
        this.preferencesFont.size = this.fontSizeOptions[newVal]
      }
    },
    prefsFont () { return this.profile.preferencesFont },
    prefsLanguages () { return this.profile.preferencesLanguages },
    prefsMedia () { return this.profile.preferencesMedia }

  },
  methods: {
    ...mapMutations([
      'languageSet',
      'preferencesSet'
    ]),
    prefsSet () {
      this.prefs = { font: this.prefsFont, language: this.prefsLanguages, media: this.prefsMedia }
      return this.prefs
    }
  }
}
</script>

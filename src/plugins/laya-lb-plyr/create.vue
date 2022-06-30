<!--
Filename: create.vue
Use: Create new Plyr content block
Creator: cmc
Date: January 17, 2021
Dependencies: @/mixins/locale.vue
-->

<template>
  <div
    :class="langIsAr? 'text-right' : 'text-left'"
  >
    <form>
      <div class="form-group row">
        <h4 class="d-inline-block mr-auto">
          {{ y18n('layaPlyr.name') }}
        </h4>
        <i
          id="questionmark"
          v-b-tooltip.auto
          class="fas fa-question-circle"
          :title="y18n('showTip')"
          aria-labelledby="tooltipText"
          aria-live="polite"
          @click="toggleTip"
        ></i>
      </div>

      <b-jumbotron
        v-if="tooltipOn"
        id="tooltipText"
        :header="y18n('layaPlyr.name')"
        :lead="y18n('tipHeadline')"
      >
        <hr class="my-4">
        <p
          v-for="str in y18n('layaPlyr.tooltip').split(';')"
          :key="str.length"
        >
          <!-- eslint-disable-next-line vue/no-v-html --> <!-- TODO: find a way to avoid v-html -->
          <span v-html="replacePattern(str, /###([\w\s\-]+)###([A-Z0-9a-z\/.:#]+)###/, linkReplacement(true))"></span>
        </p>
      </b-jumbotron>

      <hr>

      <div class="form-group">
        <div class="row">
          <!-- title -->
          <label
            for="laya-plyr-title"
            class="col col-form-label"
          >
            {{ y18n('title') }}
          </label>
          <div class="form-group col-8">
            <input
              id="laya-plyr-title"
              v-model="title.text"
              type="text"
              class="form-control"
              :placeholder="y18n('titlePlaceholder')"
            >
          </div>
          <div
            id="show-title-button"
            class="form-group col"
          >
            <label
              for="show-title-tick"
              class="col col-form-label"
            >
              {{ y18n('showTitle') }}
              <input
                id="show-title-tick"
                v-model="title.show"
                type="checkbox"
              >
            </label>
          </div>
        </div>
        <div
          v-if="courseSimple"
          class="row"
        >
          <!-- simple title -->
          <label
            for="laya-plyr-title-simple"
            class="col-2 col-form-label"
          >
            <span class="sr-only">
              {{ y18n('simpleAlt') }}
            </span>
          </label>
          <div class="form-group col-8">
            <input
              id="laya-plyr-title-simple"
              v-model="title.simple"
              type="text"
              class="form-control"
              :placeholder="y18n('simpleAlt')"
            >
          </div>
        </div>
      </div>

      <!-- video url -->
      <div class="form-group row">
        <label
          for="vid-id"
          class="col-2 col-form-label"
        >
          {{ y18n('layaPlyr.url') }}
        </label>
        <div class="col">
          <input
            id="vid-id"
            v-model="src"
            type="text"
            class="form-control"
            :placeholder="y18n('layaPlyr.placeholder')"
          >
        </div>
      </div>

      <!-- video props -->
      <div class="form-group row">
        <span class="col-2 col-form-label">
          {{ y18n('layaPlyr.platform') }}
        </span>
        <div class="col-5 form-check form-check-inline align-text-top">
          <input
            id="platform-upload"
            :checked="host === 'upload'"
            class="form-check-input"
            :class="langIsAr ? 'mr-3' : 'ml-3'"
            type="radio"
            name="platform"
            @click="setHost('upload')"
          >
          <label
            for="platform-upload"
            class="form-check-label"
            :class="langIsAr ? 'ml-3' : 'mr-3'"
          >
            {{ y18n('layaPlyr.upload') }}
          </label>
          <input
            id="platform-vimeo"
            :checked="host === 'vimeo'"
            class="form-check-input"
            type="radio"
            name="platform"
            @click="setHost('vimeo')"
          >
          <label
            for="platform-vimeo"
            class="form-check-label"
            :class="langIsAr ? 'ml-3' : 'mr-3'"
          >
            {{ y18n('layaPlyr.vimeo') }}
          </label>
          <input
            id="platform-yt"
            :checked="host === 'youtube'"
            class="form-check-input"
            type="radio"
            name="platform"
            @click="setHost('youtube')"
          >
          <label
            for="platform-yt"
            class="form-check-label"
            :class="langIsAr ? 'ml-3' : 'mr-3'"
          >
            {{ y18n('layaPlyr.youtube') }}
          </label>
        </div>

        <!-- URL warning -->
        <div
          v-if="urlMsg"
          id="url-hint"
          class="col form-check form-check-inline align-text-top"
        >
          <span class="text-danger form-control-plaintext text-right">
            {{ urlMsg }}
          </span>
        </div>
      </div>

      <!-- caption tracks -->
      <div
        v-if="host === 'upload'"
        id="caption-input"
        class="form-group"
      >
        <h4 class="mb-4 mt-4">
          {{ y18n('captionTypes.captions') }}
        </h4>
        <!-- table header -->
        <div
          id="caption-input-header"
          class="row mb-3"
        >
          <div class="col-2">
            {{ y18n('type') }}
          </div>
          <div class="col">
            {{ y18n('layaPlyr.captions.label') }}
          </div>
          <div class="col-1">
            {{ y18n('layaPlyr.captions.lang') }}
          </div>
          <div class="col">
            {{ y18n('layaPlyr.captions.src') }}
          </div>
          <div class="col-1">
            {{ y18n('layaPlyr.captions.default') }}
          </div>
          <div class="col-1"></div> <!-- placeholder for alignment -->
        </div>
        <!-- input fields -->
        <div
          v-for="(track, i) in captions.tracks"
          :key="`track-${i}`"
          class="row"
        >
          <!-- caption type -->
          <div class="col-2">
            <label
              class="form-check-label sr-only"
              :for="`type-select-${i}`"
            >
              {{ y18n('type') }}
            </label>
            <b-select
              :id="`type-select-${i}`"
              v-model="track.kind"
            >
              <b-select-option value="null">
                {{ y18n('layaPlyr.captions.chooseType') }}
              </b-select-option>
              <b-select-option
                v-for="type in captionTypes"
                :key="type"
                :value="type"
              >
                {{ y18n(`captionTypes.${type}`) }}
              </b-select-option>
            </b-select>
          </div>
          <!-- caption label -->
          <div class="col">
            <label
              :for="`label-input-${i}`"
              class="form-check-label sr-only"
            >
              {{ y18n('layaPlyr.captions.label') }}
            </label>
            <input
              :id="`label-input-${i}`"
              v-model="track.label"
              class="form-control"
              type="text"
              :placeholder="y18n('layaPlyr.captions.label')"
            >
          </div>
          <!-- caption language -->
          <div class="col-1">
            <label
              :for="`srclang-input-${i}`"
              class="form-check-label sr-only"
            >
              {{ y18n('layaPlyr.captions.lang') }}
            </label>
            <input
              :id="`srclang-input-${i}`"
              v-model="track.srclang"
              class="form-control"
              type="text"
              :placeholder="y18n('layaPlyr.captions.lang')"
            >
          </div>
          <!-- caption source -->
          <div class="col">
            <label
              :for="`src-input-${i}`"
              class="form-check-label sr-only"
            >
              {{ y18n('layaPlyr.captions.src') }}
            </label>
            <input
              :id="`src-input-${i}`"
              v-model="track.src"
              class="form-control"
              type="text"
              :placeholder="y18n('layaPlyr.captions.src')"
            >
          </div>
          <!-- caption default -->
          <div class="col-1">
            <label
              :for="`default-check-${i}`"
              class="col-form-label sr-only"
            >
              {{ y18n('layaPlyr.captions.default') }}
            </label>
            <input
              :id="`default-check-${i}`"
              class="ml-auto mr-auto"
              type="radio"
              :checked="captions.default === i"
              @click="makeDefault(i)"
            >
          </div>
          <!-- delete button -->
          <div class="col-1">
            <b-button
              :id="`delete-button-${i}`"
              v-b-tooltip.auto
              class="m-auto"
              variant="danger"
              :title="y18n('delete')"
              @click.prevent="removeCaption(i)"
            >
              <i class="fas fa-times-circle"></i>
              <span class="sr-only">
                {{ y18n('delete') }}
              </span>
            </b-button>
          </div>
        </div>
        <!-- table footer -->
        <div
          id="caption-input-footer"
          class="row mt-3"
        >
          <b-button
            id="add-caption"
            variant="success"
            class="m-auto"
            @click.prevent="addCaption"
          >
            <i class="fas fa-plus-circle"></i>
            {{ y18n('layaPlyr.captions.add') }}
          </b-button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import { v4 as uuidv4 } from 'uuid'
import plyrEditMethods from './common-methods'

export default {
  name: 'LayaPlyrNew',

  mixins: [
    plyrEditMethods
  ],

  created () {
    this.title.id = uuidv4()
    this.videoFlag.id = uuidv4()
  }
}
</script>

<style scoped>
  #questionmark {
  float: end;
  cursor: pointer;
  }
  .helptext {
    border: 1px green;
    padding: 5px;
  }
  .helptext i {
    float: start;
    margin-right: 10px;
  }
  .form-check-input[disabled] ~ .form-check-label{
    color: #212529 !important;
  }
</style>

<!--
Filename: edit.vue
Use: Edit Ableplayer content block
Creator: core
Date: unknown
Dependencies:
  vuex,
  @/mixins/locale.vue,
  @/mixins/tooltipIcon.vue
-->

<template>
  <div class="laya-ableplayer-edit">
    <label>
      <h4>
        {{ i18n['layaAbleplayer.name'] }}
      </h4>
    </label>
    <i
      id="questionmark"
      v-b-tooltip.left
      class="fas fa-question-circle"
      :title="i18n['showTip']"
      @click="toggleTip()"
    ></i>
    <b-jumbotron
      v-if="tooltipOn"
      :header="i18n['layaAbleplayer.name']"
      :lead="i18n['tipHeadline']"
    >
      <hr class="my-4">
      <span>
        {{ i18n['layaAbleplayer.tooltip'] }}
      </span>
    </b-jumbotron>
    <hr>

    <form>
      <div class="form-group row">
        <div class="form-group col-10">
          <label
            for="ableplayer-title"
          >
            {{ i18n['title'] }}
          </label>

          <input
            id="ableplayer-title"
            v-model="title.text"
            type="text"
            class="form-control"
            :placeholder="i18n['titlePlaceholder']"
          >
        </div>
        <div
          id="show-title-button"
          class="form-group col"
        >
          <div style="height: calc(1.5em + .75rem + 2px);"></div>
          <label
            for="show-title-tick"
            class="col"
          >
            {{ i18n['showTitle'] }}
            <input
              id="show-title-tick"
              v-model="title.show"
              type="checkbox"
            >
          </label>
        </div>
      </div>
      <div class="form-group">
        <label for="able-src-id">{{ i18n['layaAbleplayer.vidURL'] }}</label>
        <input
          id="able-src-id"
          v-model="src"
          type="text"
          class="form-control"
          :placeholder="i18n['layaAbleplayer.vidPlaceholder']"
        >
      </div>

      <div class="form-group">
        <label for="able-sign-id">{{ i18n['layaAbleplayer.signVidURL'] }} </label>
        <input
          id="able-sign-id"
          v-model="sign"
          type="text"
          class="form-control"
          :placeholder="i18n['layaAbleplayer.signVidPlaceholder']"
        >
      </div>

      <div class="form-group">
        <label for="able-sub-id">{{ i18n['layaAbleplayer.subtitle'] }}</label>
        <input
          id="able-sub-id"
          v-model="sub"
          type="text"
          class="form-control"
          :placeholder="i18n['layaAbleplayer.subtitlePlaceholder']"
        >
      </div>
    </form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { locale, tooltipIcon } from '@/mixins'

export default {
  name: 'LayaAbleplayerEdit',

  mixins: [
    locale,
    tooltipIcon
  ],

  data () {
    return {
      src: '',
      sign: '',
      sub: '',
      title: ''
    }
  },

  computed: {
    ...mapGetters(['content'])
  },

  created () {
    this.fetchData()
  },

  methods: {

    /**
     * Function fetchData: fetch data from vuex and make data property
     *
     * Author: cmc
     *
     * Last Updated: March 19, 2021
     */
    fetchData () {
      const idx = this.$route.params.step - 1
      const preData = JSON.parse(JSON.stringify(this.content[idx]['input']))
      this.src = preData.src
      this.sign = preData.sign
      this.sub = preData.sub
      this.title = preData.title
    }
  }
}
</script>

<!-- 
Filename: create.vue
Use: Create a new Ableplayer content block
Creator: cmc
Date: January 19, 2021
Dependencies: 
  @/mixins/locale.vue,
  @/mixins/tooltipIcon.vue
-->

<template>
  <div 
    class="laya-ableplayer-new"
    :class="langIsAr? 'text-right' : 'text-left'"
  >

    <label>
      <h4>
        {{ i18n['layaAbleplayer.name'] }}
      </h4>
    </label>
    <i 
      id ="questionmark"
      class="fas fa-question-circle" 
      :class="langIsAr? 'mr-auto' : 'ml-auto'"
      @click="toggleTip" 
      :title="i18n['showTip']" 
      v-b-tooltip.left
    ></i>
    <b-jumbotron 
      v-if="tooltipOn"
      :header="i18n['layaAbleplayer.name']" 
      :lead="i18n['tipHeadline']"
    >
      <hr class="my-4">
      <span v-html="i18n['layaAbleplayer.tooltip']"></span>
    </b-jumbotron>

    <hr>

    <form>

      <!-- title -->
      <div class="form-group row">
        <div class="form-group col-10">
          <label 
            for="ableplayer-title" 
          >
            {{ i18n['title'] }}
          </label>
          
          
          <input 
            id="ableplayer-title"
            type="text"
            v-model="title.text"
            class="form-control"
            :placeholder="i18n['titlePlaceholder']"
          >
        </div>
        <div class="form-group col" id="show-title-button">
          <div style="height: calc(1.5em + .75rem + 2px);"></div>
          <label
            for="show-title-tick"
            class="col"
          >
            {{ i18n['showTitle'] }}
            <input
              id="show-title-tick"
              type="checkbox"
              v-model="title.show"
            >
          </label>
            
          
        </div>
      </div>
      <div class="form-group">
        <label for="able-src-id">{{ i18n['layaAbleplayer.vidURL'] }}</label>
        <input id="able-src-id"
          type="text"
          v-model="src"
          class="form-control"
          :placeholder="i18n['layaAbleplayer.vidPlaceholder']">
      </div>

      <div class="form-group">
        <label for="able-sign-id">{{ i18n['layaAbleplayer.signVidURL'] }} </label>
        <input id="able-sign-id"
          type="text"
          v-model="sign"
          class="form-control"
          :placeholder="i18n['layaAbleplayer.signVidPlaceholder']">
      </div>

      <div class="form-group">
        <label for="able-sub-id">{{ i18n['layaAbleplayer.subtitle'] }}</label>
        <input id="able-sub-id"
          type="text"
          v-model="sub"
          class="form-control"
          :placeholder="i18n['layaAbleplayer.subtitlePlaceholder']">
      </div>
    </form>

  </div>
</template>

<script>
import { locale, tooltipIcon } from '@/mixins'
import { v4 as uuidv4 } from 'uuid'

export default {
  name: 'laya-ableplayer-create',

  mixins: [
    locale,
    tooltipIcon
  ],  
  
  data() {
    return {
      title: {
        show: false,
        text: '',
        flagged: false,
        id: ''
      },
      src: '',
      sign: '',
      sub: ''
    }
  },

  created() {
    this.title.id = uuidv4()
  }
}
</script>

<style scoped>
#show-title-button {
  vertical-align: bottom;
}


</style>
<!--
Filename: edit.vue
Use: Edit Dialog content block
Creator: core
Date: unknown
Dependencies:
  vuex,
  @/mixins/locale.vue,
  @/mixins/tooltipIcon.vue
-->

<template>
  <div 
    class="laya-lb-dialog-edit" 
    :class="langIsAr? 'text-right' : 'text-left'"
  >
    <div class="row">
      
        <h4 >
          {{ i18n['layaLbDialog.name'] }}
        </h4>
 
      <i 
        id="questionmark" 
        class="fas fa-question-circle" 
        :class="langIsAr? 'mr-auto' : 'ml-auto'"
        @click="toggleTip" 
        :title="i18n['showTip']" 
        v-b-tooltip.left
      ></i>
    </div>
    <hr>
    
    <b-jumbotron 
      v-if="tooltipOn"
      :header="i18n['layaLbDialog.name']" 
      :lead="i18n['tipHeadline']">
      <hr class="my-4">
      <span v-html="i18n['layaLbDialog.tooltip']"></span>

    </b-jumbotron>

    <form>
      <div class="form-group row" >
        <div class="form-group col-10">
          <p>
            <b>{{ i18n['title'] }}</b>
          </p>
          
          <input 
            id="dialog-title"
            type="text"
            v-model="title"
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
              v-model="showTitle"
            >
          </label>
        </div>
        
      </div>
      <div class="form-group row">
        <label 
          for="smcs-question" 
          class="col-2 col-form-label"
        >
          {{ i18n['task'] }}
        </label>
        <div class="col-10">
          <textarea 
            id="scms-question"
            v-model="question"
            class="w-100"
            :placeholder="i18n['layaLbDialog.optional']">
          </textarea>
        </div>
      </div>

      <div class="form-group row">
        <label for="dialog-bg" class="col-2 col-form-label"
          style="word-wrap: anywhere">
          {{ i18n['layaLbDialog.bgURL'] }}
        </label>
        <div class="col-10">
          <input id="dialog-bg"
            type="text"
            class="form-control"
            v-model="bg"
            :placeholder="i18n['layaLbDialog.bgPlaceholder']">
        </div>
      </div>

      <p><b>{{ i18n['layaLbDialog.answers'] }}</b></p>
      <div 
        class="form-group row" 
        v-for="(it, i) in answers" 
        :key="'answer-'+i"
      >
        <!-- text -->
        <label 
          class="col-form-label col-2" 
          :for="'answer-text-'+i"
        >
          {{ i18n['text'] }}
        </label>
        <div class="col-5">
          <textarea 
            :id="'answer-text-'+i"
            class="form-control"
            style="height: 6rem; font-size: 80%"
            v-model="answers[i]">
          </textarea>
        </div>

        <!-- delete -->
        <div class="col-auto align-self-center">
          <button 
            type="button"
            class="btn btn-danger btn-sm"
            @click="_delItem(i)">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>

      <div class="row">
        <button 
          type="button"
          class="btn btn-primary btn-sm"
          :class="langIsAr? 'float-right': 'float-left'"
          @click="_addItem(i18n['layaLaScmc.edit.sampleOption'])"
        >
          <i class="fas fa-plus"></i>
          {{ i18n['layaLbDialog.addAnswer'] }}
        </button>
      </div>
    </form>

  </div>
</template>

<script>
import { locale, tooltipIcon } from '@/mixins'
import { mapGetters } from 'vuex'

export default {
  name: 'laya-lb-dialog-edit',

  mixins: [
    locale,
    tooltipIcon
  ],

  computed: {
    ...mapGetters(['content']),

    /**
     * step: return the step of the content block
     * 
     * Author: cmc
     * 
     * Last Updated: January 16, 2021
     */
    step() {
      return this.$route.params.step
    }
  },

  data() {
    return {
      bg: '',
      question: '',
      answers: [],
      title: '',
      showTitle: false
    }
  },

  created() {
    this.fetchData()
  },

  methods: {
    /**
     * Function _delItem: delete item at given index
     * 
     * Author: core
     * 
     * Last Updated: unknown
     * 
     * @param {*} idx index of item
     */
    _delItem(idx) {
      this.answers.splice(idx, 1)
    },

    /**
     * Function _addItem: add item
     * Author: core
     * Last Updated: June 6, 2021
     */
    _addItem(str) {
      this.answers.push(str)
    },

    /**
     * Function fetchData: Fetch data from vuex and make data property
     * 
     * Author: cmc
     * 
     * Last Updated: March 19, 2021
     */
    fetchData() {
      let idx = this.$route.params.step -1 //comply with array indexing in store
      //create deep copy of store object to manipulate in vue instance
      let preData = JSON.parse(JSON.stringify(this.content[idx].input))
      this.bg = preData.bg
      this.question = preData.question
      this.answers = preData.answers
      this.title = preData.title
    }
  }
}
</script>

<style scoped>
.laya-dialog {
  position: relative;
}

.bg {
  width: 100%;
}

.dialog-text {
  position: absolute;
  bottom: 0px;
  left: 0px;
  
  /* height: 50%; */
  width: stretch;

  /* background-color: #ffffffd9; */
  margin: 1rem;
}

.question {
  font-size: 2rem;
  margin-top: 1rem;
  margin-bottom: 1rem;
  padding: 5px;
  text-align: center;
}

.answers > button {
  border: 1px solid #222;
  margin-right: 1rem;
  font-size: 90%;
  /* background-color: white; */
}
.answers > button:last-child {
  margin-right: 0;
}

#questionmark {
  float: inline-end;
  position: relative;
  cursor: pointer;
}

.helptext {
    border: 1px;
    border-color: green;
    padding: 5px;
  }
.helptext i {
    float: inline-start;
    margin-right: 10px;
  }

</style>

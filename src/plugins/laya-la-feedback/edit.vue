<template>
  <div class="laya-la-feedback-edit">

    <form>

      <!-- title -->
      <div class="form-group row">
        <label for="feedback-title" class="col-2 col-form-label">{{ i18n.edit.title }}</label>
        <div class="col-10">
          <input id="feedback-title"
                 type="text"
                 v-model="title"
                 class="form-control">
        </div>
      </div>


      <!-- task -->
      <div class="form-group row">
        <label for="feedback-task" class="col-2 col-form-label">
          {{ i18n.edit.desc }}
        </label>
        <div class="col-10">
          <textarea id="feedback-task"
                    v-model="task"
                    class="w-100">
          </textarea>
        </div>
      </div>

      <!-- task audio -->
      <!--
      <div class="form-group row">
        <label for="feedback-task-audio" class="col-2 col-form-label">
          Offstimme
        </label>
        <div class="col-10">
          <input id="feedback-task-audio"
                 type="text"
                 v-model="taskAudio"
                 class="form-control"
                 placeholder="z.B. https://www.laya.de/offstimme.mp3">
        </div>
      </div>
      -->

      <p><b>{{ i18n.edit.answers }}</b></p>
      <div class="form-group row" v-for="(cat, i) in categories" :key="'cat-'+i">

        <!-- text -->
        <label class="col-form-label col-2" :for="'cat-text-'+i">{{ i18n.edit.text }}</label>
        <div class="col-7">
          <input :id="'cat-text-'+i"
            class="form-control"
            type="text"
            v-model="categories[i]">
        </div>

        <!-- delete -->
        <div class="col-auto align-self-center">
          <button type="button"
                  class="btn btn-danger btn-sm"
                  @click="_delCategory(i)">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>
      <div class="form-group row">
        <div class="col-10 offset-2">
          <button type="button"
                  class="btn btn-primary btn-sm"
                  @click="_addCategory">
            <i class="fas fa-plus"></i>{{ i18n.edit.addAnswer }}
          </button>
        </div>
      </div>

      <p><b>{{ i18n.edit.questions }}</b></p>
      <div class="form-group row" v-for="(item, i) in items" :key="'item-'+i">

        <!-- text -->
        <label class="col-form-label col-2" :for="'item-text-'+i">{{ i18n.edit.text }}</label>
        <div class="col-5">
          <input :id="item"
            class="form-control"
            type="text"
            v-model="items[i]">
        </div>

        <!-- delete -->
        <div class="col-auto align-self-center">
          <button type="button"
                  class="btn btn-danger btn-sm"
                  @click="_delItem(i)">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>
      <div class="form-group row">
        <div class="col-10 offset-2">
          <button type="button"
                  class="btn btn-primary btn-sm"
                  @click="_addItem">
            <i class="fas fa-plus"></i>{{ i18n.edit.addQuestion }}
          </button>
        </div>
      </div>

    </form>

  </div>
</template>

<script>

import * as i18n from "@/i18n/plugins/laya-la-feedback";

export default {
  name: 'laya-la-feedback-edit',
  created () {
    if (this.title == "") { //prefetch Data at creation
      const prefData = this.i18n.prefetch
      this.title = prefData.title
      this.task = prefData.task
      this.items = prefData.items
      this.categories = prefData.categories
    }
  },
  data () {
    if(Object.entries(this.$attrs).length > 0)
      return {...this.$attrs}
    return {
      title: "",
      task: "",
      taskAudio: "",
      items: [],
      categories: [],
      feedback: []
    }
  },
  props: {
    
  },
  computed: {
    i18n() {
      return i18n[this.$store.state.profile.lang]
    }
  },
  methods: {
    _delItem(idx) {
      this.items.splice(idx, 1)
    },
    _addItem() {
      this.items.push("")
    },
    _delCategory(idx) {
      this.categories.splice(idx, 1)
    },
    _addCategory() {
      this.categories.push("")
    },
  }
}
</script>

<style scoped>
*:focus {
  outline: 2px dashed deepskyblue;
  outline-offset: 5px;
}

legend {
  font-size: 1rem;
}
</style>

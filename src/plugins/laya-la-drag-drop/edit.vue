<template>
  <div class="laya-la-drag-drop-edit">

    <form>

      <!-- title -->
      <div class="form-group row">
        <label for="scms-title" class="col-2 col-form-label">{{ i18n.title }}</label>
        <div class="col-10">
          <input id="scms-title"
                 type="text"
                 v-model="title"
                 class="form-control"
                 :placeholder="i18n.titlePlaceholder">
        </div>
      </div>


      <!-- task -->
      <div class="form-group row">
        <label for="smcs-task" class="col-2 col-form-label">
          {{ i18n.task }}
        </label>
        <div class="col-10">
          <textarea id="scms-task"
                    v-model="task"
                    class="w-100"
                    :placeholder="i18n.taskPlaceholder">
          </textarea>
        </div>
      </div>

      <!-- task audio -->
      <div class="form-group row">
        <label for="smcs-task-audio" class="col-2 col-form-label">
          {{ i18n.taskAudio }}
        </label>
        <div class="col-10">
          <input id="scms-task-audio"
                 type="text"
                 v-model="taskAudio"
                 class="form-control"
                 :placeholder="i18n.taskAudioPlaceholder">
        </div>
      </div>

      <p><b>{{ i18n.cats }}</b></p>
      <div class="form-group row" v-for="(cat, i) in categories" :key="'cat-'+i">

        <!-- text -->
        <label class="col-form-label col-2" :for="'cat-text-'+i">{{ i18n.text }}</label>
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
            <i class="fas fa-plus"></i>{{ i18n.catAdd }}
          </button>
        </div>
      </div>

      <p><b>{{ i18n.items }}</b></p>
      <div class="form-group row" v-for="(it, i) in items" :key="'item-'+i">

        <!-- text -->
        <label class="col-form-label col-2" :for="'item-text-'+i">{{ i18n.text }}</label>
        <div class="col-5">
          <input :id="'item-text-'+i"
            class="form-control"
            type="text"
            v-model="items[i].label">
        </div>

        <!-- category -->
        <div class="col-3">
          <select class="custom-select" v-model="items[i].category">
            <option disabled :value="-1">{{ i18n.cat }}</option>
            <option v-for="(cat,j) in categories" :value="j" :key="cat">
            {{ cat }}
            </option>
          </select>
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
            <i class="fas fa-plus"></i>{{ i18n.itemAdd }}
          </button>
        </div>
      </div>

    </form>

  </div>
</template>

<script>
import * as i18n from "@/i18n/plugins/laya-la-drag-drop";

export default {
  name: 'laya-la-drag-drop-edit',
  created () {
    // fill item and category props with localized tokens
    if (this.categories.length == 0) {
      let temp = this.i18n.answer + " 1"
      let tmpItem = {
        label: temp,
        category: -1
      }
      this.items.push(tmpItem)

      for (let i = 1; i<3; i++) {
        let tmp = this.i18n.cat + " " + i
        console.log(tmp)
        this.categories.push(tmp)
      }
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
      this.items.push({label: "", category: -1})
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

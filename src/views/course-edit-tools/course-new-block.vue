<!--
Filename: course-new-block.vue 
Use: Create a new content block
Author: cmc
Date: October 27, 2020
Dependencies: 
  vuex,
  @/i18n/course-edit/new-block/
-->

<template>
  <div class="row mb-2">

    <div class="col">

      <b-dropdown id="new-content-dd"
          variant="primary"
          class="w-100"
          dropright
      >
        <template slot="button-content">
            <i class="fas fa-plus"></i> {{ i18n.newContent }}
        </template>

        <b-dropdown-header>
          {{ i18n.newContentBlock }}
        </b-dropdown-header>

        <b-dropdown-item v-for="block in $laya.lb"
          :key="block.id"
          :to="'/courses/'+name+'/'+nextId+'/new/'+block.id"
        >
          <div class="dropitem">
            {{ block.i18n[profileLang].name }} 
            <i 
              class="far fa-question-circle" 
              v-b-tooltip.right 
              :title="block.i18n[profileLang].caption"
            >
            </i>
          </div>
        </b-dropdown-item>

        <b-dropdown-divider></b-dropdown-divider>

        <b-dropdown-header>
          {{ i18n.newContentAssmnt }}
        </b-dropdown-header>

        <b-dropdown-item v-for="ass in $laya.la"
          :key="ass.id"
          :to="'/courses/'+name+'/'+nextId+'/new/'+ass.id"
        >
          <div class="dropitem">
            {{ ass.i18n[profileLang].name }}
        
            <i 
              class="far fa-question-circle" 
              v-b-tooltip.right 
              :title="ass.i18n[profileLang].caption"
            >
            </i>
          </div>
              
        </b-dropdown-item>
      </b-dropdown>

    </div>

    <div class="col text-dark">
      {{ i18n.newContentTip }}
      <b>{{nextId}}</b>.
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import * as i18n from '@/i18n/course-edit/new-block/'

export default {
  name: 'course-new-block',

  props: {  
    name: String,
    step: String
  },

  computed: {
    ...mapGetters(['profileLang', 'content']),

    /**
     * i18n: Load translation files depending on user langugage
     * 
     * Author: cmc
     * 
     * Last updated: March 20, 2021
     * 
     */
    i18n() {
      return i18n[this.profileLang]
    },

    /**
     * nextId: return step # for next content
     * 
     * Author: cmc
     * 
     * Last Updated: October 27, 2020
     */
    nextId() {
      return this.content.length+1
    }
  }
}
</script>

<style scoped>

.dropitem i {
  float:inline-end;
}
    
</style>
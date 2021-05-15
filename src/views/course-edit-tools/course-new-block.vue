<!--
Filename: course-new-block.vue 
Use: Create a new content block
Author: cmc
Date: October 27, 2020
Dependencies: 
  vuex,
  @/mixins/locale.vue
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
          <i class="fas fa-plus"></i> 
          {{ i18n['newBlock.newContent'] }}
        </template>

        <b-dropdown-header>
          {{ i18n['newBlock.newContentBlock'] }}
        </b-dropdown-header>

        <b-dropdown-item v-for="block in $laya.lb"
          :key="block.id"
          :to="'/courses/'+name+'/'+nextId+'/new/'+block.id"
        >
          <div class="dropitem">
            {{ getName(block) }} 
            <i 
              class="far fa-question-circle" 
              v-b-tooltip.right 
              :title="getCaption(block)"
            >
            </i>
          </div>
        </b-dropdown-item>

        <b-dropdown-divider></b-dropdown-divider>

        <b-dropdown-header>
          {{ i18n['newBlock.newContentAssmnt'] }}
        </b-dropdown-header>

        <b-dropdown-item v-for="ass in $laya.la"
          :key="ass.id"
          :to="'/courses/'+name+'/'+nextId+'/new/'+ass.id"
        >
          <div class="dropitem">
            {{ getName(ass) }}
        
            <i 
              class="far fa-question-circle" 
              v-b-tooltip.right 
              :title="getCaption(ass)"
            >
            </i>
          </div>
              
        </b-dropdown-item>
      </b-dropdown>

    </div>

    <div class="col text-dark">
      {{ i18n['newBlock.newContentTip'] }}
      <b>{{ nextId }}</b>.
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { locale } from '@/mixins'

export default {
  name: 'course-new-block',

  mixins: [
    locale 
  ],

  computed: {
    ...mapGetters(['content']),

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
  },

   props: {  
    name: String,
    step: String
  },

  methods: {

    /**
     * function getCaption: get caption property of $laya block
     * 
     * Author: cmc
     * 
     * Last Updated: May 6, 2021
     * 
     * @param {obj} layaBlock $laya block object
     */
    getCaption(layaBlock) {
      return this.i18n[layaBlock.name + '.caption']
    },

    /**
     * function getName: get name property of $laya block
     * 
     * Author: cmc
     * 
     * Last Updated: May 6, 2021
     * 
     * @param {obj} layaBlock $laya block object
     */
    getName(layaBlock) {
      return this.i18n[layaBlock.name + '.name']
    }
  }
}
</script>

<style scoped>

.dropitem i {
  float:inline-end;
}
    
</style>
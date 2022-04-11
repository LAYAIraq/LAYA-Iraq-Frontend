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
      <b-dropdown
        v-if="!langIsAr"
        id="new-content-dd"
        variant="primary"
        class="w-100"
        menu-class="drop-wrap"
        dropright
      >
        <template slot="button-content">
          <i class="fas fa-plus"></i>
          {{ y18n('newBlock.newContent') }}
        </template>

        <b-dropdown-header>
          {{ y18n('newBlock.newContentBlock') }}
        </b-dropdown-header>

        <b-dropdown-item
          v-for="block in $laya.lb"
          :key="block.id"
          :to="'/courses/'+name+'/'+nextId+'/new/'+block.id"
        >
          <div class="dropitem">
            <i
              id="icon-drop"
              :class="block.icon"
            ></i>
            {{ getName(block) }}
            <i
              id="questionmark-block"
              v-b-tooltip.right
              class="far fa-question-circle"
              :title="getCaption(block)"
            ></i>
          </div>
        </b-dropdown-item>

        <b-dropdown-divider></b-dropdown-divider>

        <b-dropdown-header>
          {{ y18n('newBlock.newContentAssmnt') }}
        </b-dropdown-header>

        <b-dropdown-item
          v-for="ass in applicableAssessments"
          :key="ass.id"
          :to="'/courses/'+name+'/'+nextId+'/new/'+ass.id"
        >
          <div class="dropitem">
            <i :class="ass.icon"></i>
            {{ getName(ass) }}

            <i
              v-b-tooltip.right
              class="far fa-question-circle"
              :title="getCaption(ass)"
            >
            </i>
          </div>
        </b-dropdown-item>
      </b-dropdown>

      <b-dropdown
        v-else
        id="new-content-dd"
        variant="primary"
        class="w-100"
        :class="langIsAr? 'text-right' : ''"
        menu-class="drop-wrap"
        dropleft
      >
        <template slot="button-content">
          <i class="fas fa-plus"></i>
          {{ y18n('newBlock.newContent') }}
        </template>

        <b-dropdown-header class="text-right">
          {{ y18n('newBlock.newContentBlock') }}
        </b-dropdown-header>

        <b-dropdown-item
          v-for="block in $laya.lb"
          :key="block.id"
          :to="'/courses/'+name+'/'+nextId+'/new/'+block.id"
        >
          <div class="dropitem text-right">
            <i
              id="icon"
              :class="block.icon"
            ></i>
            {{ getName(block) }}
            <i
              id="questionmark"
              v-b-tooltip.right
              class="far fa-question-circle"
              :title="getCaption(block)"
            ></i>
          </div>
        </b-dropdown-item>

        <b-dropdown-divider></b-dropdown-divider>

        <b-dropdown-header class="text-right">
          {{ y18n('newBlock.newContentAssmnt') }}
        </b-dropdown-header>

        <b-dropdown-item
          v-for="ass in $laya.la"
          :key="ass.id"
          :to="'/courses/'+name+'/'+nextId+'/new/'+ass.id"
        >
          <div class="dropitem text-right">
            <i :class="ass.icon"></i>
            {{ getName(ass) }}

            <i
              v-b-tooltip.right
              class="far fa-question-circle"
              :title="getCaption(ass)"
            >
            </i>
          </div>
        </b-dropdown-item>
      </b-dropdown>
    </div>

    <div class="col text-dark">
      {{ y18n('newBlock.newContentTip') }}
      <b>{{ nextId }}</b>.
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { locale, routeProps } from '@/mixins'

export default {
  name: 'CourseNewBlock',

  mixins: [
    locale,
    routeProps
  ],

  computed: {
    ...mapGetters(['content', 'course']),

    /**
     * function applicableAssessments(): strip feedback from course blocks
     *  if no enrollment in course
     *
     *  Author: cmc
     *
     *  Last Updated: September 21, 2021
     */
    applicableAssessments () {
      if (this.course.properties.enrollment) {
        return this.$laya.la
      } else {
        // eslint-disable-next-line
        const {['laya-course-feedback']: _, ...newData} = this.$laya.la // strip laya-course-feedback from la
        return newData
      }
    },

    /**
     * nextId: return step # for next content
     *
     * Author: cmc
     *
     * Last Updated: October 27, 2020
     */
    nextId () {
      return this.content.length + 1
    }
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
    getCaption (layaBlock) {
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
    getName (layaBlock) {
      return this.i18n[layaBlock.name + '.name']
    }
  }
}
</script>

<style scoped>

.drop-wrap {
  min-width: 0;
  width: 100%;
}

.dropitem {
  white-space: normal;
}

.far {
  float: end;
}

</style>

<!--
Filename: course-block-new.vue
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
        id="new-content-dd"
        variant="primary"
        class="w-100"
        :class="langIsAr? 'text-right' : ''"
        menu-class="drop-wrap"
        :dropright="!langIsAr"
        :dropleft="langIsAr"
      >
        <template #button-content>
          <i class="fas fa-plus"></i>
          {{ y18n('newBlock.newContent') }}
        </template>

        <b-dropdown-header :class="langIsAr? 'text-right' : ''">
          {{ y18n('newBlock.newContentBlock') }}
        </b-dropdown-header>

        <b-dropdown-item
          v-for="block in $laya.lb"
          :key="block.id"
          :to="`/courses/${name}/new/${block.id}`"
        >
          <div
            class="dropitem"
            :class="langIsAr? 'text-right' : ''"
          >
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

        <b-dropdown-header :class="langIsAr? 'text-right': ''">
          {{ y18n('newBlock.newContentAssmnt') }}
        </b-dropdown-header>

        <b-dropdown-item
          v-for="ass in applicableAssessments"
          :key="ass.id"
          :to="`/courses/${name}/new/${ass.id}`"
        >
          <div
            class="dropitem"
            :class="langIsAr? 'text-right' : ''"
          >
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
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { locale, routes } from '@/mixins'
import { stripKey } from '@/mixins/general/helpers'

export default {
  name: 'CourseBlockNew',

  mixins: [
    locale,
    routes
  ],

  computed: {
    ...mapGetters(['course']),

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
        return stripKey('laya-course-feedback', this.$laya.la)
      }
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
     * @param {object} layaBlock $laya block object
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
     * @param {object} layaBlock $laya block object
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
  float: inline-end;
}

</style>

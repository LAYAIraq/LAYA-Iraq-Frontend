<!--
Filename: course-edit-header.vue
Use: Provide navigation buttons on top of edit tools
Creator: cmc
Date: October 27, 2020
Dependencies:
  vuex,
  @/mixins/locale.vue
-->

<template>
  <div class="container mb-4">
    <div class="row">
      <div class="col">
        <b-button
          v-if="$route.name !== 'course-detail-view'"
          variant="outline-secondary"
          size="sm"
          :class="langIsAr? 'float-right' : 'float-left'"
          active-class="active"
          :to="{name: 'course-detail-view', params: {name, step}}"
          exact
          @click.prevent="$emit('save')"
        >
          <!-- TODO: move click event to method -->
          <i
            :class="langIsAr?
              'fas fa-chevron-right':
              'fas fa-chevron-left'"
          ></i>
          {{ y18n('header.overview') }}
        </b-button>

        <!-- jump to content number -->
        <span
          class="content-nav"
          :class="langIsAr? 'float-left' : 'float-right'"
          style="font-size: 120%"
        >
          <!-- dropdown for ltr locales -->
          <b-dropdown
            v-if="!langIsAr"
            id="cid-dd"
            :text="y18n('header.jumpTo')"
            size="sm"
            variant="secondary"
            no-flip
            right
            :disabled="checkEmpty === true"
          >

            <b-dropdown-item
              v-for="(c,id) in content"
              :key="id"
              :to="{
                name: 'course-detail-view',
                params: { name, step: id+1+'' }
              }"
            >
              {{ y18n('header.listContent') }}
              <b>
                {{ id+1 }}
              </b>:
              {{ c.input.title.text }}
              ({{ typeName(c.name) }})
            </b-dropdown-item>

          </b-dropdown>

          <b-dropdown
            v-else
            id="cid-dd"
            :text="y18n('header.jumpTo')"
            size="sm"
            variant="secondary"
            no-flip
          >

            <b-dropdown-item
              v-for="(c,id) in content"
              :key="id"
              :to="{
                name: 'course-detail-view',
                params: { name, step: id+1+'' }
              }"
              class="text-right"
            >
              {{ y18n('header.listContent') }}
              <b>
                {{ id+1 }}
              </b>:
              {{ c.input.title.text }}
              ({{ typeName(c.name) }})
            </b-dropdown-item>

          </b-dropdown>
        </span>
      </div>
    </div>
  </div>
</template>

<script>

import { mapGetters } from 'vuex'
import { locale, routeProps } from '@/mixins'

export default {
  name: 'CourseEditHeader',

  mixins: [
    locale,
    routeProps
  ],

  computed: {
    ...mapGetters(['content']),

    /**
     * function checkEmpty(): returns true if no content in course
     *
     * Author: cmc
     *
     * Last Updated: November 9, 2021
     * @returns {boolean} true if no content in course
     */
    checkEmpty () {
      return this.content.length === 0
    }
  },

  methods: {
    /**
     * Function typeName: returns name of content block in locale
     *
     * Author: core
     *
     * Last Updated: May 6, 2021
     * @param {string} compName name of content block
     */
    typeName (compName) {
      const comps = { ...this.$laya.la, ...this.$laya.lb }
      for (const comp in comps) {
        if (comps[comp].id === compName) {
          return this.i18n[comps[comp].name + '.name']
        }
      }
      return 'FAIL'
    }
  }

}
</script>

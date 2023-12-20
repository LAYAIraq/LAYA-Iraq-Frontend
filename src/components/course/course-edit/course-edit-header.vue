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
          v-if="$route.name !== 'course' && $route.name !== 'content-follow-edit'"
          variant="primary"
          size="sm"
          :class="langIsAr? 'float-right' : 'float-left'"
          active-class="active"
          @click="$bvModal.show('save-changes-question')"
        >
          <!-- TODO: move click event to method -->
          <i
            :class="langIsAr?
              'fas fa-chevron-right':
              'fas fa-chevron-left'"
          ></i>
          {{ y18n('header.overview') }}
        </b-button>

        <!-- jump to content -->
        <span
          class="content-nav"
          :class="langIsAr? 'float-left' : 'float-right'"
          style="font-size: 120%"
        >
          <b-dropdown
            id="cid-dd"
            :text="y18n('header.jumpTo')"
            size="sm"
            variant="primary"
            no-flip
            :right="!langIsAr"
            :disabled="!contentToDisplay"
          >

            <b-dropdown-item
              v-for="id in Object.keys(courseRoutes)"
              :key="id"
              :to="{
                name: 'course',
                params: {
                  name,
                  coursePath: courseRoutes[id]
                }
              }"
              :class="langIsAr? 'text-right': 'text-left'"
            >
              <b>{{ y18n('type') }}:</b>
              {{ typeName(courseContent[id].name) }}
              <b>{{ y18n('title') }}:</b>
              {{ courseContent[id].title.text }}
            </b-dropdown-item>

          </b-dropdown>
        </span>
      </div>
    </div>
    <b-modal
      id="save-changes-question"
      :title="y18n('save.changes')"
      header-bg-variant="warning"
      ok-variant="warning"
      :ok-title="y18n('save')"
      :cancel-title="y18n('cancel')"
      centered
      static
      :aria-label="y18n('popupwarning')"
      @ok="saveCourseChanges"
    >
      <p>
        {{ y18n('save.changes.warning') }}
      </p>
    </b-modal>
  </div>
</template>

<script>

import { mapGetters } from 'vuex'
import { locale, routes } from '@/mixins'

export default {
  name: 'CourseEditHeader',

  mixins: [
    locale,
    routes
  ],

  computed: {
    ...mapGetters(['courseContent', 'courseRoutes'])
  },
  methods: {
    saveCourseChanges () {
      this.$emit('save')
      this.$router.push({
        name: 'course',
        params: {
          name,
          coursePath: this.coursePath === '' ? undefined : this.coursePath
        }
      })
    }
  }
}
</script>

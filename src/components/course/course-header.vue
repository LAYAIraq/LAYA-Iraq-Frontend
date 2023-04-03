<!--
  Filename: course-header.vue
  This component is used to display the header of the course detail page.
  It displays the course title, the breadcrumb and the title of the content
  to display.
  Author: cmc
  Since: v1.3.0
-->
<template>
  <div
    id="course-header"
    class="container-fluid"
  >
    <div
      id="course-title"
      class="row bg-dark"
    >
      <div class="col">
        <h1 class="text-center text-light py-3">
          <b>{{ courseName }}</b>
        </h1>
      </div>
    </div>
    <div
      id="course-breadcrumb"
      class="row bg-light"
    >
      <div class="container">
        <ol class="breadcrumb bg-light">
          <li :class="langIsAr? 'bci-ar': 'breadcrumb-item'">
            <router-link
              :to="{ name: 'course-list' }"
              class="text-dark"
            >
              <i class="fas fa-house-user"></i> {{ y18n('courses.title') }}
            </router-link>
          </li>
          <li :class="langIsAr? 'bci-ar': 'breadcrumb-item'">
            <router-link
              :to="{ name: 'course', params: { name: slugify(courseName) } }"
              class="text-dark"
            >
              {{ courseName }}
            </router-link>
          </li>
          <li
            v-for="(subchapter, i) in subchapters"
            :key="i"
            :class="langIsAr? 'bci-ar': 'breadcrumb-item'"
          >
            <router-link
              :to="{
                name: 'course',
                params: {
                  name: slugify(courseName),
                  coursePath: subchapters.slice(0, i + 1).join('/')
                }
              }"
            >
              {{ chapterName(subchapter) }}
            </router-link>
          </li>
          <li
            class="breadcrumb-item active"
            aria-current="page"
          >
            {{ courseSimple? contentTitle.simple: contentTitle.text }}
          </li>
        </ol>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { locale } from '@/mixins'
import { slugify, unslugify } from '@/misc/course-structure-methods'

export default {
  name: 'CourseHeader',
  mixins: [locale],
  props: {
    contentTitle: {
      type: Object,
      required: true
    },
    courseName: {
      type: String,
      required: true
    },
    coursePath: {
      type: String,
      required: true
    }
  },
  computed: {
    ...mapGetters(['courseChapterNames', 'courseSimple']),
    /**
     * @function returns subchapter slugs of the current coursePath
     * @author cmc
     * @since v1.3.0
     * @returns {string[]} The subchapter slugs of the current coursePath
     */
    subchapters () {
      return this.coursePath.split('/').slice(0, -1)
    }
  },
  methods: {
    /**
     * @function returns the name of the chapter to display in the breadcrumb, using lookup in courseChapterNames if available, otherwise unslugifying the chapter name.
     * @author cmc
     * @since v1.3.0
     * @param chapter {string} slug of the chapter
     * @returns {string} The name of the chapter to display
     */
    chapterName (chapter) {
      return this.courseChapterNames[chapter] ?? unslugify(chapter)
    },
    slugify
  }
}
</script>
<style>
/* Styles for Arabic breadcrumb, mostly copied from Bootstrap */
.bci-ar + .bci-ar {
  padding-right: .5rem;
}
.bci-ar + .bci-ar::before {
  content: '>';
  float: right;
  padding-left: .5rem;
  color: #6c757d;
}
.bci-ar + .breadcrumb-item.active::before {
  content: '>';
  float: right;
  padding-right: .5rem;
  padding-left: .5rem;
  color: #6c757d;
}
</style>

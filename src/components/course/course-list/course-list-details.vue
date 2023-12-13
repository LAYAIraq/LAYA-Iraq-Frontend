<!--
  Filename: course-list-details.vue
  Use: List all available courses, users can start or enroll
  Creator: core
  Since: 1.0.0
-->

<template>
  <div
    class="course-list-details"
    :class="langIsAr? 'text-right' : 'text-left'"
  >
    <div class="container-fluid">
      <div
        v-if="filtered.length === 0"
        class="row"
      >
        <div
          class="col"
          aria-live="polite"
        >
          <h2
            class="text-center text-muted"
          >
            {{ y18n('noCourses') }}
          </h2>
        </div>
      </div>
      <div
        v-if="filtered.length > 0"
        class="container"
      >
        <b-table
          :items="filtered"
          :fields="fields"
          responsive
          stacked="md"
          class="my-4"
        >
          <template #cell(name)="data">
            {{ data.item.name }}
            <span
              v-if="data.item.author === userId"
            >
              <i
                v-b-tooltip.bottom
                class="fas fa-user-graduate"
                :title="y18n('courseList.authorRights')"
              ></i>
            </span>
          </template>

          <template #cell(authorName)="data">
            {{ data.item.authorName === "" || data.item.authorName === null ? y18n('profile.language.notlisted') : data.item.authorName }}
          </template>

          <template #cell(language)="data">
            {{ languageList.some(lang => lang === data.item.language) ? y18n(`profile.language.${data.item.language}`) : y18n('profile.language.notlisted') }}
          </template>

          <template #cell(properties)="data">
            <ul class="course-props">
              <li
                v-for="set in Object.entries(data.item.properties).filter(k => k[0] !== 'simple')"
                v-show="set[1]"
                :key="`setting-${set[0]}`"
              >
                <span
                  v-b-tooltip.top
                  :title="i18n[`courseList.properties.${set[0]}`]"
                >
                  <i
                    class="icons-list"
                    :class="getIcon(set[0])"
                    :aria-describedby="`label-desc-${set[0]}`"
                  ></i>
                  <span
                    :id="`label-desc-${set[0]}`"
                    class="sr-only"
                  >{{ i18n[`courseList.properties.${set[0]}`] }}</span>
                </span>
              </li>
            </ul>
          </template>

          <template #cell(actions)="data">
            <b-button
              variant="primary"
              @click="data.toggleDetails"
            >
              {{ data.detailsShowing ? 'Hide Details' : 'Show Details' }}
            </b-button>
            <div>
            </div>
            <b-button
              class="start-button"
              variant="success"
              @click="decideButtonAction(data.item)"
            >
              <div class="row">
                <div
                  v-if="complicitReady && !complicitCourses.has(data.item.courseId)"
                  v-b-tooltip.top
                  :title="y18n('courseList.notComplicit')"
                  class="indicate-icon"
                >
                  <i class="fas fa-exclamation-circle"></i>
                </div>

                <div
                  v-if="isEnrolled(data.item)"
                  class="col"
                >
                  {{ y18n('courseList.start') }} <i :class="langIsAr ? 'fas fa-arrow-left' : 'fas fa-arrow-right'"></i>
                </div>
                <div
                  v-else
                  class="col"
                >
                  {{ y18n('courseList.subscribe') }} <i class="fas fa-file-signature"></i>
                </div>
              </div>
            </b-button>
          </template>
          <template #row-details="row">
            <b-card
              :header="y18n('abstract')"
              header-class="collap-header"
              body-class="collap-body"
            >
              {{ null === row.item.abstract ? y18n('abstract.notListed') : row.item.abstract }}
            </b-card>

            <b-card
              :header="y18n('cat')"
              header-class="collap-header"
              body-class="collap-body"
            >
              {{ categoryList.some(cat => cat === row.item.category) ? y18n(`course.category.${row.item.category}`) : y18n('course.category.other') }}
            </b-card>

            <b-card
              :header="y18n('keywords')"
              header-class="collap-header"
              body-class="collap-body"
            >
              {{ null === row.item.keywords ? y18n('keywords.notListed') : row.item.keywords }}
            </b-card>
          </template>
        </b-table>
      </div>
    </div>
    <b-modal
      id="noncomplicit-confirm"
      :title="y18n('courseList.notComplicit.title')"
      header-bg-variant="warning"
      centered
      static
      @ok="buttonAction()"
      @cancel="$router.push('/profile')"
    >
      <p>
        {{ y18n('courseList.notComplicit') }}.
        {{ y18n('courseList.notComplicit.text') }}:
      </p>
      <ul>
        <li
          v-for="thing in nonComplicitList"
          :key="thing"
        >
          <strong>{{ y18n(`profile.defmedia.${thing}`) }}</strong>:
          {{ y18n(`courseList.notComplicit.${thing}Hint`) }}
        </li>
      </ul>

      <template #modal-footer="{ ok, cancel, hide }">
        <b-button
          variant="success"
          @click="ok"
        >
          {{ y18n('courseList.notComplicit.continue') }}
        </b-button>
        <b-button
          variant="warning"
          @click="cancel"
        >
          {{ y18n('courseList.notComplicit.settings') }}
        </b-button>
        <b-button
          variant="primary"
          @click="hide"
        >
          {{ y18n('cancel') }}
        </b-button>
      </template>
    </b-modal>
  </div>
</template>

<script>
// import http from 'axios'
import { mapGetters } from 'vuex'
import { locale, storeHandler } from '@/mixins'
import { slugify } from '@/mixins/general/slugs'
import courseCategories from '@/options/course-categories.ts'
import languages from '@/options/languages.ts'

export default {
  name: 'CourseListDetails',

  mixins: [
    locale,
    storeHandler
  ],

  props: {
    filter: {
      type: String,
      default () {
        return ''
      }
    }
  },

  data () {
    return {
      fields: [],
      courseDetails: {},
      authorName: '',
      buttonAction: null,
      complicitCourses: null,
      complicitCheck: null,
      enrolledIn: [],
      filteredList: [],
      nonComplicitSettings: {},
      nonComplicitList: [],
      selectedCourse: '',
      items: []
    }
  },

  computed: {
    ...mapGetters([
      'course',
      'courseList',
      'preferencesMedia',
      'userId'
    ]),

    /**
     * categoryList(): add categories
     * Author: nv
     * Since: v1.3.0
     */
    categoryList () {
      return [
        ...courseCategories
      ]
    },

    /**
     * languageList(): add languages
     * Author: nv
     * Since: v1.3.0
     */
    languageList () {
      return [
        ...languages
      ]
    },

    /**
     * function complicitReady(): returns true if complicit Set has any members
     *
     * Author: cmc
     *
     * Last Updated: November 9, 2021
     * @returns {boolean} true if complicitCourses set has at least one member
     */
    complicitReady () {
      return this.complicitCourses !== null
    },

    /**
     * filtered: filter course list depending on user input
     *
     * Author: core
     *
     * Last updated: March 24, 2021
     */
    filtered () {
      if (!this.filter) return this.courseList
      const filterByCourseName = new RegExp(this.filter, 'i')
      return this.filteredList.filter(course => filterByCourseName.test(course.name))
    }
  },

  watch: {
    // watch course list in order to have non-complicit indicator at first load
    courseList () {
      this.getComplicitCourses()
    }
  },

  created () {
    this.filtered.forEach((item, index) => {
      this.$set(this.courseDetails, index, false)
    })

    this.getSubs()
    this.filteredList = [...this.courseList]
    this.getComplicitCourses()
  },

  mounted () {
    this.fields = [
      { key: 'name', label: this.y18n('courseName') },
      { key: 'authorName', label: this.y18n('author') },
      { key: 'language', label: this.y18n('courseLanguage') },
      { key: 'properties', label: this.y18n('courseList.properties') },
      { key: 'actions', label: '' }
    ]
  },

  methods: {
    // // TEST, commented out for coverage reasons
    // debounce (fn, delay) {
    //   let timeoutID = null
    //   return () => {
    //     clearTimeout(timeoutID)
    //     const args = arguments
    //     const ctx = this
    //     timeoutID = setTimeout(() => {
    //       fn.apply(ctx, args)
    //     }, delay)
    //   }
    // },

    /**
     * function markAsNonComplicit: add array in nonComplicitSettings if not
     *  present for courseId, add property to array
     * @param courseId id of course that is non-complicit
     * @param property property to be added
     */
    markAsNonComplicit (courseId, property) {
      if (!this.nonComplicitSettings[courseId]) {
        this.nonComplicitSettings[courseId] = []
      }
      this.nonComplicitSettings[courseId].push(property)
      // this.complicitCourses.delete(courseId)
    },

    /**
     * function getComplicitCourses: check user's preferences and
     *  check if course complies to them, if not, remove from
     *  complicitCourses and add list to nonComplicitSettings
     *
     *  Author: cmc
     *
     *  Last Updated: October 29, 2021
     */
    getComplicitCourses () {
      this.complicitCourses = new Set()
      // check all courses for complicity with user preferences
      for (const course of this.courseList) {
        // eslint-disable-next-line
        const props = (({enrollment, ...o}) => o) (course.properties) // filter enrollment, can be removed when it is reinstated
        let complicit = true
        for (const prop of Object.keys(this.preferencesMedia)) { // check each user pref
          // check prop settings in course's props array
          if (Object.prototype.hasOwnProperty.call(props, prop)) { // setting is found in props
            if (props[prop] !== this.preferencesMedia[prop]) { // if not the same as user's pref, mark non complicit
              complicit = false
              this.markAsNonComplicit(course.courseId, prop)
            }
          }
          // else statement omitted b/c prop not present in course, no valid assessment can be made
        }
        if (complicit) {
          this.complicitCourses.add(course.courseId)
          this.items = this.complicitCourses.add(course.courseId)
        }
      }
    },

    /**
     * function decideButtonAction: redirect to course or show modal
     *  depending on course status concerning media preferences
     *
     *  Author: cmc
     *
     *  Last Updated: October 29, 2021
     *  @param {object} course corresponding course to button
     */
    decideButtonAction (course) {
      // boolean if course is complicit w/ user settings
      const complicit = this.complicitCourses.has(course.courseId)
      this.buttonAction = this.isEnrolled(course)
        ? () => {
            if (course.name !== this.course.name) {
              this.courseFetch(course.name)
            }
            this.$router.push({ name: 'course', path: '/courses', params: { name: slugify(course.name) } })
          }
        : () => { this.subscribe(course) }
      if (this.complicitReady && !complicit) {
        // console.log('not complicit, adding' +
        //   this.nonComplicitSettings[course.courseId] + ' to list...')
        this.nonComplicitList = this.nonComplicitSettings[course.courseId]
        this.$bvModal.show('noncomplicit-confirm')
      } else {
        // console.log('complicit, doing button action...')
        this.buttonAction()
      }
    },

    /**
     * function getIcon: return string for icon corresponding to setting prop
     *
     * Author: cmc
     *
     * Last Updated: October 26, 2021
     * @param {string} setting prop that need icon
     * @returns {string} icon name
     */
    getIcon (setting) {
      switch (setting) {
        case 'enrollment':
          return 'fas fa-key'
        case 'simpleLanguage':
          return 'fas fa-check-circle'
        case 'text':
          return 'fas fa-envelope-open-text'
        case 'video':
          return 'far fa-play-circle'
        default:
          return ''
      }
    },
    /**
     * Function getSubs: get a list of all courses the user enrolled in
     *
     * Author: cmc
     *
     * Last Updated: May 24, 2022
     */
    getSubs () {
      this.$store.dispatch('enrollmentsUserFetch')
        .then((data) => {
          const list = data.data.sublist
          for (const item of list) {
            this.enrolledIn.push(item.courseId)
          }
        })
    },
    /**
     * Function isEnrolled: return false if course needs an enrollment
     *  AND user is not enrolled, true if nono enrollment needed or user
     *  is enrolled
     *
     * Author: cmc
     *
     * Last Updated: October 26, 2021
     * @param course the Course object for which it's checked
     * @returns false if course needs enrollment and user is not enrolled
     */
    isEnrolled (course) {
      return course.properties.enrollment
        ? this.enrolledIn.find(x => x === course.courseId)
        : true
    },
    /**
     * Function subscribe: Lets user enroll in a course
     *
     * @param course the course the user wants to enroll in
     *
     * Author: cmc
     *
     * Last Updated: September 8, 2022
     *
     */
    subscribe (course) {
      const newEnrollment = {
        courseId: course.courseId,
        studentId: this.userId
      }
      // create enrollment in database
      this.$store.dispatch('enrollmentCreate', newEnrollment)
        .then(courseId => this.enrolledIn.push(courseId))
    },
    toggleDetails (index) {
      // Toggle the details for the specified row
      this.$set(this.courseDetails, index, !this.courseDetails[index])
    }
  }
}

</script>

<style scoped>
*:focus {
  outline-offset: 5px;
  outline: 2px dashed deepskyblue;
}

.header {
  border-bottom: 2px solid black;
}

.course {
  border-bottom: 1px dashed black;
}

.course-props {
  list-style-type: none;
  padding: 0;
}

.course-props li {
  display: inline-block;
  margin-right: 1.5rem;
}

.course > div {
  font-size: 120%;
}

.indicated-btn {
  border: 2px solid black;
  color: #343a40;
  display: inline-block;
  padding: .25rem .5rem .25rem .5rem;
  position: relative;
  text-align: center;
  width: 100%;
  word-break: break-word;
  word-wrap: break-word;
}

.indicate-icon {
  color: red;
  font-size: 1.5rem;
  margin: -5px;
  text-shadow: -2px 0 #fff, 0 2px #fff, 2px 0 #fff, 0 -2px #fff;
}
i.icons-list {
  font-size: 1.75rem;
}

.author-icon-left {
  font-size: 1.5rem;
  margin-left: -3rem;
  margin-right: 1.5rem;
}

.author-icon-right {
  font-size: 1.5rem;
  margin-left: 1.5rem;
  margin-right: -3rem;
}

.collap-button {
  position: absolute;
}

.collap-button-ar {
  position: absolute;
}

.collap-header {
  font-weight: bold;
}

.collap-body {
  font-size: 16px;
}

.start-button {
  width: 200px;
}

</style>

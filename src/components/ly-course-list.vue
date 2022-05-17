<!--
Filename: ly-course-list.vue
Use: List all available courses, users can start or enroll
Creator: core
Date: unknown
Dependencies:
  @/mixins/locale.vue,
  axios,
  vuex
-->

<template>
  <div
    class="laya-course-list"
    :class="langIsAr? 'text-right' : 'text-left'"
  >
    <div class="container-fluid">
      <div class="row">
        <div
          class="col"
          aria-live="polite"
        >
          <h2
            v-show="filtered.length === 0"
            class="text-center text-muted"
          >
            {{ y18n('noCourses') }}
          </h2>
        </div>
      </div>

      <div
        v-if="filtered.length > 0"
        class="row header"
      >
        <div class="col">
          <h2>{{ y18n('namePH') }}</h2>
        </div>
        <div class="col">
          <h4>{{ y18n('cat') }}</h4>
        </div>
        <div class="col-2">
          <h2 class="sr-only">
            {{ y18n('courseList.properties') }}
          </h2>
        </div>
        <div class="col-3">
        </div>
      </div>

      <div
        v-for="course in filtered"
        :key="course.category+'-'+course.name"
        class="row py-3 course"
      >
        <div class="col">
          {{ course.name }}
        </div>

        <div class="col">
          {{ course.category }}
        </div>

        <div class="col-2">
          <ul class="course-props">
            <li
              v-for="set in Object.entries(course.properties).filter(k => k[0] !== 'simple')"
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
                >
                  {{ i18n[`courseList.properties.${set[0]}`] }}
                </span>
              </span>
            </li>
          </ul>
        </div>

        <div class="col-3">
          <router-link
            v-if="isEnrolled(course)"
            :to="'/courses/'+course.name+'/1'"
            class="btn indicated-btn"
            @click="decideButtonAction(course)"
          >
            {{ i18n['courseList.start'] }}
            <i class="fas fa-arrow-right"></i>
          </router-link>
          <a
            v-else
            class="btn indicated-btn"
            @click="subscribe(course)"
          >
            {{ i18n['courseList.subscribe'] }}
            <i class="fas fa-file-signature"></i>
          </a>
          <div
            v-if="complicitReady && !complicitCourses.has(course.courseId)"
            v-b-tooltip.top
            class="indicate-icon"
            :title="y18n('courseList.notComplicit')"
          >
            <i class="fas fa-exclamation-circle"></i>
          </div>
        </div>
      </div>
    </div>
    <b-modal
      id="noncomplicit-confirm"
      :title="y18n('courseList.notComplicit.title')"
      header-bg-variant="warning"
      centered
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
        <b-button @click="hide">
          {{ y18n('cancel') }}
        </b-button>
      </template>
    </b-modal>
  </div>
</template>

<script>
import http from 'axios'
import { mapGetters } from 'vuex'
import { locale, storeHandler } from '@/mixins'
export default {
  name: 'LayaCourseList',
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
      buttonAction: null,
      complicitCourses: null,
      complicitCheck: null,
      enrolledIn: [],
      filteredList: [],
      nonComplicitSettings: {},
      nonComplicitList: [],
      selectedCourse: ''
    }
  },
  computed: {
    ...mapGetters([
      'course',
      'courseList',
      'mediaPrefs',
      'userId',
      'fetchSingleEnrollment'
    ]),
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
    this.getSubs()
    this.filteredList = [...this.courseList]
    this.getComplicitCourses()
  },
  methods: {
    // TEST
    debounce (fn, delay) {
      let timeoutID = null
      return () => {
        clearTimeout(timeoutID)
        const args = arguments
        const ctx = this
        timeoutID = setTimeout(() => {
          fn.apply(ctx, args)
        }, delay)
      }
    },
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
        for (const prop of Object.keys(this.mediaPrefs)) { // check each user pref
          // check prop settings in course's props array
          if (Object.prototype.hasOwnProperty.call(props, prop)) { // setting is found in props
            if (props[prop] !== this.mediaPrefs[prop]) { // if not the same as user's pref, mark non complicit
              complicit = false
              this.markAsNonComplicit(course.courseId, prop)
            }
          }
          // else statement omitted b/c prop not present in course, no valid assessment can be made
        }
        if (complicit) {
          this.complicitCourses.add(course.courseId)
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
              this.fetchCourse(course.name)
            }
            this.$router.push('/courses/' + course.name + '/1')
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
          return 'key'
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
     * Last Updated: unknown
     */
    getSubs () {
      const data = this.fetchSingleEnrollment
      console.log(this.fetchSingleEnrollment)
      const list = data.sublist
      for (const item of list) {
        this.enrolledIn.push(item.courseId)
      }
    },
    /**
     * Function isEnrolled: return true if course needs an enrollment
     *  AND user is not enrolled, false if nono enrollment needed or user
     *  is enrolled
     *
     * Author: cmc
     *
     * Last Updated: October 26, 2021
     * @param course the Course object for which it's checked
     * @returns true if course needs enrollment and user is not enrolled
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
     * Last Updated: March 12, 2021
     *
     */
    subscribe (course) {
      const self = this
      const newEnrollment = {
        courseId: course.courseId,
        studentId: this.userId
      }
      //   /* create enrollment */
      http.post('enrollments/create', newEnrollment)
        .then((resp) => {
          self.enrolledIn.push(resp.data.enrol.courseId)
        })
        .catch((err) => console.error(err))
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
  position: absolute;
  top: -1px;
  left: 5px;
  color: crimson;
  font-size: 2rem;
}

i.icons-list {
  font-size: 1.75rem;
}

</style>

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
            {{ i18n['noCourses'] }}
          </h2>
        </div>
      </div>

      <div class="row header" v-if="filtered.length > 0">
        <div class="col">
          <h2>{{ i18n['namePH'] }}</h2>
        </div>
        <div class="col">
          <h4>{{ i18n['cat'] }}</h4>
        </div>
        <div class="col-2">
          <h2 class="sr-only">{{ i18n['courseList.properties'] }}</h2>
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
              v-for="set in Object.entries(course.properties)"
              :key="`setting-${set[0]}`"
              v-show="set[1]"
            >
              <span
                :title="i18n[`courseList.properties.${set[0]}`]"
                v-b-tooltip.top
              >
                <b-icon
                  :icon="getIcon(set[0])"
                  :aria-describedby="`label-desc-${set[0]}`"
                  scale="1.5"
                ></b-icon>
                <span
                  class="sr-only"
                  :id="`label-desc-${set[0]}`"
                >
                  {{ i18n[`courseList.properties.${set[0]}`] }}
                </span>
              </span>
            </li>
          </ul>
        </div>

        <div class="col-3">
          <a
            class="btn indicated-btn"
            @click="decideButtonAction(course)"
          >
            {{ i18n['courseList.start'] }}
            <i class="fas fa-arrow-right"></i>
          </a>
<!--          <router-link-->
<!--            :to="'/courses/'+course.name+'/1'"-->
<!--            class="btn indicated-btn"-->
<!--            v-if="isEnrolled(course)"-->
<!--            @click="selectedCourse = course.name"-->
<!--          >-->
<!--            {{ i18n['courseList.start'] }}-->
<!--            <i class="fas fa-arrow-right"></i>-->
<!--          </router-link>-->
<!--          <a-->
<!--            class="btn indicated-btn"-->
<!--            v-else-->
<!--            @click="subscribe(course)"-->
<!--          >-->
<!--            {{ i18n['courseList.subscribe'] }}-->
<!--            <i class="fas fa-file-signature"></i>-->
<!--          </a>-->
          <div
            v-if="complicitReady && !complicitCourses.has(course.courseId)"
            class="indicate-icon"
            :title="i18n['courseList.notComplicit']"
            v-b-tooltip.top
          >
            <b-icon
            icon="exclamation-diamond-fill"
            scale="2"
            ></b-icon>
          </div>

        </div>
      </div>

    </div>
    <b-modal
      id="noncomplicit-confirm"
      :title="i18n['courseList.notComplicit.title']"
      header-bg-variant="warning"
      @ok="buttonAction()"
      @cancel="$router.push('/profile')"
      centered
    >
      <p>
        {{ i18n['courseList.notComplicit'] }}.
        {{ i18n['courseList.notComplicit.text'] }}:
      </p>
        <ul>
          <li
            v-for="thing in nonComplicitList"
            v-bind:key="thing"
          >
            <strong>{{ i18n[`profile.defmedia.${thing}`] }}</strong>:
            {{ i18n[`courseList.notComplicit.${thing}Hint`]}}
          </li>
         </ul>

      <template #modal-footer="{ ok, cancel, hide }">
        <b-button
          variant="success"
          @click="ok"
        >
          {{ i18n['courseList.notComplicit.continue'] }}
        </b-button>
        <b-button
          variant="warning"
          @click="cancel"
        >
          {{ i18n['courseList.notComplicit.settings'] }}
        </b-button>
        <b-button @click="hide">
          {{ i18n['cancel'] }}
        </b-button>
      </template>
    </b-modal>
  </div>
</template>

<script>
// import http from 'axios'
import { mapGetters } from 'vuex'
import { locale } from '@/mixins'

export default {
  name: 'laya-course-list',

  mixins: [
    locale
  ],

  data() {
    return {
      buttonAction: null,
      complicitCourses: new Set(),
      // enrolledIn: [],
      filteredList: [],
      nonComplicitSettings: {},
      nonComplicitList: [],
      selectedCourse: ''
    }
  },

  props: {
    filter: String,
  },

  computed: {
    ...mapGetters([
      'courseList',
      'mediaPrefs',
      'userId'
    ]),

    /**
     * function complicitReady(): returns true if complicit Set has any members
     *
     * Author: cmc
     *
     * Last Updated: November 9, 2021
     * @returns {boolean} true if complicitCourses set has at least one member
     */
    complicitReady() {
      return this.complicitCourses.size > 0
    },

     /**
     * filtered: filter course list depending on user input
     *
     * Author: core
     *
     * Last updated: March 24, 2021
     */
    filtered() {
      if (!this.filter) return this.courseList
      const filterByCourseName = new RegExp(this.filter, 'i')
      return this.filteredList.filter(course => filterByCourseName.test(course.name))
    }
  },

  created() {
    // COMMENTED OUT B/C ENROLLMENT DISABLED (cmc 2021-11-09)
    // this.getSubs()
    this.filteredList = [...this.courseList]
    this.getComplicitCourses()
  },

  methods: {

    /**
     * function getComplicitCourses: check user's preferences and
     *  check if course complies to them, if not, remove from
     *  complicitCourses and add list to nonComplicitSettings
     *
     *  Author: cmc
     *
     *  Last Updated: October 29, 2021
     */
    getComplicitCourses() {
      for (const course of this.filtered) {
        this.complicitCourses.add(course.courseId)
        const markAsNoncomplicit = (thing) => {
          if(!this.nonComplicitSettings[course.courseId]) {
            this.nonComplicitSettings[course.courseId] = []
          }
          this.nonComplicitSettings[course.courseId].push(thing)
          this.complicitCourses.delete(course.courseId)
        }
        // eslint-disable-next-line
        const props = (({enrollment, ...o}) => o) (course.properties) // filter enrollment
        for (const thing of Object.keys(this.mediaPrefs)) { //check each user pref
          // console.log(thing)
          if (Object.prototype.hasOwnProperty.call(props, thing)) {
            if (props[thing] !== this.mediaPrefs[thing]) {
              markAsNoncomplicit(thing)
            }
          }
          // } else {
          //   if markAsNoncomplicit(thing)
          // }
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
    decideButtonAction(course) {
      const complicit = this.complicitCourses.has(course.courseId)
      this.buttonAction = // this.isEnrolled(course) ? // commented out case of enrollment
        () =>  { this.$router.push('/courses/'+course.name+'/1') } // :
        // () => { this.subscribe(course) }
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
     * function compliesWithUserPrefs(): returns true if user had set
     *  prop in their prefs
     *
     *  Author: cmc
     *
     *  Last Updated: October 28, 2021
     * @param {string} prop corresponding to setting in profile.prefs.media
     * @returns {boolean} true if user has set that prop in their preferences
     *  or it is not a user pref
     */
    compliesWithUserPrefs(prop) {
      if (Object.prototype.hasOwnProperty.call(this.mediaPrefs, prop)) {
        return this.mediaPrefs[prop]
      } else {
        return prop === 'enrollment'
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
    getIcon(setting) {
      switch (setting) {
        // case 'enrollment':
        //   return 'key' // commented out b/c enrollment is disabled
        case 'simpleLanguage':
          return 'check2-circle'
        case 'text':
          return 'textarea-t'
        case 'video':
          return 'play-btn'
        default:
          return ''
      }
    },

    // COMMENTED OUT B/C ENROLLMENT DISABLED (cmc 2021-11-09)
    // /**
    //  * Function getSubs: get a list of all courses the user enrolled in
    //  *
    //  * Author: cmc
    //  *
    //  * Last Updated: unknown
    //  */
    // getSubs() {
    //   let self = this
    //   let studentId = this.userId
    //
    //   http
    //     .get(`enrollments/getAllByStudentId/?uid=${studentId}`)
    //     .then(({ data }) => {
    //       const list = data.sublist
    //       for(let item of list) {
    //         self.enrolledIn.push(item.courseId)
    //       }
    //     })
    //     .catch(err => {
    //       // console.log(`No enrollments for ${studentId} found`)
    //       console.error(err)
    //     })
    //
    // },
    //
    // /**
    //  * Function isEnrolled: return true if course needs an enrollment
    //  *  AND user is not enrolled, false if nono enrollment needed or user
    //  *  is enrolled
    //  *
    //  * Author: cmc
    //  *
    //  * Last Updated: October 26, 2021
    //  * @param course the Course object for which it's checked
    //  * @returns true if course needs enrollment and user is not enrolled
    //  */
    // isEnrolled(course) {
    //   return course.properties.enrollment?
    //    this.enrolledIn.find(x => x === course.courseId) :
    //    true
    // },

    // COMMENTED OUT B/C ENROLLMENT DISABLED (cmc 2021-11-09)
    // /**
    //  * Function subscribe: Lets user enroll in a course
    //  *
    //  * @param course the course the user wants to enroll in
    //  *
    //  * Author: cmc
    //  *
    //  * Last Updated: March 12, 2021
    //  *
    //  */
    // subscribe(course) {
    //   const self = this
    //   const newEnrollment = {
    //     courseId: course.courseId,
    //     studentId: this.userId
    //   }
    //
    //   /* create enrollment */
    //   http.post('enrollments/create', newEnrollment)
    //     .then((resp) => {
    //       self.enrolledIn.push(resp.data.enrol.courseId)
    //     })
    //     .catch((err) => console.error(err))
    //
    // }
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
  top: 3px;
  left: 3px;
  color: crimson;
}
</style>

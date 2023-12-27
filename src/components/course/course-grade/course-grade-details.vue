<template>
  <div>
    <label for="courseContentSelect">Select Course Content:</label>
    <select id="courseContentSelect" v-model="selectedContent">
      <option v-for="content in courseContents" :key="content.id" :value="content">
        {{ content.title.text }}
      </option>
    </select>
    <button @click="setSelectedContent">Set Selected Content</button>
    <div v-if="selectedContent">
      <h3>Selected Content:</h3>
      <p>{{ selectedContent.title.id }}</p>
    </div>
    <div v-if="textList && textList.length && selectedContent">
      {{ users }}
      <hr>
      <div v-for="(item, index) in textList" :key="index">
        {{ item.studentId }}<br>
        <div :id="'user-' + index"></div>
        <div :id="'quill-' + index" class="quill-content"></div><br>
        {{ item.freetext }}<br>
        <input v-model="item.inputValue" type="number" :placeholder="'Input ' + (index + 1)" />
        <button
          type="button"
          @click="addGrade(item.inputValue, item)"
        >Grade
        </button>
        <hr v-if="index !== textList.length - 1" />
      </div>
    </div>
    <div v-else>
      No enrollment data available.
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Quill from 'quill'

export default {
  data () {
    return {
      selectedContent: null,
      quillInstances: []
    }
  },

  computed: {
    ...mapGetters([
      'users',
      'enrollmentList',
      'textList'
    ]),
    courseContents () {
      const List = this.$store.getters.course.courseContent
      const freeTextQuestions = Object.keys(List)
        .filter(contentId => List[contentId].name === 'free-text-question')
        .map(contentId => List[contentId])
      return freeTextQuestions
    }
  },

  watch: {
    selectedContent: {
      handler (newVal) {
        if (newVal) {
          this.$store.dispatch('getCourseFreeTexts', this.$store.getters.course.courseId, newVal.title.id)
        }
      },
      immediate: true // To trigger the handler immediately upon component creation
    },
    enrollmentList: {
      handler (newVal, oldVal) {
        console.log('enrollmentList watch')
        console.log(newVal !== oldVal, this.enrollmentList, this.enrollmentList.length > 0)
        if (newVal.length !== oldVal.length && this.enrollmentList && this.enrollmentList.length > 0) {
          // console.log('llllllllllllllllllllllll')
          // this.initializeQuillEditors()
        }
      },
      deep: true
    },
    textList: {
      handler (newVal, oldVal) {
        console.log('textList watch')
        console.log(newVal !== oldVal, this.textList, this.textList.length > 0)
        if (newVal.length !== oldVal.length && this.textList && this.textList.length > 0) {
          console.log('llllllllllllllllllllllll')
          console.log(this.textList)
          this.initializeUsers()
          this.initializeQuillEditors()
        }
      },
      deep: true
    },
    users: {
      handler (newVal, oldVal) {
        console.log('users watch')
        console.log(oldVal.length)
        console.log(newVal.length)
        console.log(this.users.length)
        if (newVal.length > 0 && this.textList && this.users.length > 0) {
          console.log('++++++++++++++')
          this.initializeUsers()
        }
      }
    }
  },

  mounted () {
    this.$nextTick(() => {
      this.initializeQuillEditors()
      this.initializeUsers()
      console.log('-------              ---###')
      const freeTextQuestions = Object.keys(this.courseContents)
        .filter(contentId => this.courseContents[contentId].name === 'free-text-question')
        .map(contentId => this.courseContents[contentId])

      console.log(freeTextQuestions)

      console.log(this.courseContent)
      console.log(this.$store.getters.course.courseContent)
      console.log(freeTextQuestions)
    })
  },

  created () {
    this.getUserList()
    this.$store.dispatch('getCourseEnrollments', this.$store.getters.course.courseId)
    // console.log('enrollments!')
    // console.log(this.enrollmentList)
    // console.log(this.users)
    // console.log('säää')
    // const listOfIdsToMatch = [3, 4]
    // this.filteredList = this.users.filter(obj => listOfIdsToMatch.includes(obj.id))
    // console.log('FilteredListss:', this.users.filter(obj => listOfIdsToMatch.includes(obj.id)))
    // console.log('FilteredList:', this.filteredList)
    // console.log(this.users)
    // console.log(this.getUserById(3))
  },

  methods: {

    setSelectedContent () {
      if (this.selectedContent) {
        console.log('BUTTON')
        console.log(this.selectedContent)
        console.log(this.$store.state)
        console.log(this.$store.state.task)
        console.log(this.textList)
        console.log(this.textList.length)
      }
    },

    addGrade (grade, item) {
      console.log(item)
      console.log(`add Grade ${grade}`)
      this.$store.commit('freetextGradeAdd', { enrollment: item, grade: grade })
      this.$store.dispatch('enrollmentUpdate', item)
      this.initializeUsers()
      // this.$store.commit('freetextGradeAdd', grade)
    },

    async initializeQuillEditors () {
      await this.$nextTick()
      console.log('tried to load textList')
      if (this.textList) {
        if (this.quillInstances) {
          this.destroyQuillInstances()
        }
        this.textList.forEach((item, index) => {
          console.log(`#quill-${index}`)
          const quill = new Quill(`#quill-${index}`, {
            theme: 'snow',
            readOnly: true
          })
          quill.setContents(item.freetext)
          this.quillInstances.push(quill)
        })
      }
    },

    destroyQuillInstances () {
      this.quillInstances.forEach(quill => {
        quill.off()
        quill.disable()
        quill.container.remove()
        quill = null
      })
      this.quillInstances = []
    },

    async initializeUsers () {
      await this.$nextTick()
      console.log('tried to load users')
      if (this.textList && this.users) {
        console.log('tried to actually load users')
        for (let index = 0; index < this.textList.length; index++) {
          const user = this.getUserById(this.textList[index].studentId)
          const divElement = document.getElementById(`user-${index}`)
          // await this.$store.dispatch('getCourseEnrollments', this.$store.getters.course.courseId)
          if (divElement) {
            divElement.innerHTML = `${this.textList[index].freetextGrade}- ${user.username}`
          } else {
            console.error('Element with id "myDiv" not found.')
          }
        }
        // this.enrollmentList.forEach((item, index) => {
        //   const user = this.getUserById(item.studentId)
        //   const divElement = document.getElementById(`user-${index}`)
        //   await this.$store.dispatch('enrollmentUpdate', this.enrollmentList[index])
        //   this.$store.dispatch('getCourseEnrollments', this.$store.getters.course.courseId)
        //   console.log(`${this.enrollmentList[index].freetextGrade} - ${user.username}`)
        //   console.log(this.enrollmentList[index])
        //   if (divElement) {
        //     divElement.innerHTML = `- ${user.username}`
        //   } else {
        //     console.error('Element with id "myDiv" not found.')
        //   }
        // })
      }
    },

    addQuill (index, content) {
      console.log(`${index}- loading ${content}`)
      const quill = new Quill(`#quill-${index}`, {
        theme: 'snow',
        readOnly: true
      })
      this.quillInstances.push(quill)
    },

    getUserList () {
      if (this.users.length === 0) {
        this.$store.dispatch('userListFetch')
      }
    },

    getUserById (id) {
      if (Array.isArray(this.users)) {
        return this.users.find(user => user.id === id)
      } else {
        console.error('Invalid this.users or it is not an array.')
        return null
      }
    }
  }

}
</script>

<style>
/* Add your table styling here if required */
table {
  border-collapse: collapse;
  width: 100%;
}

th, td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

th {
  background-color: #f2f2f2;
}
</style>

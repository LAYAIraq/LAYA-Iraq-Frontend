<template>
  <div>
    <label for="courseContentSelect">Select Course Content:</label>
    <select id="courseContentSelect" v-model="selectedContent">
      <option v-for="content in courseContents" :key="content.id" :value="content">
        {{ content.title.text }}
      </option>
    </select>
    <div v-if="selectedContent">
      <h3>Selected Content:</h3>
      <p>{{ selectedContent.title.id }}</p>
    </div>
    <div v-if="textList && textList.length && selectedContent">
      <div v-for="(item, index) in textList" :key="index">
        {{ item.studentId }}<br>
        <div :id="'user-' + index"></div>
        <div :id="'quill-' + index" class="quill-content"></div><br>
        <!-- {{ item.freetext }} -->
        <input v-model="item.inputGrade" type="number" :placeholder="'Input ' + (index + 1) "/>
        <input v-model="item.inputFeedback" type="text" placeholder="Enter new value" />
        <button
          type="button"
          @click="addGrade(item,{grade:item.inputGrade,feedback:item.inputFeedback})"
        >Grade
        </button>
        <hr v-if="index !== textList.length - 1" />
      </div>
    </div>
    <div v-else>
      No freetex task selected.
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
          this.$store.dispatch('getCourseFreeTexts', this.$store.getters.course.courseId, newVal.title.id, true)
        }
      },
      immediate: true // To trigger the handler immediately upon component creation
    },
    textList: {
      handler (newVal, oldVal) {
        if (newVal.length !== oldVal.length && this.textList && this.textList.length > 0) {
          this.initializeUsers()
          this.initializeQuillEditors()
        }
      },
      deep: true
    },
    users: {
      handler (newVal, oldVal) {
        if (newVal.length > 0 && this.textList && this.users.length > 0) {
          this.initializeUsers()
        }
      }
    }
  },

  mounted () {
    this.$nextTick(() => {
      this.initializeQuillEditors()
      this.initializeUsers()
      const freeTextQuestions = Object.keys(this.courseContents)
        .filter(contentId => this.courseContents[contentId].name === 'free-text-question')
        .map(contentId => this.courseContents[contentId])
      //console.log(this.$store.getters.course.courseContent)
      //console.log(freeTextQuestions)
    })
  },

  created () {
    this.getUserList()
    this.$store.dispatch('getCourseEnrollments', this.$store.getters.course.courseId)
  },

  methods: {

    async addGrade (item, { grade, feedback }) {
      await this.$store.commit('freetextGradeAdd', { task: item, grade: grade })
      await this.$store.commit('freetextFeedbackAdd', { task: item, feedback: feedback })
      await this.$store.dispatch('taskUpdate', item)
      this.initializeUsers()
    },

    async initializeQuillEditors () {
      await this.$nextTick()
      if (this.textList) {
        if (this.quillInstances) {
          this.destroyQuillInstances()
        }
        this.textList.forEach((item, index) => {
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
      if (this.textList && this.users) {
        for (let index = 0; index < this.textList.length; index++) {
          const user = this.getUserById(this.textList[index].studentId)
          const divElement = document.getElementById(`user-${index}`)
          if (divElement) {
            divElement.innerHTML = `${this.textList[index].rated} ${user.username} - ${this.textList[index].freetextGrade} - ${this.textList[index].feedback}`
          } else {
            console.error('Element with id not found.')
          }
        }
      }
    },

    addQuill (index, content) {
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

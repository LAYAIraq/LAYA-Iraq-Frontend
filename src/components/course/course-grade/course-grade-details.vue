<template>
  <div>
    <div v-if="enrollmentList && enrollmentList.length">
      {{ users }}
      <hr>
      <div v-for="(item, index) in enrollmentList" :key="index">
        {{ item.studentId }}<br>
        <div :id="'user-' + index"></div>
        <div :id="'quill-' + index" class="quill-content"></div><br>
        {{ item.freetext }}<br>
        <input v-model="item.inputValue" type="number" :placeholder="'Input ' + (index + 1)" />
        <button
          type="button"
          @click="addGrade(item.inputValue,index)"
        >Grade
        </button>
        <hr v-if="index !== enrollmentList.length - 1" />
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
      FilteredList: [],
      quillInstances: []
    }
  },

  computed: {
    ...mapGetters([
      'users',
      'enrollmentList'
    ])
  },

  watch: {
    enrollmentList: {
      handler (newVal, oldVal) {
        if (newVal.length > oldVal.length && this.enrollmentList && this.enrollmentList.length > 0) {
          this.initializeQuillEditors()
        }
      }
    },
    users: {
      handler (newVal, oldVal) {
        if (newVal.length > 0 && this.enrollmentList && this.users.length > 0) {
          this.initializeUsers()
        }
      }
    }
  },

  mounted () {
    this.$nextTick(() => {
      this.initializeQuillEditors()
      this.initializeUsers()
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

    addGrade (grade, item) {
      console.log(item)
      console.log(`add Grade ${grade}`)
      console.log(this.$store.state)
      console.log(this.$store.state.enrollement)
      // await this.$store.commit('freetextGradeAdd', { enrollment: this.enrollmentList[index], grade: 42 })
      // const res = await this.$store.dispatch('enrollmentUpdate', this.enrollmentList[index])
      // this.$store.commit('freetextGradeAdd', grade)
    },

    async initializeQuillEditors () {
      await this.$nextTick()
      console.log('tried to load enrollmentList')
      if (this.enrollmentList) {
        this.enrollmentList.forEach((item, index) => {
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

    async initializeUsers () {
      await this.$nextTick()
      console.log('tried to load users')
      if (this.enrollmentList && this.users) {
        for (let index = 0; index < this.enrollmentList.length; index++) {
          const user = this.getUserById(this.enrollmentList[index].studentId)
          const divElement = document.getElementById(`user-${index}`)
          const res = await this.$store.dispatch('enrollmentUpdate', this.enrollmentList[index])
          // await this.$store.dispatch('getCourseEnrollments', this.$store.getters.course.courseId)
          console.log('das rtes')
          console.log(`${this.enrollmentList[index].freetextGrade} - ${user.username}`)
          console.log(this.enrollmentList[index])
          console.log(res)
          if (divElement) {
            divElement.innerHTML = `${this.enrollmentList[index].freetextGrade}- ${user.username}`
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
